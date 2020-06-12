'use strict'

const pool = require('../db_connection');


async function getSubjects({
                               id = null, title = null, teacher = null, year = null,
                               courses = null, semesters = null, faculties = null
                           } = {}) {

    let paramArray = [];

    let titlePart = true;
    if (title) {
        paramArray.push(title);
        titlePart = 'subjects.title LIKE \'%\' || $' + paramArray.length + ' || \'%\'';
    }

    //todo not only last name
    let teacherPart = true;
    if (teacher) {
        paramArray.push(teacher);
        teacherPart = `lecturer.last_name LIKE '%' || $${paramArray.length} || '%'`;
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
               lecturer.last_name, lecturer.first_name, lecturer.patronymic, subjects.year, subjects.semester
            
        FROM subjects INNER JOIN faculty ON (subjects.faculty_id = faculty.id)
        INNER JOIN lecturer_teach_subj ON (subjects.id = lecturer_teach_subj.code) 
        INNER JOIN lecturer ON (lecturer_teach_subj.email = lecturer.email)
        
        WHERE subjects.id = $1`, [id]);
    } else {
        res = await pool.query(`
        SELECT subjects.id, subjects.title, faculty.title AS faculty, subjects.course, 
            lecturer.last_name, lecturer.first_name, lecturer.patronymic, subjects.year, subjects.semester
            
        FROM subjects INNER JOIN faculty ON (subjects.faculty_id = faculty.id)
        INNER JOIN lecturer_teach_subj ON (subjects.id = lecturer_teach_subj.code) 
        INNER JOIN lecturer ON (lecturer_teach_subj.email = lecturer.email)
         
        WHERE ${titlePart} AND ${teacherPart} AND ${yearPart} AND
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


async function getSubjectReviews(subjectId) {
    let res = await pool.query(`
    SELECT review_subject.id AS review_id, review_subject.time_rev, review_subject.date_rev, review_subject.general_impression, 
    review_subject.need_basic_knowledge, review_subject.edu_technique, review_subject.course_complexity,
    review_subject.teacher_criticism, review_subject.nowadays_knowledge, review_subject.theory_practice,
    review_subject.using_knowledge,
    users.id AS user_id, users.nickname
    
    FROM review_subject INNER JOIN users ON (review_subject.user_id = users.id)
    WHERE subject_id = $1
    `, [subjectId]);
    return res.rows;
}

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

async function getReplyRate(replyId) {
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
    SELECT review_reply.id, review_reply.time_rev, review_reply.date_rev, review_reply.general_impression, users.nickname, 
    users.id AS user_id
    
    FROM review_reply INNER JOIN users ON (review_reply.user_id = users.id)
    WHERE parent_s_id = $1 
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

async function getSubjectReviewsUserRate(userId){
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


async function deleteUserLikeSubjectReview(userId, reviewId){
    let res = await pool.query(`
    DELETE FROM user_response_subject
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId]);
}

async function updateUserLikeSubjectReview(userId, reviewId, isLike) {
    let res = await pool.query(`
    UPDATE user_response_subject 
    SET "like" = $3
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId, isLike]);
}


async function getUserLikeSubjectReview(userId, reviewId){
    let res = await pool.query(`
    SELECT "like" 
    FROM user_response_subject 
    WHERE user_id = $1 AND review_subject_id = $2
    `, [userId, reviewId]);
    return res.rows[0];
}

async function addUserLikeSubjectReview(userId, reviewId, isLike){
    let res = await pool.query(`
    INSERT INTO user_response_subject (user_id, review_subject_id, "like") VALUES ($1, $2, $3)
    `, [userId, reviewId, isLike]);
}



module.exports = {
    getSubjects,
    getAVGSubjectRate, getSubjectReviews, getSubjectReviewRate,
    getAmountUserSubjectReviews, getReviewReplies, getReplyRate, saveReview, getSubjectReviewsUserRate,
    addUserLikeSubjectReview, getUserLikeSubjectReview, updateUserLikeSubjectReview, deleteUserLikeSubjectReview
};