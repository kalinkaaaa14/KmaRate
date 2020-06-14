'use strict'

const pool = require('../db_connection');
// (async () => {
//     try {
//         // let t = await pool.query('SELECT * FROM subjects WHERE title LIKE \'%інтер%\'');
//         // console.log(t.rows);
//
//         let res = await getAVGSubjectRate(4);
//         console.log('db query');
//         console.log(res);
//     } catch (e) {
//         console.log(e);
//     }
//
// })();

async function registerUser({nickname, email, password, userBranch}) {
    console.log('=========================================================');
    console.log('=========================================================');
    let res = await pool.query(
        `INSERT INTO users (nickname, email, password, branch_id) VALUES ($1, $2, $3, $4)`,
        [nickname, email, password, userBranch]);
    // console.log(res);
}

async function getUser(nickname){
    let res = await pool.query(`
    SELECT *
    FROM users
    WHERE nickname = $1  
    `, [nickname]);
    return res.rows[0];
}

// async function getAmountUserSubjectReviews(userId) {
//     let res = await pool.query(`
//     SELECT COUNT(id) AS amount
//     FROM review_subject
//     WHERE user_id = $1
//     `, [userId]);
//     return res.rows[0].amount;
// }
//
// async function getAmountUserEPReviews(userId) {
//     let res = await pool.query(`
//     SELECT COUNT(id) AS amount
//     FROM review_ep
//     WHERE user_id = $1
//     `, [userId]);
//     return res.rows[0].amount;
// }

async function getBranch(branchId){
    let res = await pool.query(`
    SELECT *
    FROM branch
    WHERE id = $1 
    `, [branchId]);
    return res.rows[0];
}

async function getFaculty(facultyId){
    let res = await pool.query(`
    SELECT *
    FROM faculty
    WHERE id = $1 
    `, [facultyId]);
    return res.rows[0];
}


async function getSubjectReviewsRate(userId){
    let likes = await pool.query(`
    SELECT COUNT(*) AS likes
    FROM review_subject INNER JOIN user_response_subject ON (review_subject.id = user_response_subject.review_subject_id)
    WHERE review_subject.user_id = $1 AND user_response_subject.like = true
    `, [userId]);

    let dislikes = await pool.query(`
    SELECT COUNT(*) AS dislikes
    FROM review_subject INNER JOIN user_response_subject ON (review_subject.id = user_response_subject.review_subject_id)
    WHERE review_subject.user_id = $1 AND user_response_subject.like = false
    `, [userId]);

    let rate = likes.rows[0].likes - dislikes.rows[0].dislikes;

    return rate;
}

async function getEPReviewsRate(userId){
    let likes = await pool.query(`
    SELECT COUNT(*) AS likes
    FROM review_ep INNER JOIN user_response_ep ON (review_ep.id = user_response_ep.review_ep_id)
    WHERE review_ep.user_id = $1 AND user_response_ep.like = true
    `, [userId]);

    let dislikes = await pool.query(`
    SELECT COUNT(*) AS dislikes
    FROM review_ep INNER JOIN user_response_ep ON (review_ep.id = user_response_ep.review_ep_id)
    WHERE review_ep.user_id = $1 AND user_response_ep.like = false
    `, [userId]);

    let rate = likes.rows[0].likes - dislikes.rows[0].dislikes;

    return rate;
}

async function getSubjectReviews(userId){
    let res = await pool.query(`
    SELECT *
    FROM review_subject INNER JOIN subjects ON(review_subject.subject_id = subjects.id)
    WHERE review_subject.user_id = $1 
    `, [userId]);
    return res.rows;
}

async function getEPReviews(userId){
    let res = await pool.query(`
    SELECT *
    FROM review_ep INNER JOIN exchange_program ON(review_ep.ep_id = exchange_program.id)
    WHERE review_ep.user_id = $1 
    `, [userId]);
    return res.rows;
}

// updateProfile({nickname: 't', email: 't', telegram: 't', instagram: 't', facebook: 't', branch_id: 122, uesr_id: 67});

async function updateProfile({nickname, email, telegram, instagram, facebook, branch_id, image_string, user_id}){
    let res = await pool.query(`
    UPDATE users 
    SET nickname = $1, email = $2, telegram = $3, instagram = $4, facebook = $5, branch_id = $6, image_string = $7
    WHERE id = $8
    `, [nickname, email, telegram, instagram, facebook, branch_id, image_string, user_id]);
    return res;
}

async function updatePassword({newPassword, user_id}){
    let res = await pool.query(`
    UPDATE users 
    SET password = $1
    WHERE id = $2
    `, [newPassword, user_id]);
    return res;
}


module.exports = {
    registerUser,
    // getAmountUserSubjectReviews,
    // getAmountUserEPReviews,
    getBranch,
    getFaculty,
    getSubjectReviewsRate,
    getEPReviewsRate,
    getUser,
    getSubjectReviews,
    getEPReviews,
    updateProfile,
    updatePassword
};