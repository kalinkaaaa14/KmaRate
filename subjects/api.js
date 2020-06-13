'use strict'

const router = require('express').Router();
const db = require('./database');

const links = require('../links');
const {checkNotAuthenticated, checkAuthenticated} = require('../access_control/check_auth');


//get filtered subjects
router.get(links.FILTERED_SUBJECTS, function (req, res, next) {

    console.log(req.query);
    //todo check data (empty array...)
    (async () => {
        try {
            let dataFromClient = req.query;
            trimAndLowercaseValues(dataFromClient);

            let subjects = await db.getSubjects(dataFromClient);

            for (let subj of subjects) {
                await addAVGRateToSubject(subj);
            }
            console.log(subjects);

            return res.json({subjects});
        } catch (e) {
            return next(e);
        }
    })();
});

function trimAndLowercaseValues(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase().trim();
        }
    }
}

async function addAVGRateToSubject(subject) {
    let rates = await db.getAVGSubjectRate(subject.id);

    for (let key in rates) {
        subject[key] = (+rates[key]).toFixed(1);
    }

    subject.average_grade = ((+subject.edu_technique
        + +subject.nowadays_knowledge + +subject.using_knowledge + +subject.teacher_criticism) / 4).toFixed(1);
    subject.reviews_amount = (+subject.reviews_amount).toFixed(0);
}

router.get(links.TEACHERS, function (req, res, next) {
    (async () => {
        try {
            res.json(await db.getAllTeachers());
        }catch (e) {
            next(e);
        }
    })();
});

//get subject & reviews
router.get('/:id' + links.DATA, function (req, res, next) {
    (async () => {
        try {
            let subject = (await db.getSubjects({id: req.params.id}))[0];

            await addAVGRateToSubject(subject);

            let reviews = await db.getSubjectReviews(req.params.id);
            for (let rev of reviews) {
                rev.rate = await db.getSubjectReviewRate(rev.review_id);
                // rev.reviewsAmount = await db.getAmountUserSubjectReviews(rev.user_id);
                rev.subject_rate = await db.getSubjectReviewsUserRate(rev.user_id);
                rev.average_grade = ((rev.edu_technique
                    + rev.nowadays_knowledge + rev.using_knowledge) / 3).toFixed(1);

                rev.replies = await db.getReviewReplies(rev.review_id);

                for (let repl of rev.replies) {
                    repl.rate = await db.getReplyRate(repl.id);
                    repl.subject_rate = await db.getSubjectReviewsUserRate(repl.user_id);
                    // repl.reviewsAmount = await db.getAmountUserSubjectReviews(repl.user_id);
                }
            }

            return res.json({subject, reviews});
        } catch (e) {
            return next(e);
        }
    })();
});


router.post('/:id' + links.CREATE_REVIEW, checkAuthenticated, function (req, res, next) {

    //todo переход если закончилась сессия
    console.log('===============================');
    console.log('===============================');
    console.log('postRev');
    // console.log(req.body);
    // console.log(req.users.id);
    req.body.user_id = req.user.id;
    db.saveReview(req.body)
        .then(function () {
            res.json({message: 'Відгук збережено', redirect: '/subj'});
        })
        .catch(function (e) {
            if (e.constraint === 'review_subject_user_id_subject_id_excl') {
                return res.json({message: 'Ви вже залишали відгук на цей предмет', redirect: '/subj'});
            }
            next(e);
        });

});


router.post(links.RATE + links.REVIEWS + '/:reviewId', checkAuthenticated, function (req, res, next) {
    (async () => {
        try {

            // console.log(req.body);
            let isLikeObj = await db.getUserLikeSubjectReview(req.user.id, req.params.reviewId);
            if (isLikeObj) {
                if (isLikeObj.like + '' === req.body.like) {
                    await db.deleteUserLikeSubjectReview(req.user.id, req.params.reviewId);
                } else {
                    await db.updateUserLikeSubjectReview(req.user.id, req.params.reviewId, req.body.like);
                }
            } else {
                await db.addUserLikeSubjectReview(req.user.id, req.params.reviewId, req.body.like)
            }
            // console.log({
            //     rate: await db.getSubjectReviewRate(req.params.reviewId),
            //     subject_rate: await db.getSubjectReviewsUserRate(req.body.user_id)
            // });

            return res.json({
                rate: await db.getSubjectReviewRate(req.params.reviewId),
                subject_rate: await db.getSubjectReviewsUserRate(req.body.user_id)
            });
        } catch (e) {
            return next(e);
        }
    })();
});


router.post(links.REVIEWS + links.REPLY,  checkAuthenticated, function (req, res, next) {
    (async () => {
        try {
            // await db.addReply({});
            res.json(req.body);
        }catch (e) {
            next(e);
        }
    })();
});


module.exports = router;