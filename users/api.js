'use strict'

const router = require('express').Router();
const db = require('./database');
const passport = require('../access_control/passport-config');
const bcrypt = require('bcrypt');

const links = require('../links');
const {checkNotAuthenticated, checkAuthenticated, checkAdmin} = require('../access_control/check_auth');


router.post(links.REGISTRATION, checkNotAuthenticated, function (req, res, next) {
    console.log('===============================');
    console.log('===============================');
    console.log('req post!');
    console.log(req.body);
    (async () => {
        try {
            //todo check email(send email and wait for confirm)
            //todo check password length <= 30;

            let regexp = /[^a-zа-я0-9_#@!+\-'"`єїі]/i;

            if (regexp.test(req.body.nickname)) {
                return res.json({message: 'Недопустимий символ в логіні'});
            }

            if(req.body.nickname.length > 30){
                return res.json({message: 'Логін не повинен первищувати 30 символів'});
            }

            if (req.body.email.length > 50){
                return res.json({message: 'Емейл не повинен первищувати 50 символів'});
            }


            if(req.body.password.length > 30){
                return res.json({message: 'Пароль не повинен первищувати 30 символів'});
            }


            if (regexp.test(req.body.password)) {
                return res.json({message: 'Недопустимий символ в паролі'});
            }

            if (req.body.password.length < 6) {
                return res.json({message: 'Пароль має містити не менше 6-ти символів'});
            }

            //hash password
            req.body.password = await bcrypt.hash(req.body.password, 10);

            //todo check all atrr req ({ nickname: 'f', mail: 'f@f', year: '1', password: '1', rem: 'on' })


            // for Alina
            let info = {
                body: req.body,
                redirect: links.ENTRANCE,
            };

            try {
                await db.registerUser(req.body);
            } catch (e) {//todo fk error?
                //don't redirect if wrong data
                info.redirect = null;

                switch (e.constraint) {
                    case 'users_nickname_key':
                        info.message = `Таке ім'я зайняте`;
                        break;
                    case 'users_email_key':
                        info.message = `Такий емейл вже зареєстрований`;
                        break;
                    case'users_password_check':
                        info.message = `Пароль має містити більше символів`;
                        break;
                    default:
                        return next(e);
                }
            }

            return res.json(info);
        }catch (e) {
            next(e);
        }

    })();
});


router.post(links.ENTRANCE, checkNotAuthenticated, function (req, res, next) {
    console.log('===============================');
    console.log('===============================');

    console.log(req.body);
    passport.authenticate('local', function (err, user, info = {}) {
        //for Alina
        info.body = req.body;

        console.log('auth');
        console.log(user);
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json(info);
        }
        console.log('success auth');

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            info.redirect = req.query.redirect || links.PROFILE + '/' + req.user.nickname;
            return res.json(info);
        });

    })(req, res, next);
});


//logout
router.get(links.LOGOUT, checkAuthenticated, function (req, res, next) {
    console.log(req.user.nickname + " logout");

    req.session.destroy(function (err) {
        if (err) return next(err);
        res.redirect(links.MAIN);
    });
});


//
router.get(links.PROFILE + '/:nickname' + links.DATA, function (req, res, next) {
    (async () => {
        try {
            let user = await db.getUser(req.params.nickname);

            let userData = {};
            userData.nickname = user.nickname;
            userData.branch_id = user.branch_id;

            let branch = await db.getBranch(user.branch_id);
            userData.branch_title = branch.title;

            let faculty = await db.getFaculty(branch.faculty_id);
            userData.faculty_title = faculty.title;

            userData.telegram = user.telegram;
            userData.facebook = user.facebook;
            userData.instagram = user.instagram;

            userData.subject_rate = await db.getSubjectReviewsRate(user.id);
            userData.ep_rate = await db.getEPReviewsRate(user.id);

            userData.image_string = (await db.getUser(userData.nickname)).image_string;

            return res.json(userData);
        } catch (e) {
            return next(e);
        }
    })();
});

//all reviews
router.get(links.PROFILE + '/:nickname' + links.REVIEWS, function (req, res, next) {
    (async () => {
        try {
            let user = await db.getUser(req.params.nickname);


            let subject_reviews = await db.getSubjectReviews(user.id);

            for (let rev of subject_reviews) {
                rev.average_rate = ((+rev.edu_technique
                    + +rev.nowadays_knowledge + +rev.using_knowledge + +rev.teacher_criticism) / 4).toFixed(1);
            }

            let ep_reviews = await db.getEPReviews(user.id);

            for (let rev of ep_reviews) {
                rev.average_rate = ((+rev.place_rating +
                    +rev.adaptation) / 2).toFixed(1);
            }


            return res.json({subject_reviews, ep_reviews});
        } catch (e) {
            return next(e);
        }
    })();
});

