'use strict'

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./access_control/passport-config');
const ejs = require('ejs');

const links = require('./links');

const app = express();


// let f = require('package.json');
// console.log(f);

// const cors = require('cors');
// app.use(cors());
// app.options('*', cors());
//////////////////////////////////////

//app property
app.set('x-powered-by', false);
app.set('view engine', 'ejs');
app.set('view options',
    {
        delimiter: '?',
        /*async: true,*/
        beautify: false,
        // strict: false,
        // views: [__dirname + '/views']
    });

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));

app.use(session({
    store: new pgSession({
        pool: require('./db_connection'),
        pruneSessionInterval: 0,
        pruneSessionRandomizedInterval: false,
    }),
    secret: 'kostyAlouh',
    resave: false,//false
    saveUninitialized: false,
    rolling: true,
    unset: null,
    cookie: {maxAge: 10 * 60 * 1000},
}));

app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');

app.engine('html', ejs.renderFile);


app.use('/', express.static(__dirname + '/views'));


//add users obj if login
app.use(function (req, res, next) {
    res.locals.user = req.user;
    // console.log('user');
    // console.log(req.user);
    // console.log(req.session);
    // res.destructuredLocals = [req.user];
    next();
});


//routes
app.use(links.SUBJ, require('./subjects/api'));
app.use(links.EP, require('./exchange_programs/api'));
app.use(links.MAIN, require('./users/api'));

//attention! order matters (/subj/:id)
app.use(links.MAIN, require('./web_server/api'));



app.get('/favicon.ico', function (req, res) {
    res.sendFile(__dirname + '/views/images/NaUKMA_sym.png');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log('404');
    console.log(req.url);
    throw new Error('404');
});


// error handler
app.use(function (err, req, res, next) {
    console.log('=========================================================');
    console.log('=========================================================');

    console.log(err);

    // if('severity' in err){
    //     res.status(500).json({message: err.message});
    // }else {
        res.status(err.status || 500).json({
            message: err.message,
            // error: err,
        });
    // }



});

const PORT = process.env.PORT || 4321;

app.listen(PORT, 'localhost');
// app.listen(PORT, '192.168.1.212');


console.log('Server started on port ' + PORT);