'use strict'

const pool = require('../db_connection');


async function getSubjectTeachers(subjId) {

    let res = await pool.query(`
        SELECT lecturer.email, lecturer.last_name, lecturer.first_name, lecturer.patronymic
            
        FROM subjects INNER JOIN lecturer_teach_subj ON (subjects.id = lecturer_teach_subj.code)
             INNER JOIN lecturer ON (lecturer_teach_subj.email = lecturer.email)
         
        WHERE subjects.id = $1`, [subjId]);

    // console.log(res.rows);
    return res.rows;
}

// lecturer.last_name, lecturer.first_name, lecturer.patronymic,
// INNER JOIN lecturer_teach_subj ON (subjects.id = lecturer_teach_subj.code)
// INNER JOIN lecturer ON (lecturer_teach_subj.email = lecturer.email)

async function getSubjects({
                               id = null, title = null, year = null,
                               courses = null, semesters = null, faculties = null
                           } = {}) {

    let paramArray = [];

    let titlePart = true;
    if (title) {
        paramArray.push(title);
        titlePart = 'subjects.title LIKE \'%\' || $' + paramArray.length + ' || \'%\'';
    }


    let yearPart = true;
    if (year) {
        paramArray.push(year);
        yearPart = 'subjects.year = $' + paramArray.length;
    }


    let coursesPart = true;
    if (courses) {
        coursesPart = 'subjects.course IN(';

        for (let c of courses) {
            paramArray.push(c);
            coursesPart += '$' + paramArray.length + ', ';
        }

        paramArray.push(courses[courses.length - 1]);
        coursesPart += '$' + paramArray.length + ')';
    }

    let semestersPart = true;
    if (semesters) {
        semestersPart = 'subjects.semester IN(';

        for (let s of semesters) {
            paramArray.push(s);
            semestersPart += '$' + paramArray.length + ', ';
        }

        paramArray.push(semesters[semesters.length - 1]);
        semestersPart += '$' + paramArray.length + ')';
    }

    let facultiesPart = true;
    if (faculties) {
        facultiesPart = `faculty.title IN(`;

        for (let f of faculties) {
            paramArray.push(f);
            facultiesPart += '$' + paramArray.length + ', ';
        }

        paramArray.push(faculties[faculties.length - 1]);
        facultiesPart += '$' + paramArray.length + ')';
    }

    let res;
    if (id) {
        res = await pool.query(`
        SELECT subjects.id, subjects.title, faculty.title AS faculty, subjects.course, 
                subjects.year, subjects.semester
            
        FROM subjects INNER JOIN faculty ON (subjects.faculty_id = faculty.id)
        
        WHERE subjects.id = $1`, [id]);
    } else {
        res = await pool.query(`
        SELECT subjects.id, subjects.title, faculty.title AS faculty, subjects.course, 
             subjects.year, subjects.semester
            
        FROM subjects INNER JOIN faculty ON (subjects.faculty_id = faculty.id)
         
        WHERE ${titlePart} AND ${yearPart} AND
                ${coursesPart} AND ${semestersPart} AND ${facultiesPart}`, paramArray);
    }

    return res.rows;
}

async function getAVGSubjectRate(subjectId) {
    let res = await pool.query(`
    SELECT COALESCE(AVG(need_basic_knowledge), 0) AS need_basic_knowledge, COALESCE(AVG(edu_technique), 0) AS edu_technique, 
    COALESCE(AVG(course_complexity), 0) AS course_complexity, COALESCE(AVG(teacher_criticism), 0) AS teacher_criticism, 
    COALESCE(AVG(nowadays_knowledge), 0) AS nowadays_knowledge, COALESCE(AVG(theory_practice), 0) AS theory_practice, 
    COALESCE(AVG(using_knowledge), 0) AS using_knowledge, COUNT(id) AS reviews_amount
    
    FROM review_subject
    WHERE subject_id = $1
    `, [subjectId]);
    return res.rows[0];
}


