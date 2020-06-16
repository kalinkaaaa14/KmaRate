'use strict'

const router = require('express').Router();
const db = require('./database');

const links = require('../links');
const {checkNotAuthenticated, checkAuthenticated, checkAdmin} = require('../access_control/check_auth');
db.getAdmin = require('../access_control/database').getAdmin;
db.getUser = require('../users/database').getUser;
db.getBranches = require('../web_server/database').getBranches;
db.getEPReviewsUserRate = require('../users/database').getEPReviewsUserRate;


router.post(links.NEW + links.EXCHANGE_PROGRAM, checkAuthenticated, checkAdmin, async function (req, res, next) {
    try {
        let ep = req.body;

        if (ep.title.length > 50) {
            return res.json({message: 'Назва програми перевищує 50 символів'});
        }

        let epInDB = await db.addEP(ep.title, ep.university);

        for (let branch of ep.branchs) {
            await db.addEPBranch(epInDB.id, branch.id);
        }

        return res.json({message: 'Програму обміну додано'});
    } catch (e) {
        next(e);
    }
});


router.post(links.EDIT + links.EXCHANGE_PROGRAM, checkAuthenticated, checkAdmin, async function (req, res, next) {
    try {
        let ep = req.body;

        if (ep.title.length > 50) {
            return res.json({message: 'Назва програми перевищує 50 символів'});
        }

        if (ep.university.length > 50) {
            return res.json({message: 'Назва університету перевищує 50 символів'});
        }

        await db.updateEP(ep.title, ep.university, ep.id,);

        await db.deleteAllEPBranch(ep.id);

        for (let branch of ep.branchs) {
            await db.addEPBranch(ep.id, branch.id);
        }

        return res.json({message: 'Програму обміну оновлено'});
    } catch (e) {
        next(e);
    }
});


router.get(links.DATA, async function (req, res, next) {
    try {
        let branches = await db.getBranches();
        let universities_titles = await db.getUniversitiesTitles();
        let programs_titles = await db.getProgramsTitles();
        res.json({branches, universities_titles, programs_titles});
    } catch (e) {
        next(e);
    }
});

router.get(links.FILTER, async function (req, res, next) {
    try {
        //title
        //university_title
        //branch_id
        let query = req.query;
        // console.log(query);

        query.title = query.title.toLowerCase();

        let eps = await db.getPrograms(query.title, query.university_title, query.branch_id);

        for (let ep of eps) {
            await addAVGRateToEP(ep);
            ep.branches = await db.getEPBranches(ep.id);
        }

        let isAdmin = false;
        if (req.user) {
            let adminId = await db.getAdmin(req.user.id);
            if (typeof adminId !== 'undefined') {
                isAdmin = true;
            }
        }
        // console.log(eps);

        return res.json({exchange_programs: eps, isAdmin});
    } catch (e) {
        next(e);
    }
});

async function addAVGRateToEP(ep) {
    let rates = await db.getAVG_EPRate(ep.id);

    ep.place_rating = (+rates.place_rating).toFixed(1);
    ep.adaptation = (+rates.adaptation).toFixed(1);
    ep.edu_difference = (+rates.edu_difference).toFixed(1);
    ep.avarage_bal_KMA = (+rates.avarage_bal_KMA).toFixed(1);

    let lang_level = Math.round((+rates.foreign_language));

    switch (lang_level) {
        case 0:
            ep.foreign_language = '-';
            break;
        case 1:
            ep.foreign_language = 'A1';
            break;
        case 2:
            ep.foreign_language = 'A2';
            break;
        case 3:
            ep.foreign_language = 'B1';
            break;
        case 4:
            ep.foreign_language = 'B2';
            break;
        case 5:
            ep.foreign_language = 'C1';
            break;
        case 6:
            ep.foreign_language = 'C2';
            break;
    }

    ep.average_grade = ((+rates.place_rating + +rates.adaptation) / 2).toFixed(1);
    ep.reviews_amount = (+rates.reviews_amount).toFixed(0);
}


router.post('/:id' + links.CREATE_REVIEW, checkAuthenticated, function (req, res, next) {

    console.log('===============================');
    console.log('===============================');
    console.log('postRev EXC');
    // console.log(req.body);
    // console.log(req.users.id);
    req.body.user_id = req.user.id;

    switch (rea.body.foreign_language) {
        case 'A1':
            req.body.foreign_language = 1;
            break;
        case 'A2':
            req.body.foreign_language = 2;
            break;
        case 'B1':
            req.body.foreign_language = 3;
            break;
        case 'B2':
            req.body.foreign_language = 4;
            break;
        case 'C1':
            req.body.foreign_language = 5;
            break;
        case 'C2':
            req.body.foreign_language = 6;
            break;
    }

    db.saveReview(req.body)
        .then(function () {
            res.json({message: 'Відгук збережено', redirect: '/ep'});
        })
        .catch(function (e) {
            if (e.constraint === 'review_ep_user_id_ep_id_excl') {
                return res.json({message: 'Ви вже залишали відгук на цю програму обміну', redirect: '/ep'});
            }
            next(e);
        });

});


router.get('/:id' + links.DATA + links.EXCHANGE_PROGRAM, async function (req, res, next) {
    try {
        let ep = await db.getProgram(req.params.id);

        await addAVGRateToEP(ep);
        ep.branches = await db.getEPBranches(ep.id);

        return res.json({exchange_program: ep});
    }catch(e){
        next(e);
    }
});

router.get('/:id' + links.DATA + links.REVIEWS + '/:offset', async function (req, res, next) {

    try {
        let reviews = await db.getEPReviews(req.params.id, req.params.offset);

        if(reviews.length === 0){
            return res.json(null);
        }

        for (let rev of reviews) {
            rev.rate = await db.getEPReviewRate(rev.review_id);
            rev.ep_rate = await db.getEPReviewsUserRate(rev.user_id);

            rev.average_grade = ((+rev.place_rating
                + +rev.adaptation) / 2).toFixed(1);
            console.log(rev.review_id)

            rev.replies = await db.getReviewReplies(rev.review_id);

            for (let repl of rev.replies) {
                repl.rate = await db.getEPReplyRate(repl.id);
                repl.ep_rate = await db.getEPReviewsUserRate(repl.user_id);
            }
        }

        return res.json({reviews});
    } catch (e) {
        return next(e);
    }
});


module.exports = router;