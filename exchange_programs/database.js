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

async function getProgramsTitles(){
    let res = await pool.query(`
    SELECT DISTINCT title
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


async function getProgram(epId){
    let res = await pool.query(`
    SELECT exchange_program.id, exchange_program.title, exchange_program.university
    FROM exchange_program 
    WHERE id = $1
    `, [epId]);

    return res.rows[0];
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
    SELECT COALESCE(AVG(place_rating), 0) AS place_rating, COALESCE(AVG(adaptation), 0) AS adaptation, COUNT(id) AS reviews_amount,
    COALESCE(AVG(edu_difference), 0) AS edu_difference, COALESCE(AVG(foreign_language), 0) AS foreign_language, 
    COALESCE(AVG("avarage_bal_KMA"), 0) AS "avarage_bal_KMA"  
    FROM review_ep
    WHERE ep_id = $1
    `, [epId]);

    return res.rows[0];
}


async function saveReview({time_rev, date_rev, place_rating, foreign_language, adaptation, edu_difference, avarage_bal_KMA, general_impression = null, ep_id, user_id}){

    let res = await pool.query(`
    INSERT INTO review_ep 
    (time_rev, date_rev, place_rating, foreign_language, adaptation, edu_difference, "avarage_bal_KMA", general_impression, ep_id, user_id)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [time_rev, date_rev, place_rating, foreign_language, adaptation, edu_difference, avarage_bal_KMA, general_impression, ep_id, user_id]);

}


async function getEPReviews(epId, offset){
    let res = await pool.query(`
    SELECT review_ep.id AS review_id, review_ep.time_rev, review_ep.date_rev, review_ep.general_impression, 
    review_ep.place_rating, review_ep.foreign_language, review_ep.adaptation,
    review_ep.edu_difference, "avarage_bal_KMA",
    users.id AS user_id, users.nickname, users.image_string
    
    FROM review_ep INNER JOIN users ON (review_ep.user_id = users.id)
    WHERE ep_id = $1
    ORDER BY review_ep.date_rev DESC, review_ep.time_rev DESC
    OFFSET $2 LIMIT 1
    `, [epId, offset]);
    return res.rows;
}

async function getEPReviewRate(reviewId){
    let likes = await pool.query(`
    SELECT COUNT(user_response_ep.like) AS likes
    FROM review_ep INNER JOIN user_response_ep ON (review_ep.id = user_response_ep.review_ep_id)
    WHERE review_ep.id = $1 AND user_response_ep.like = true
    `, [reviewId]);

    let dislikes = await pool.query(`
    SELECT COUNT(user_response_ep.like) AS dislikes
    FROM review_ep INNER JOIN user_response_ep ON (review_ep.id = user_response_ep.review_ep_id)
    WHERE review_ep.id = $1 AND user_response_ep.like = false
    `, [reviewId]);

    let rate = likes.rows[0].likes - dislikes.rows[0].dislikes;

    return rate;
}


async function getReviewReplies(reviewId){
    let res = await pool.query(`
    
    WITH RECURSIVE sub_replies AS (
    
    SELECT review_reply.id, review_reply.time_rev, review_reply.date_rev, review_reply.general_impression, users.nickname, 
    users.id AS user_id, users.image_string
    
    FROM review_reply INNER JOIN users ON (review_reply.user_id = users.id)
    
    WHERE ep_review_id = $1
    
    UNION 
    
    SELECT review_reply.id, review_reply.time_rev, review_reply.date_rev, review_reply.general_impression, users.nickname, 
    users.id AS user_id, users.image_string 
     
    FROM review_reply INNER JOIN users ON (review_reply.user_id = users.id) 
    INNER JOIN sub_replies ON (review_reply.reply_id = sub_replies.id)
    
    ) 
    SELECT * 
    FROM sub_replies
    
    ORDER BY sub_replies.date_rev ASC, sub_replies.time_rev ASC 
    `, [reviewId]);
    return res.rows;
}

async function getEPReplyRate(replyId){
    let likes = await pool.query(`
    SELECT COUNT(user_response_reply.like) AS likes
    FROM review_reply INNER JOIN user_response_reply ON (review_reply.id = user_response_reply.review_reply_id)
    WHERE review_reply.id = $1 AND user_response_reply.like = true
    `, [replyId]);

    let dislikes = await pool.query(`
    SELECT COUNT(user_response_reply.like) AS dislikes
    FROM review_reply INNER JOIN user_response_reply ON (review_reply.id = user_response_reply.review_reply_id)
    WHERE review_reply.id = $1 AND user_response_reply.like = false
    `, [replyId]);

    let rate = likes.rows[0].likes - dislikes.rows[0].dislikes;

    return rate;
}




async function addUserLikeEPReview(userId, reviewId, isLike) {
    let res = await pool.query(`
    INSERT INTO user_response_ep (user_id, review_ep_id, "like") VALUES ($1, $2, $3)
    `, [userId, reviewId, isLike]);
}

async function getUserLikeEPReview(userId, reviewId) {
    let res = await pool.query(`
    SELECT "like" 
    FROM user_response_ep
    WHERE user_id = $1 AND review_ep_id = $2
    `, [userId, reviewId]);
    return res.rows[0];
}


async function updateUserLikeEPReview(userId, reviewId, isLike) {
    let res = await pool.query(`
    UPDATE user_response_ep 
    SET "like" = $3
    WHERE user_id = $1 AND review_ep_id = $2
    `, [userId, reviewId, isLike]);
}


async function deleteUserLikeEPReview(userId, reviewId) {
    let res = await pool.query(`
    DELETE FROM user_response_ep
    WHERE user_id = $1 AND review_ep_id = $2
    `, [userId, reviewId]);
}




async function addUserLikeEPReply(userId, replyId, isLike) {
    let res = await pool.query(`
    INSERT INTO user_response_reply (user_id, review_reply_id, "like") VALUES ($1, $2, $3)
    `, [userId, replyId, isLike]);
}

async function getUserLikeEPReply(userId, replyId) {
    let res = await pool.query(`
    SELECT "like" 
    FROM user_response_reply 
    WHERE user_id = $1 AND review_reply_id = $2
    `, [userId, replyId]);
    return res.rows[0];
}

async function updateUserLikeEPReply(userId, replyId, isLike) {
    let res = await pool.query(`
    UPDATE user_response_reply 
    SET "like" = $3
    WHERE user_id = $1 AND review_reply_id = $2
    `, [userId, replyId, isLike]);
}

async function deleteUserLikeEPReply(userId, replyId) {
    let res = await pool.query(`
    DELETE FROM user_response_reply
    WHERE user_id = $1 AND review_reply_id = $2
    `, [userId, replyId]);
}


async function addReply({time_rev, date_rev, general_impression, subject_review_id, reply_id, ep_review_id, user_id}) {
    let res = await pool.query(`
    INSERT INTO review_reply (time_rev, date_rev,general_impression, subject_review_id, reply_id, ep_review_id, user_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [time_rev, date_rev, general_impression, subject_review_id, reply_id, ep_review_id, user_id]);
}


module.exports = {
    addEP,
    addEPBranch,
    updateEP,
    deleteAllEPBranch,
    getPrograms,
    getProgram,
    getEPBranches,
    getAVG_EPRate,
    getUniversitiesTitles,
    getProgramsTitles,
    saveReview,
    getEPReviews,
    getEPReviewRate,
    getReviewReplies,
    getEPReplyRate,
    getUserLikeEPReview,
    deleteUserLikeEPReview,
    updateUserLikeEPReview,
    addUserLikeEPReview,
    addUserLikeEPReply,
    getUserLikeEPReply,
    updateUserLikeEPReply,
    deleteUserLikeEPReply,
    addReply,

}