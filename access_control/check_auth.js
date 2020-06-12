'use strict'

const links = require('../links');

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
    next();
}

function hackerHandle(req, res){
    console.log('===============================');
    console.log('===============================');
    console.log('hack');
    console.log(req.connection.remoteAddress);
    console.log('===============================');
    console.log(req.connection['x-forwarded-for']);
    res.send(`<p style="text-align: center; font-size:xx-large">(-_-)</p>
              <p style="text-align: center; font-size:xx-large">Well, I wrote down your IP.</p>`);
}

module.exports = {checkAuthenticated, checkNotAuthenticated};