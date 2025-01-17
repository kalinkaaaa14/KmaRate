let getInfoFunction;
let reply_Nick="";

function makeReply(id) {
    document.getElementById("makeReplyDiv" + id).style.display = "block";
    document.getElementById("buttonReplyHide" + id).style.display = "none";
}

function cancelMakeReply(id) {
    document.getElementById("makeReplyDiv" + id).style.display = "none";
    document.getElementById("buttonReplyHide" + id).style.display = "block";
}

function sendMakeReply(id) {
    var now = new Date();
    var sendReply = {
        subject_review_id: id,
        general_impression: document.getElementsByName('replyText' + id)[0].value,
        date_rev: now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear(),
        time_rev: now.getHours() + ":" + now.getMinutes()
    };
    console.log(sendReply);
if(sendReply.general_impression===""){
    alert("Залиште коментар, будь ласка.");
}else {
    $.ajax({
        url: '/subj/reviews/reply',
        type: 'POST',
        data: sendReply,
        success: function (data, textStatus, xhr) {
            if (data.err && data.message) {
                alert(data.message);

            } else if (data.message) {
                alert(data.message);
                // window.location = window.location;
                getInfoFunction();

            } else {
                window.location = '/entr';
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}
}

function sendMakeReplyReply(id) {
    var now = new Date();
    var sendReply = {
        reply_id: id,
        general_impression: "@"+reply_Nick+", "+document.getElementsByName('replyTextR' + id)[0].value,
        date_rev: now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear(),
        time_rev: now.getHours() + ":" + now.getMinutes()
    };
//    console.log(sendReply);
if(sendReply.general_impression.toString()===""){
    alert("Залиште коментар, будь ласка.");
}else {
    $.ajax({
        url: '/subj/reviews/reply',
        type: 'POST',
        data: sendReply,
        success: function (data, textStatus, xhr) {
            if (data.err && data.message) {
                alert(data.message);

            } else if (data.message) {
                alert(data.message);
                // window.location = window.location;
                getInfoFunction();

            } else {
                window.location = '/entr';
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
}
}

function makeReplyReply(id,nick) {
    document.getElementById("makeReplyReplyDiv" + id).style.display = "block";
    document.getElementById("buttonReplyReplyHide" + id).style.display = "none";
    reply_Nick=nick;
}

function cancelMakeReplyReply(id) {
    document.getElementById("makeReplyReplyDiv" + id).style.display = "none";
    document.getElementById("buttonReplyReplyHide" + id).style.display = "block";
    reply_Nick="";
}

function likeReview(review_id, reviewerId, isLike) {
    $.ajax({
        url: "/subj/rate/reviews/" + review_id,
        type: 'POST',
        data: {like: isLike, user_id: reviewerId},
        success: function (data, textStatus, xhr) {
            if (typeof data.rate !== 'undefined') {
                console.log(data);
                document.getElementById('UserRate' + review_id).innerHTML = data.subject_rate;
                document.getElementById('ReviewRate' + review_id).innerHTML = data.rate;

            } else {
                // console.log(data);
                document.write(data);
            }
            // console.log(data);
            //formatData(data);
        },
        error: function (xhr, textStatus, errorThrown) {

            console.log('Error in Operation');
        }
    });
}

function likeReply(reply_id, reviewerId, isLike) {
    $.ajax({
        url: "/subj/rate/reply/" + reply_id,
        type: 'POST',
        data: {like: isLike, user_id: reviewerId},
        success: function (data, textStatus, xhr) {
            if (typeof data.rate !== 'undefined') {
                // console.log(document.getElementById('UserReply' + reply_id));
                // console.log(document.getElementById('ReplyRate' + reply_id));
                // document.getElementById('UserReply' + reply_id).innerHTML = data.subject_rate;
                document.getElementById('ReplyRate' + reply_id).innerHTML = data.rate;

            } else {
                // console.log(data);
                document.write(data);
            }
            // console.log(data);
            //formatData(data);
        },
        error: function (xhr, textStatus, errorThrown) {

            console.log('Error in Operation');
        }
    });
}

// function dislikeReview(review_id) {
//     $.ajax({
//         url: "/subj/rate/reviews/"+review_id,
//         type: 'POST',
//         data:  {like: false},
//         success: function (data, textStatus, xhr) {
//             if(data.rate){
//                 document.getElementsByName('likesReview')[0].innerHTML = data.rate;
//                 subject_rate
//             }else {
//                 document.write(data);
//             }
//         },
//         error: function (xhr, textStatus, errorThrown) {
//
//             console.log('Error in Operation');
//         }
//     });
// }

$(document).ready(function () {
    /*var data={
        subject:{
            id: 3,
            title: 'новітні інтернет технології',
            faculty: 'фі',
            course: 2,
            year:2011,
            last_name: 'кобзар',
            first_name: 'олег',
            patronymic: 'олегович',
            need_basic_knowledge: NaN,
            edu_technique: NaN,
            course_complexity: NaN,
            teacher_criticism: NaN,
            nowadays_knowledge: NaN,
            theory_practice: NaN,
            using_knowledge: NaN,
            average_grade: NaN,
            reviews_amount: 0
        }
    }*/

    getInfo();
    getInfoFunction = getInfo;

    function getInfo() {
        let urlPartsArr = window.location.href.split('/');
        let subject_id = urlPartsArr[urlPartsArr.length - 1];
        document.getElementById('allReviews').innerHTML = '';


        $.ajax({
            url: "/subj/" + subject_id + "/data/subject",
            type: 'GET',
            success: function (data, textStatus, xhr) {
                console.log(data);
                formatData(data);

                //no code after

            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });

        setTimeout(getReviews, 0, 0);

        function getReviews(offset){

            $.ajax({
                url: "/subj/" + subject_id + "/data/reviews/" + offset,
                type: 'GET',
                success: function (data, textStatus, xhr) {
                    console.log(data);
                    if(data !== null) {
                        let revLength = data.reviews.length;
                        showReviews(data);
                        setTimeout(getReviews, 0, offset + revLength);
                        // getReviews();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });
        }
    }

    function formatData(data) {
        if (data.subject.faculty.length > 2 && data.subject.faculty[1] === 'п') {
            data.subject.faculty = data.subject.faculty.slice(0, 2).toUpperCase() + data.subject.faculty[2] + data.subject.faculty.slice(3);
        } else {
            data.subject.faculty = data.subject.faculty.toUpperCase();
        }
        // data.subjects[counter].course=data.subjects[counter].course+;
        data.subject.semester = " " + data.subject.semester[0].toUpperCase() + data.subject.semester.slice(1);
        data.subject.title = data.subject.title[0].toUpperCase() + data.subject.title.slice(1);

        for (k = 0; k < data.subject.teachers.length; k++) {
            data.subject.teachers[k].last_name = data.subject.teachers[k].last_name[0].toUpperCase() + data.subject.teachers[k].last_name.slice(1);
            data.subject.teachers[k].first_name = data.subject.teachers[k].first_name[0].toUpperCase() + ".";
            data.subject.teachers[k].patronymic = data.subject.teachers[k].patronymic[0].toUpperCase() + ".";
        }

        $('#infoSubj').html(showSubjInfo(data));
    }

    function showSubjInfo(data) {
        let res = "";
        let tooltipTeachers = "";
        let quantityTeach = "";

        if (data.subject.teachers.length > 1) {
            for (q = 1; q < data.subject.teachers.length; q++) {
                tooltipTeachers += data.subject.teachers[q].last_name + " " + data.subject.teachers[q].first_name + " " + data.subject.teachers[q].patronymic + ", ";
            }
            quantityTeach = " +" + (data.subject.teachers.length - 1);
        }

        res = "<div class='container-fluid mt-5 borderEP'>" +
            "<div class='row'>" +
            "<div class='col-sm-4 EPInfoBackground'>" +
            "<span class='text-white subjectYearPage'><small>" + data.subject.year + data.subject.semester + "</small></span>" +
            "<br>" +
            "<span class='text-white subjectFacultyPage'><small>" + data.subject.faculty + "</small></span>" +
            "<br>" +

            "<h6 class='text-white  mt-5 mb-5 subjectTitlePage'>" + data.subject.title + "</h6>" +

            "<span class='text-white subjectSNP'><small>" + data.subject.teachers[0].last_name + " " + data.subject.teachers[0].first_name + data.subject.teachers[0].patronymic + "</small>" +
            "<a href='#' class='text-white quantityTeach' data-toggle='tooltip' data-html='true' title='" + tooltipTeachers + "'>" + quantityTeach + "</a>" +
            "</span>" +
            "<span class='text-white subjectCoursePage'><small>" + data.subject.course + "курс </small></span>" +
            "</div>" +

            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Потрібні початкові знання</span>" +
            "<br>" +
            "<output class='characteristics' name='basicKnowledgeSub'>" + data.subject.need_basic_knowledge + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span >Техніка викладання</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.subject.edu_technique + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span>Складність курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='complexityC'>" + data.subject.course_complexity + "/10</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Актуальність матеріалів курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='modernMater'>" + data.subject.nowadays_knowledge + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span >Відповідність теорії та практики</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.subject.theory_practice + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span>Критика зі сторони викладача</span>" +
            "<br>" +
            "<output class='characteristics' name='criticismTeacher'>" + data.subject.teacher_criticism + "/10</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-2  my-auto text-center'>" +
            "<h2>" + data.subject.average_grade + "/10</h2>" +
            "<span class='quantityRevEPPage'><small>" + data.subject.reviews_amount + " відгуків</small></span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div>" +
            `<button onclick="window.location='/subj/${data.subject.id}/createReview'" class='btn btn-block text-white text-center makeEpPageRev'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Залишити відгук</button>` +
            "</div>";

        return res;
        //onclick="document.location='/user/RevSubject.html'"
    }


//додати час і дату відгукам
    function showReviews(data) {
        let allReviewsElement = document.getElementById('allReviews') /*$('#allReviews')*/;

        let counter = 0;

        while(counter < data.reviews.length){
            allReviewsElement.innerHTML += buildReviewWithReplies(data, counter);
            ++counter;
        }

        // let showPart = () => {
        //
        //     if (counter < data.reviews.length) {
        //         setTimeout(showPart);
        //     }
        // }
        // showPart();
    }

    function buildReviewWithReplies(data, counter) {
        let res = '';
        let makeReply = "";
        let makeReplyReply = "";
        let counterReply = 0;

        let date = new Date(data.reviews[counter].date_rev);

        makeReply = "<div class='container-fluid rounded mb-5 borderReview'>" +
            "<div class='row'>" +
            "<textarea name='replyText" + data.reviews[counter].review_id + "' class='ml-1 mr-1 mt-2 mb-2 makeReplyText'></textarea>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='ml-auto'>" +
            "<button onclick='cancelMakeReply(" + data.reviews[counter].review_id + ");' class='btn-lg mr-4 text-white btn-danger mb-2'>Скасувати</button>" +
            "<button onclick='sendMakeReply(" + data.reviews[counter].review_id + ");' class='btn-lg mr-4 text-white makeEpPageRev mb-2'>Надіслати</button>" +
            "</div>" +
            "</div>" +
            "</div>";

        res +=
            "<div class='container-fluid rounded mb-5 borderReview'>" +
            "<div class='row'>" +
            "<div class='col-md-4'>" +
            "<div class='text-center mainInfoUser'>" +
            "<br>" +
            "<a href='/profile/" + data.reviews[counter].nickname + "'><img  class='rounded-circle mt-3 avatarRevEP' src=" + data.reviews[counter].image_string + "></a>" +
            "<br>" +
            "<a href='/profile/" + data.reviews[counter].nickname + "' class='characteristics text-decoration-none genImpr' name='userName'>" + data.reviews[counter].nickname + "</a>" +
            "<br>" +
            "</div>" +
            "<div class='row userRate text-center'>" +
            "<div class='col-sm-6 text-center subjectRateRevEp'>" +
            "<img class='subjPageReviews' src='/images/subject.png'>" +
            "</div>" +
            "<div class='col-sm-6 text-center'>" +
            "<span id='UserRate" + data.reviews[counter].review_id + "'>" + data.reviews[counter].subject_rate + "</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='firstCol'>" +
            "<p>" +
            "<span>Складність курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='complexityC'>" + data.reviews[counter].course_complexity + "/10</output>" +
            "</p>" +

            "<p>" +
            "<span>Потрібні початкові знання</span>" +
            "<br>" +
            "<output class='characteristics' name='basicKnowledgeSub'>" + data.reviews[counter].need_basic_knowledge + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span>Критика зі сторони викладача</span>" +
            "<br>" +
            "<output class='characteristics'  name='criticismTeacher'>" + data.reviews[counter].teacher_criticism + "/10</output>" +
            "</p>" +
            "</div>" +
            "<div class='secondCol'>" +
            "<p>" +
            "<span>Техніка викладання</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.reviews[counter].edu_technique + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span>Актуальність матеріалів курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='modernMater' >" + data.reviews[counter].nowadays_knowledge + "/10</output>" +
            "</p>" +
            "<p>" +
            "<span>Відповідність теорії та практики</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.reviews[counter].theory_practice + "/10</output>" +
            "</p>" +
            "</div>" +
            "<div class='thirdCol my-auto text-center'>" +
            "<h2>" + data.reviews[counter].average_grade + "/10</h2>" +
            "</div>" +
            "</div>" +
            "<div class='row mt-4 review'>" +
            "<pre><code class='genImpr'>" + data.reviews[counter].general_impression.replace(/&/g, '&amp;').replace(/</g, '&lt;') + "</code></pre>" +
            "</div>" +
            "<div class='row ml-5 mr-5'>" +
            "<p>" +
            "<div class='mr-3'>" +
            "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true'></i>" +
            "<span id='ReviewRate" + data.reviews[counter].review_id + "' class='quantityLikesEp' name='likesReview'>" + data.reviews[counter].rate + "</span>" +
            "</div>" +
            // <button  class='btn btn-lg rounded-circle socialBut' type='button'><i class='fa fa-instagram' aria-hidden='true'></i> </button>
            "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReview(" + data.reviews[counter].review_id + "," + data.reviews[counter].user_id + ",true)'>Підтримую</button>" +
            "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReview(" + data.reviews[counter].review_id + "," + data.reviews[counter].user_id + ",false)' >Не погоджуюсь</button>" +
            "<div id='buttonReplyHide" + data.reviews[counter].review_id + "'>" +
            "<button onclick='makeReply(" + data.reviews[counter].review_id + ");' class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>" +
            "</div>" +
            "<div class='ml-auto'> " +
            date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + "  " + data.reviews[counter].time_rev.substr(0, 5) +
            "</div>" +

            "</p>" +
            "</div>" +
            "<div id='makeReplyDiv" + data.reviews[counter].review_id + "' style='display: none'>" + makeReply + "</div>" +
            "</div>";

        if (counterReply < data.reviews[counter].replies.length) {
            makeReplyReply = "<div class='container-fluid rounded mb-5 borderReview'>" +
                "<div class='row'>" +
                "<textarea name='replyTextR" + data.reviews[counter].replies[counterReply].id + "' class='ml-1 mr-1 mt-2 mb-2 makeReplyText'></textarea>" +
                "</div>" +
                "<div class='row'>" +
                "<div class='ml-auto'>" +
                "<button onclick='cancelMakeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn-lg mr-4 text-white btn-danger mb-2'>Скасувати</button>" +
                "<button onclick='sendMakeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn-lg mr-4 text-white makeEpPageRev mb-2'>Надіслати</button>" +
                "</div>" +
                "</div>" +
                "</div>";
            let dateReply = new Date(data.reviews[counter].replies[counterReply].date_rev);
            res += "<div class='reply'>" +
                "<div class='container-fluid rounded mb-5 borderReview'>" +
                "<div class='row'>" +
                "<div class='col-md-4'>" +
                "<div class='text-center mainInfoUser'>" +
                "<br>" +
                "<a href='/profile/" + data.reviews[counter].replies[counterReply].nickname + "'><img   class='rounded-circle mt-3 replyEpAvatar' src=" + data.reviews[counter].replies[counterReply].image_string + "></a>" +
                "<br>" +
                "<a href='/profile/" + data.reviews[counter].replies[counterReply].nickname + "' class='genImpr characteristics text-decoration-none' name='replyUserName'>" + data.reviews[counter].replies[counterReply].nickname + "</a>" +
                "<br>" +
                "</div>" +
                "<div class='row userRate'>" +
                "<div class='col-sm-6 text-center subjectRateRevEp'>" +
                "<img class='replySubjPageReviews' src='/images/subject.png'>" +
                "</div>" +
                "<div class='col-sm-6 text-center'>" +
                "<span id='UserReply" + data.reviews[counter].replies[counterReply].id + "'>" + data.reviews[counter].replies[counterReply].subject_rate + "</span>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='col-md-8 my-auto'>" +
                "<div class='replyText my-auto review'>" +
                "<pre><code class='genImpr'>" + data.reviews[counter].replies[counterReply].general_impression.replace(/&/g, '&amp;').replace(/</g, '&lt;') + "</code></pre>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='row mt-3 ml-5'>" +
                "<p>" +
                "<div class='mr-3'>" +
                "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true'></i>" +
                "<span id='ReplyRate" + data.reviews[counter].replies[counterReply].id + "' class='quantityLikesEp' name='likesReview'> " + data.reviews[counter].replies[counterReply].rate + "</span>" +
                "</div>" +
                "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReply(" + data.reviews[counter].replies[counterReply].id + "," + data.reviews[counter].replies[counterReply].user_id + ",true)'>Підтримую</button>" +
                "<button id = 'disagree' onclick='likeReply(" + data.reviews[counter].replies[counterReply].id + "," + data.reviews[counter].replies[counterReply].user_id + ",false)' class='btn btn-lg text-decoration-none mr-2' >Не погоджуюсь</button>" +
                "<div id='buttonReplyReplyHide" + data.reviews[counter].replies[counterReply].id + "'>" +
                "<button onclick=makeReplyReply(" + data.reviews[counter].replies[counterReply].id +",'"+data.reviews[counter].replies[counterReply].nickname+"'); class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>" +                "</div>" +
                "<div class='ml-auto mr-5'>" + dateReply.getDate() + '.' + (dateReply.getMonth() + 1) + '.' + dateReply.getFullYear() + "  " + data.reviews[counter].replies[counterReply].time_rev.substr(0, 5) +
                "</div>" +
                "</p>" +
                "</div>" +
                "<div id='makeReplyReplyDiv" + data.reviews[counter].replies[counterReply].id + "' style='display: none'>" + makeReplyReply + "</div>" +
                "</div>";

            counterReply++;
            if ((data.reviews[counter].replies.length - 1) != 0) {
                res += "<a href='#' data-toggle='collapse' data-target='#otherSComments'>Ще " + (data.reviews[counter].replies.length - 1) + " коментар(-iв)</a>";
            }
            while (counterReply < data.reviews[counter].replies.length) {
                makeReplyReply = "<div class='container-fluid rounded mb-5 borderReview'>" +
                    "<div class='row'>" +
                    "<textarea name='replyTextR" + data.reviews[counter].replies[counterReply].id + "' class='ml-1 mr-1 mt-2 mb-2 makeReplyText'></textarea>" +
                    "</div>" +
                    "<div class='row'>" +
                    "<div class='ml-auto'>" +
                    "<button onclick='cancelMakeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn-lg mr-4 text-white btn-danger mb-2'>Скасувати</button>" +
                    "<button onclick='sendMakeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn-lg mr-4 text-white makeEpPageRev mb-2'>Надіслати</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

                let dateReply1 = new Date(data.reviews[counter].replies[counterReply].date_rev);
                res += "<div id='otherSComments' class='mt-3 collapse'>" +
                    "<div class='container-fluid rounded mb-5 borderReview'>" +
                    "<div class='row'>" +
                    "<div class='col-md-4'>" +
                    "<div class='text-center mainInfoUser'>" +
                    "<br>" +
                    "<a href='/profile/" + data.reviews[counter].replies[counterReply].nickname + "'><img   class='rounded-circle mt-3 replyEpAvatar' src=" + data.reviews[counter].replies[counterReply].image_string + "></a>" +
                    "<br>" +
                    "<a href='/profile/" + data.reviews[counter].replies[counterReply].nickname + "' class='genImpr characteristics text-decoration-none' name='replyUserName'>" + data.reviews[counter].replies[counterReply].nickname + "</a>" +
                    "<br>" +
                    "</div>" +
                    "<div class='row userRate'>" +
                    "<div class='col-sm-6 text-center subjectRateRevEp'>" +
                    "<img class='replySubjPageReviews' src='/images/subject.png'>" +
                    "</div>" +
                    "<div class='col-sm-6 text-center'>" +
                    "<span id='UserReply" + data.reviews[counter].replies[counterReply].id + "'> " + data.reviews[counter].replies[counterReply].subject_rate + "  </span>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='col-md-8 my-auto'>" +
                    "<div class='replyText my-auto review'>" +
                    "<pre><code class='genImpr'>" + data.reviews[counter].replies[counterReply].general_impression.replace(/&/g, '&amp;').replace(/</g, '&lt;') + "</code></pre>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='row mt-3 ml-5'>" +
                    "<p>" +
                    "<div class='mr-3'>" +
                    "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true' ></i>" +
                    "<span id='ReplyRate" + data.reviews[counter].replies[counterReply].id + "' class='quantityLikesEp' name='likesReview'> " + data.reviews[counter].replies[counterReply].rate + "</span>" +
                    "</div>" +
                    "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReply(" + data.reviews[counter].replies[counterReply].id + "," + data.reviews[counter].replies[counterReply].user_id + ",true)'>Підтримую</button>" +
                    "<button id = 'disagree' onclick='likeReply(" + data.reviews[counter].replies[counterReply].id + "," + data.reviews[counter].replies[counterReply].user_id + ",false)' class='btn btn-lg text-decoration-none mr-2' >Не погоджуюсь</button>" +
                    "<div id='buttonReplyReplyHide" + data.reviews[counter].replies[counterReply].id + "'>" +
                    "<button onclick=makeReplyReply(" + data.reviews[counter].replies[counterReply].id +",'"+data.reviews[counter].replies[counterReply].nickname+"'); class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>" +
                    "</div>" +
                    "<div class='ml-auto mr-5'>" + dateReply1.getDate() + '.' + (dateReply1.getMonth() + 1) + '.' + dateReply1.getFullYear() + "  " + data.reviews[counter].replies[counterReply].time_rev.substr(0, 5) +
                    "</div>" +
                    "</p>" +
                    "</div>" +
                    "<div id='makeReplyReplyDiv" + data.reviews[counter].replies[counterReply].id + "' style='display: none'>" + makeReplyReply + "</div>" +
                    "</div>" +
                    "</div>";
                counterReply++;
            }
            res += "</div>";
        }
        return res;
    }

});