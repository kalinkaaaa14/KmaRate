'use strict'

const pool = require('../db_connection');

async function getUserByNickname(nickname) {
    try {
        let {rows} = await pool.query(`SELECT id, nickname, password
                                       FROM Users
                                       WHERE nickname = $1`, [nickname]);
        // console.log(rows);
        // console.log('authenticateUser');
        return rows[0];
    } catch (e) {
        return e; //todo badcode
    }
}

async function getUserById(id) {
    try {
        let {rows} = await pool.query(`SELECT */*id, nickname*/
                                     FROM Users
                                     WHERE id = $1`, [id]);
        // console.log('deserializeUser');
        // console.log(rows);
        return rows[0];
    } catch (e) {
        return null;//todo badcode
    }
}

module.exports = {
    getUserByNickname,
    getUserById,
}