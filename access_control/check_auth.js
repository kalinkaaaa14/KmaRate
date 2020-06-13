'use strict'

const links = require('../links');
const {getAdmin} = require('./database');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }


    // console.log("req session");
    // console.log(req.session);

    return res.redirect(links.ENTRANCE + '?redirect=' + req.originalUrl);
}

function checkNotAuthenticated(req, res, next) {
    // console.log("checkNotAuthenticated req session");
    // console.log(req.session);
    if (req.isAuthenticated()) {
        return res.redirect(links.MAIN);
        // return hackerHandle(req, res);
    }
    return next();
}

function checkAdmin(req, res, next) {
    // if(typeof req.user)
    getAdmin(req.user.id).then(function (adminId) {
        if (typeof adminId === 'number') {
            return next();
        } else {
            return res.send(`<p style="text-align: center; font-size:xx-large">(-_-)</p>
              <p style="text-align: center; font-size:xx-large">Well, I wrote down your IP.</p>`);
        }
    }).catch(function (e) {
        return next(e);
    });
}

function hackerHandle(req, res) {
    console.log('===============================');
    console.log('===============================');
    console.log('hack');
    console.log(req.connection.remoteAddress);
    console.log('===============================');
    console.log(req.connection['x-forwarded-for']);
    res.send(`<p style="text-align: center; font-size:xx-large">(-_-)</p>
              <p style="text-align: center; font-size:xx-large">Well, I wrote down your IP.</p>`);
}

module.exports = {checkAuthenticated, checkNotAuthenticated, checkAdmin};