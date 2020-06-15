'use strict'

const pool = require('../db_connection');


async function getBranches() {
    // console.log('=========================================================');
    // console.log('=========================================================');
    let res = await pool.query(
        `SELECT id, title
         FROM branch`
    );
    // console.log(res);
    return res.rows;
}

module.exports = {getBranches};