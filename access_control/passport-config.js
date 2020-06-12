'use strict'

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const {getUserByNickname, getUserById} = require('./database');

// console.log(bcrypt.compareSync('password', bcrypt.hashSync('password', 10)));

initialize(passport, getUserByNickname, getUserById);

module.exports = passport;

function initialize(passport, getUserByNickname, getUserById) {
    const authenticateUser = async (nickname, password, done) => {
        const user = await getUserByNickname(nickname);
        if (user == null) {
            return done(null, false, {message: 'Користувач з таким ім\'ям не зареєстрований'});
        }


        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Неправильний пароль'});
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'nickname'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        getUserById(id)
            .then((user) => done(null, user))
            .catch((err) => done(err));

    });
}








