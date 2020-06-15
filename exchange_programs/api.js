'use strict'

const router = require('express').Router();
const db = require('./database');

const links = require('../links');
const {checkNotAuthenticated, checkAuthenticated, checkAdmin} = require('../access_control/check_auth');
db.getAdmin = require('../access_control/database').getAdmin;
db.getUser = require('../users/database').getUser;




router.post(links.NEW + links.EXCHANGE_PROGRAM, checkAuthenticated, checkAdmin, async function (req, res, next) {
    try {
        let ep = req.body;

        if(ep.title.length > 50){
            return res.json({message: 'Назва програми перевищує 50 символів'});
        }

        let epInDB = await db.addEP(ep.title, ep.university);

        for(let branch of ep.branchs){
            await db.addEPBranch(epInDB.id, branch.id);
        }

        return res.json({message: 'Програму обміну додано'});
    }catch (e) {
        next(e);
    }
});


router.post(links.EDIT + links.EXCHANGE_PROGRAM, checkAuthenticated, checkAdmin, async function (req, res, next) {
    try {
        let ep = req.body;

        if(ep.title.length > 50){
            return res.json({message: 'Назва програми перевищує 50 символів'});
        }

        if(ep.university.length > 50){
            return res.json({message: 'Назва університету перевищує 50 символів'});
        }

        await db.updateEP(ep.title, ep.university, ep.id,);

        await db.deleteAllEPBranch(ep.id);

        for(let branch of ep.branchs){
            await db.addEPBranch(ep.id, branch.id);
        }

        return res.json({message: 'Програму обміну оновлено'});
    }catch (e) {
        next(e);
    }
});


router.get(links.FILTER, function (req, res, next) {



});





module.exports = router;