'use strict'

const pool = require('../db_connection');

async function getUserByNickname(nickname) {
    try {
        let {rows} = await pool.query(`SELECT id, nickname, password
                                       FROM users
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
        let {rows} = await pool.query(`SELECT nickname, password, email, telegram, instagram, facebook, branch_id, id
                                     FROM users
                                     WHERE id = $1`, [id]);

        return rows[0];
    } catch (e) {
        return null;
    }
}

async function getAdmin(id) {
    let res = await pool.query(`SELECT user_id
                                     FROM admins
                                     WHERE user_id = $1`, [id]);
    return res.rows[0];
}

module.exports = {
    getUserByNickname,
    getUserById,
    getAdmin,
}