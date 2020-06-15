'use strict'

const pool = require('../db_connection');


async function addEP(title, university) {
    let res = await pool.query(`
    INSERT INTO exchange_program (title, university)
    VALUES ($1, $2)
    RETURNING *
    `, [title, university]);
    return res.rows[0];
}

async function addEPBranch(ep_id, branch_id){
    let res = await pool.query(`
    INSERT INTO branch_regarding_ep (ep_id, branch_id)
    VALUES ($1, $2)
    `, [ep_id, branch_id]);
}

async function updateEP(title, university, id){
    let res = await pool.query(`
    UPDATE exchange_program
    SET title = $1, university = $2
    WHERE id = $3
    `, [title, university, id]);
}

async function deleteAllEPBranch(ep_id){
    let res = await pool.query(`
    DELETE FROM branch_regarding_ep
    WHERE ep_id = $1
    `, [ep_id]);
}

module.exports = {
    addEP,
    addEPBranch,
    updateEP,
    deleteAllEPBranch,

}