async function getSubjectReviews(subjectId, offset) {
        let res = await pool.query(`
    SELECT review_subject.id AS review_id, review_subject.time_rev, review_subject.date_rev, review_subject.general_impression, 
    review_subject.need_basic_knowledge, review_subject.edu_technique, review_subject.course_complexity,
    review_subject.teacher_criticism, review_subject.nowadays_knowledge, review_subject.theory_practice,
    review_subject.using_knowledge,
    users.id AS user_id, users.nickname, users.image_string
    
    FROM review_subject INNER JOIN users ON (review_subject.user_id = users.id)
    WHERE subject_id = $1
    ORDER BY review_subject.date_rev DESC, review_subject.time_rev DESC
    OFFSET $2 LIMIT 1
    `, [subjectId, offset]);
    return res.rows;
}


async function getAmountUserSubjectReviews(userId) {
    let res = await pool.query(`
    SELECT COUNT(id) AS amount
    FROM review_subject
    WHERE user_id = $1
    `, [userId]);
    return res.rows[0].amount;
}


async function getReviewReplies(reviewId) {

    let res = await pool.query(`
    
    WITH RECURSIVE sub_replies AS (
    
    SELECT review_reply.id, review_reply.time_rev, review_reply.date_rev, review_reply.general_impression, users.nickname, 
    users.id AS user_id, users.image_string
    
    FROM review_reply INNER JOIN users ON (review_reply.user_id = users.id)
    
    WHERE subject_review_id = $1
    
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

async function saveReview({
                              time_rev, date_rev, need_basic_knowledge, edu_technique, course_complexity, nowadays_knowledge,
                              theory_practice, teacher_criticism, using_knowledge, general_impression, subject_id, user_id
                          }) {

    await pool.query(`INSERT INTO review_subject 
    (time_rev, date_rev, need_basic_knowledge, edu_technique, course_complexity, nowadays_knowledge,
     theory_practice, teacher_criticism, using_knowledge, general_impression, subject_id, user_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [time_rev, date_rev, need_basic_knowledge, edu_technique, course_complexity, nowadays_knowledge,
            theory_practice, teacher_criticism, using_knowledge, general_impression, subject_id, user_id]);
}


async function getSubjectReviewsUserRate(userId) {
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


//like review

async function getSubjectReviewRate(reviewId) {
    let likes = await pool.query(`
    SELECT COUNT(user_response_subject.like) AS likes
    FROM review_subject INNER JOIN user_response_subject ON (review_subject.id = user_response_subject.review_subject_id)
    WHERE review_subject.id = $1 AND user_response_subject.like = true
    `, [reviewId]);

    let dislikes = await pool.query(`
    SELECT COUNT(user_response_subject.like) AS dislikes
    FROM review_subject INNER JOIN user_response_subject ON (review_subject.id = user_response_subject.review_subject_id)
    WHERE review_subject.id = $1 AND user_response_subject.like = false
    `, [reviewId]);

    let rate = likes.rows[0].likes - dislikes.rows[0].dislikes;

    return rate;
}


async function addUserLikeSubjectReview(userId, reviewId, isLike) {
    let res = await pool.query(`
    INSERT INTO user_response_subject (user_id, review_subject_id, "like") VALUES ($1, $2, $3)
    `, [userId, reviewId, isLike]);
}

async function getUserLikeSubjectReview(userId, reviewId) {
    let res = await pool.query(`
    SELECT "like" 
    FROM user_response_subject 
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId]);
    return res.rows[0];
}

async function updateUserLikeSubjectReview(userId, reviewId, isLike) {
    let res = await pool.query(`
    UPDATE user_response_subject 
    SET "like" = $3
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId, isLike]);
}

async function deleteUserLikeSubjectReview(userId, reviewId) {
    let res = await pool.query(`
    DELETE FROM user_response_subject
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId]);
}


//like reply

async function getSubjectReplyRate(replyId) {
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

async function addUserLikeSubjectReply(userId, replyId, isLike) {
    let res = await pool.query(`
    INSERT INTO user_response_reply (user_id, review_reply_id, "like") VALUES ($1, $2, $3)
    `, [userId, replyId, isLike]);
}

async function getUserLikeSubjectReply(userId, replyId) {
    let res = await pool.query(`
    SELECT "like" 
    FROM user_response_reply 
    WHERE user_id = $1 AND review_reply_id = $2
    `, [userId, replyId]);
    return res.rows[0];
}

async function updateUserLikeSubjectReply(userId, replyId, isLike) {
    let res = await pool.query(`
    UPDATE user_response_reply 
    SET "like" = $3
    WHERE user_id = $1 AND review_reply_id = $2
    `, [userId, replyId, isLike]);
}

async function deleteUserLikeSubjectReply(userId, replyId) {
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

async function getAllTeachers() {
    let res = await pool.query(`
    SELECT email, first_name, last_name, patronymic
    FROM lecturer
    `);
    return res.rows;
}


async function addSubject(title, course, year, semester, faculty_id) {
    let res = await pool.query(`
    INSERT INTO subjects (title, course, year, semester, faculty_id) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *
    `, [title, course, year, semester, faculty_id]);
    // console.log(res);
    return res.rows[0];
}

async function addSubjectLecturer(subjId, lecturerEmail) {
    let res = await pool.query(`
    INSERT INTO lecturer_teach_subj (code, email) 
    VALUES ($1, $2)
    `, [subjId, lecturerEmail]);
}


async function updateSubject(subjId, title, course, year, semester, faculty_id) {
    let res = await pool.query(`
    UPDATE subjects 
    SET title = $2, course = $3, year = $4, semester = $5, faculty_id = $6
    WHERE id = $1
    `, [subjId, title, course, year, semester, faculty_id]);
}

async function deleteAllSubjectTeachers(subjId) {
    let res = await pool.query(`
    DELETE FROM lecturer_teach_subj
    WHERE lecturer_teach_subj.code = $1;
    `, [subjId]);
}

async function addTeacher(first_name, last_name, patronymic){
    await pool.query(`
    INSERT INTO lecturer (first_name, last_name, patronymic) 
    VALUES ($1, $2, $3)`, [first_name, last_name, patronymic]);
}

async function updateTeacher(email, first_name, last_name, patronymic){
    let res = await pool.query(`
    UPDATE lecturer 
    SET first_name = $2, last_name = $3, patronymic = $4
    WHERE email = $1
    `, [email, first_name, last_name, patronymic]);
}



async function getSubjectWithLargestQuantityOfReviews(){
    let res = await pool.query(`
    SELECT id, title
    FROM subjects
    WHERE NOT EXISTS 
    
    (SELECT review_subject.subject_id
    FROM review_subject
    WHERE review_subject.subject_id != subjects.id
    GROUP BY review_subject.subject_id
    HAVING COUNT(*) >(SELECT COUNT(*)
                      FROM review_subject
                      WHERE review_subject.subject_id = subjects.id));
    `);
    return res.rows;
}


async function getActiveUsers(){
    let res = await pool.query(`
    SELECT users.id AS user_id, nickname, image_string, branch.id AS branch_id, branch.title AS branch_title, faculty.title AS faculty_title
    FROM users INNER JOIN branch ON (users.branch_id = branch.id) INNER JOIN faculty ON (branch.faculty_id = faculty.id)
    WHERE NOT EXISTS (SELECT *
     FROM subjects
     WHERE NOT EXISTS 
     (SELECT *
     FROM review_subject
     WHERE users.id = user_id
     AND subjects.id = subject_id));
    `);
    return res.rows;
}


module.exports = {
    getSubjects,
    getAVGSubjectRate, getSubjectReviews, getSubjectReviewRate,
    getAmountUserSubjectReviews, getReviewReplies, saveReview, getSubjectReviewsUserRate,
    addUserLikeSubjectReview, getUserLikeSubjectReview, updateUserLikeSubjectReview, deleteUserLikeSubjectReview,
    addReply, getAllTeachers, getSubjectTeachers,
    addUserLikeSubjectReply,
    getUserLikeSubjectReply,
    updateUserLikeSubjectReply,
    deleteUserLikeSubjectReply,
    getSubjectReplyRate,
    addSubject,
    addSubjectLecturer,
    updateSubject,
    deleteAllSubjectTeachers,
    addTeacher,
    updateTeacher,
    getSubjectWithLargestQuantityOfReviews,
    getActiveUsers
};