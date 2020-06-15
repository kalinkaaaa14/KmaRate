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

async function getUniversitiesTitles(){
    let res = await pool.query(`
    SELECT DISTINCT university AS title
    FROM exchange_program
    `);
    return res.rows
}

async function getPrograms(title, university, branch_id){

    let paramArray = [];

    let titlePart = true;
    if(title){
        paramArray.push(title);
        titlePart = 'exchange_program.title LIKE \'%\' || $' + paramArray.length + ' || \'%\'';
    }

    let universityPart = true;
    if(university){
        paramArray.push(university);
        universityPart = 'exchange_program.university LIKE \'%\' || $' + paramArray.length + ' || \'%\'';
    }

    let branchPart = true;
    if(branch_id){
        paramArray.push(branch_id);
        branchPart = 'branch_regarding_ep.branch_id = $' + paramArray.length;
    }

    let res = await pool.query(`
    SELECT DISTINCT exchange_program.id, exchange_program.title, exchange_program.university
    
    FROM exchange_program INNER JOIN branch_regarding_ep ON (exchange_program.id = branch_regarding_ep.ep_id)
    
    WHERE ${titlePart} AND ${universityPart} AND ${branchPart}
    `, paramArray);

    return res.rows;
}

async function getEPBranches(epId){
    let res  = await pool.query(`
    SELECT DISTINCT branch.id, branch.title
    FROM branch INNER JOIN branch_regarding_ep ON (branch.id = branch_regarding_ep.branch_id)
    WHERE branch_regarding_ep.ep_id = $1
    `, [epId]);
    return res.rows;
}

async function getAVG_EPRate(epId){
    let res  = await pool.query(`
    SELECT COALESCE(AVG(place_rating), 0) AS place_rating, COALESCE(AVG(adaptation), 0) AS adaptation, COUNT(id) AS reviews_amount
    FROM review_ep
    WHERE ep_id = $1
    `, epId);

    return res.rows;
}


module.exports = {
    addEP,
    addEPBranch,
    updateEP,
    deleteAllEPBranch,
    getPrograms,
    getEPBranches,
    getAVG_EPRate,
    getUniversitiesTitles,

}