//get settings info
router.get(links.SETTINGS + links.DATA /*+ '/:nickname'*/, checkAuthenticated, function (req, res, next) {
    (async () => {
        try {
            //todo info form req.user

            // let user = await db.getUser(req.params.nickname);

            let user = req.user;

            let userData = {};
            userData.nickname = user.nickname;
            userData.branch_id = user.branch_id;

            let branch = await db.getBranch(user.branch_id);
            userData.branch_title = branch.title;

            let faculty = await db.getFaculty(branch.faculty_id);
            userData.faculty_title = faculty.title;

            userData.email = user.email;

            userData.telegram = '';
            if(user.telegram){
                userData.telegram = user.telegram.slice('https://t.me/'.length, user.telegram.length);
            }

            userData.facebook = '';
            if(user.facebook){
                userData.facebook = user.facebook.slice('https://www.facebook.com/'.length, user.facebook.length);
            }

            userData.instagram = '';
            if(user.instagram) {
                userData.instagram = user.instagram.slice('https://www.instagram.com/'.length, user.instagram.length);
            }

            userData.image_string = (await db.getUser(userData.nickname)).image_string;

            return res.json({userData, branchs: await require('../web_server/database').getBranchs()});
        } catch (e) {
            return next(e);
        }
    })();
});

//change user info
router.post(links.SETTINGS + links.DATA /*+ '/:nickname'*/, checkAuthenticated, function (req, res, next) {
    console.log('=====================');
    console.log('=====================');
    console.log(req.user.nickname + ': change user data' );

    // console.log(req.body);
    //todo check input
    let profileUpdates = req.body;
    profileUpdates.user_id = req.user.id;

    if(profileUpdates.telegram){
        profileUpdates.telegram = 'https://t.me/' + profileUpdates.telegram;
    }

    if(profileUpdates.instagram){
        profileUpdates.instagram = 'https://www.instagram.com/' + profileUpdates.instagram;
    }

    if(profileUpdates.facebook){
        profileUpdates.facebook = 'https://www.facebook.com/' + profileUpdates.facebook;
    }

    let regexp = /[^a-zа-я0-9_#@!+\-'"`єїі]/i;

    if (regexp.test(profileUpdates.nickname)) {
        return res.json({message: 'Недопустимий символ в логіні'});
    }

    if(profileUpdates.nickname.length > 30){
        return res.json({message: 'Логін не повинен первищувати 30 символів'});
    }

    if (profileUpdates.email.length > 50){
        return res.json({message: 'Емейл не повинен первищувати 50 символів'});
    }

    if(profileUpdates.image_string.length > 1048576){
        return res.json({message: 'Зображення не може бути більше 1 мегабайта'});
    }


    db.updateProfile(profileUpdates)
        .then(function (result) {
            return res.json({message: 'Зміни збережені', redirect: '/profile/' + profileUpdates.nickname});
        })
        .catch(function (e) {
            //todo handle errors
            res.json({message: 'Невідома помилка', err: 'err'});
            return next(e);
        });

    // {
    //     nickname: 'a',
    //         branch_id: '122',
    //     branch_title: 'Комп’ютерні науки',
    //     email: 'a@a',
    //     facebook: '',
    //     instagram: '',
    //     telegram: ''
    // }
});

//change password
router.post(links.SETTINGS + links.PASSWORD /*+ '/:nickname'*/, checkAuthenticated, function (req, res, next) {
    console.log('=====================');
    console.log('=====================');
    console.log('password')
    console.log(req.body);
    // { oldPassword: '123', newPassword: '1234' }

    (async () => {
        try {
            let passwords = req.body;

            let regexp = /[^a-zа-я0-9_#@!+\-'"`єїі]/i;
            if(passwords.newPassword.length > 30){
                return res.json({message: 'Пароль не повинен первищувати 30 символів'});
            }

            if (regexp.test(passwords.newPassword)) {
                return res.json({message: 'Недопустимий символ в паролі'});
            }

            if (passwords.newPassword.length < 6) {
                return res.json({message: 'Пароль має містити не менше 6-ти символів'});
            }


            if (await bcrypt.compare(passwords.oldPassword, req.user.password)) {
                //todo check result of promise
                await db.updatePassword({newPassword: await bcrypt.hash(passwords.newPassword, 10), user_id: req.user.id});

                req.session.destroy(function (err) {
                    if (err) return next(err);
                    res.json({message: 'Пароль оновлено', redirect: '/entr'});
                });
            } else {
                return res.json({message: 'Неправильний пароль'});
            }
        } catch (e) {
            return next(e);
        }
    })();
});



module.exports = router;