'use strict'

const router = require('express').Router();
const db = require('./database');
// const ejs = require('ejs');
// const path = require('path');


const links = require('../links');
const {checkNotAuthenticated, checkAuthenticated} = require('../access_control/check_auth');

//main
router.get('/', function (req, res, next) {
    //to optimize
    // ejs.renderFile(path.dirname(__dirname) + '/views/Main.html').then((html)=> res.send(html));
    // console.log('MAIN ' + JSON.stringify(req.users));
    db.getBranchs()
        .then(function (branchs) {
            res.render('Main.html', {branchs});
        })
        .catch(function (e) {
            next(e);
        });
    // res.render('Main.html');
});


//subjects
router.get(links.SUBJECTS, function (req, res) {
    res.render('Subject.html');
});


//concrete subject
router.get(links.SUBJECTS + '/:id', function (req, res) {
    res.render('PageSubjectReviews.html');
});


//subjects create review
router.get(links.SUBJECTS + '/:id' + links.CREATE_REVIEW, checkAuthenticated, function (req, res) {
    res.render('RevSubject.html');
});



//exchange programs
router.get(links.EP, function (req, res) {
    res.render('EP.html');
});


//registration
router.get(links.REGISTRATION, checkNotAuthenticated, function (req, res, next) {
    db.getBranchs()
        .then(function (branchs) {
            res.render('Registration.html', {branchs});
        })
        .catch(function (e) {
            next(e);
        });
});


//login
router.get(links.ENTRANCE, checkNotAuthenticated, function (req, res) {
    console.log('entr');
    return res.render('Entrance.html');
});


//profile
router.get(links.PROFILE + '/:nickname', /*checkAuthenticated,*/ function (req, res) {
    res.render('MyProfile.html');
});


//settings
router.get(links.SETTINGS, checkAuthenticated, function (req, res, next) {
    db.getBranchs()
        .then(function (branchs) {
            res.render('EditProfile.html', {branchs});
        })
        .catch(function (e) {
            next(e);
        });
    // res.render('EditProfile.html');
});

module.exports = router;


