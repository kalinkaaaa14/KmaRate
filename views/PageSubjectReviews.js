function makeReply(id) {
    document.getElementById("makeReplyDiv"+id).style.display = "block";
}
function cancelMakeReply(id) {
    document.getElementById("makeReplyDiv"+id).style.display="none";
}
function likeReview(review_id, reviewerId, isLike) {
    $.ajax({
        url:  "/subj/rate/reviews/"+review_id,
        type: 'POST',
        data:  {like: isLike, user_id: reviewerId},
        success: function (data, textStatus, xhr) {
            if(typeof data.rate !== 'undefined'){
                console.log(data);
                document.getElementById('UserRate' + review_id).innerHTML = data.subject_rate;
                document.getElementById('ReviewRate' + review_id).innerHTML = data.rate;

            }else {
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

    function getInfo() {
        let urlPartsArr = window.location.href.split('/');
        let subject_id = urlPartsArr[urlPartsArr.length - 1];

        $.ajax({
            url: "/subj/" + subject_id + "/data",
            type: 'GET',
            success: function (data, textStatus, xhr) {
                console.log(data);
                formatData(data);
               // $('#agree').click(likeReview);
              //  $('#disagree').click(dislikeReview);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }

    function formatData(data) {
        if (data.subject.faculty.length > 2 && data.subject.faculty[1] === 'п') {
            data.subject.faculty = data.subject.faculty.slice(0, 2).toUpperCase() + data.subject.faculty[2] + data.subject.faculty.slice(3);
        } else {
            data.subject.faculty = data.subject.faculty.toUpperCase();
        }
        // data.subjects[counter].course=data.subjects[counter].course+;
        data.subject.semester = " "+data.subject.semester[0].toUpperCase() + data.subject.semester.slice(1);
        data.subject.title = data.subject.title[0].toUpperCase() + data.subject.title.slice(1);
        data.subject.last_name = data.subject.last_name[0].toUpperCase() + data.subject.last_name.slice(1);
        data.subject.first_name = data.subject.first_name[0].toUpperCase() + ".";
        data.subject.patronymic = data.subject.patronymic[0].toUpperCase() + ".";

        $('#infoSubj').html(showSubjInfo(data));
        $('#allReviews').html(showReviews(data));

    }
    function showSubjInfo(data) {
        let res = "";
        res = "<div class='container-fluid mt-5 borderEP'>" +
            "<div class='row'>" +
            "<div class='col-sm-4 EPInfoBackground'>" +
            "<span class='text-white subjectYearPage'><small>" + data.subject.year +  data.subject.semester+"</small></span>" +
            "<br>" +
            "<span class='text-white subjectFacultyPage'><small>" + data.subject.faculty + "</small></span>" +
            "<br>" +

            "<h6 class='text-white  mt-5 mb-5 subjectTitlePage'>" + data.subject.title + "</h6>" +

            "<span class='text-white subjectSNP'><small>" + data.subject.last_name + " " + data.subject.first_name + data.subject.patronymic + "</small></span>" +
            "<span class='text-white subjectCoursePage'><small>" + data.subject.course + "курс </small></span>" +
            "</div>" +

            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Потрібні початкові знання</span>" +
            "<br>" +
            "<output class='characteristics' name='basicKnowledgeSub'>" + data.subject.need_basic_knowledge + "</output>" +
            "</p>" +
            "<p>" +
            "<span >Техніка викладання</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.subject.edu_technique + "</output>" +
            "</p>" +
            "<p>" +
            "<span>Складність курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='complexityC'>" + data.subject.course_complexity + "</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Актуальність матеріалів курсу</span>" +
            "<br>" +
            "<output class='characteristics' name='modernMater'>" + data.subject.nowadays_knowledge + "</output>" +
            "</p>" +
            "<p>" +
            "<span >Відповідність теорії та практики</span>" +
            "<br>" +
            "<output class='characteristics' name='technique'>" + data.subject.theory_practice + "</output>" +
            "</p>" +
            "<p>" +
            "<span>Критика зі сторони викладача</span>" +
            "<br>" +
            "<output class='characteristics' name='criticismTeacher'>" + data.subject.teacher_criticism + "</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-2  my-auto text-center'>" +
            "<h2>" + data.subject.average_grade + "</h2>" +
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
        let counter = 0;
        let counterReply=0;
        let res = "";
        let makeReply="";
        while (counter < data.reviews.length) {
            let date = new Date(data.reviews[counter].date_rev);

            makeReply="<div class='container-fluid rounded mb-5 borderReview'>" +
                "<div class='row'>" +
                "<textarea name='replyText' class='ml-1 mr-1 mt-2 mb-2 makeReplyText'></textarea>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='ml-auto'>" +
                "<button onclick='cancelMakeReply("+data.reviews[counter].review_id+");' class='btn-lg mr-4 text-white btn-danger mb-2'>Скасувати</button>"+
                "<button class='btn-lg mr-4 text-white makeEpPageRev mb-2'>Надіслати</button>"+
                "</div>"+
                "</div>"+
                "</div>";

            res +=
                "<div class='container-fluid rounded mb-5 borderReview'>" +
                "<div class='row'>" +
                "<div class='col-md-4'>" +
                "<div class='text-center mainInfoUser'>" +
                "<br>" +
                "<a href='/profile/"+data.reviews[counter].nickname+"'><img  class='rounded-circle mt-3 avatarRevEP' src='/images/defUser.png'></a>" +
                "<br>" +
                "<a href='/profile/"+data.reviews[counter].nickname+"' class='characteristics text-decoration-none' name='userName'>" + data.reviews[counter].nickname + "</a>" +
                "<br>" +
                "</div>" +
                "<div class='row userRate text-center'>" +
                "<div class='col-sm-6 text-center subjectRateRevEp'>" +
                "<img class='subjPageReviews' src='/images/subject.png'>" +
                "</div>" +
                "<div class='col-sm-6 text-center'>" +
                "<span id='UserRate" + data.reviews[counter].review_id +"'>" + data.reviews[counter].subject_rate + "</span>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='firstCol'>" +
                "<p>" +
                "<span>Складність курсу</span>" +
                "<br>" +
                "<output class='characteristics' name='complexityC'>" + data.reviews[counter].course_complexity + "</output>" +
                "</p>" +

                "<p>" +
                "<span>Потрібні початкові знання</span>" +
                "<br>" +
                "<output class='characteristics' name='basicKnowledgeSub'>" + data.reviews[counter].need_basic_knowledge + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Критика зі сторони викладача</span>" +
                "<br>" +
                "<output class='characteristics'  name='criticismTeacher'>" + data.reviews[counter].teacher_criticism + "</output>" +
                "</p>" +
                "</div>" +
                "<div class='secondCol'>" +
                "<p>" +
                "<span>Техніка викладання</span>" +
                "<br>" +
                "<output class='characteristics' name='technique'>" + data.reviews[counter].edu_technique + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Актуальність матеріалів курсу</span>" +
                "<br>" +
                "<output class='characteristics' name='modernMater' >" + data.reviews[counter].nowadays_knowledge + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Відповідність теорії та практики</span>" +
                "<br>" +
                "<output class='characteristics' name='technique'>" + data.reviews[counter].theory_practice + "</output>" +
                "</p>" +
                "</div>" +
                "<div class='thirdCol my-auto text-center'>" +
                "<h2>" + data.reviews[counter].average_grade + "</h2>" +
                "</div>" +
                "</div>" +
                "<div class='row mt-4 review'>" +
                "<p>" + data.reviews[counter].general_impression + "</p>" +
                "</div>" +
                "<div class='row ml-5 mr-5'>" +
                "<p>" +
                "<div class='mr-3'>" +
                "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true'></i>" +
                "<span id='ReviewRate" + data.reviews[counter].review_id +"' class='quantityLikesEp' name='likesReview'>" + data.reviews[counter].rate + "</span>" +
                "</div>" +
                // <button  class='btn btn-lg rounded-circle socialBut' type='button'><i class='fa fa-instagram' aria-hidden='true'></i> </button>
                "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReview("+data.reviews[counter].review_id+","+data.reviews[counter].user_id+",true)'>Підтримую</button>" +
                "<button class='btn btn-lg text-decoration-none mr-2' onclick='likeReview("+data.reviews[counter].review_id+","+data.reviews[counter].user_id+",false)' >Не погоджуюсь</button>" +
                "<button onclick='makeReply("+data.reviews[counter].review_id+");' class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>"+
                "<div class='ml-auto'> " +
                date.getDate() + '.'+ (date.getMonth() + 1)+'.' + date.getFullYear() + "  " + data.reviews[counter].time_rev.substr(0, 5) +
                "</div>" +

                "</p>" +
                "</div>" +
                "<div id='makeReplyDiv"+data.reviews[counter].review_id+"' style='display: none'>"+makeReply+ "</div>"+
                "</div>";

            if(counterReply<data.reviews[counter].replies.length){
                let dateReply = new Date(data.reviews[counter].replies[counterReply].date_rev);
                res+= "<div class='reply'>" +
                    "<div class='container-fluid rounded mb-5 borderReview'>" +
                    "<div class='row'>" +
                    "<div class='col-md-4'>" +
                    "<div class='text-center mainInfoUser'>" +
                    "<br>" +
                    "<img class='rounded-circle mt-3 replyEpAvatar' src='/images/defUser.png'>" +
                    "<br>" +
                    "<output class='replyUsernameEp' name='replyUserName'>" + data.reviews[counter].replies[counterReply].nickname + "</output>" +
                    "<br>" +
                    "</div>" +
                    "<div class='row userRate'>" +
                    "<div class='col-sm-6 text-center subjectRateRevEp'>" +
                    "<img class='replySubjPageReviews' src='/images/subject.png'>" +
                    "</div>" +
                    "<div class='col-sm-6 text-center'>" +
                    "<span>"+data.reviews[counter].replies[counterReply].subject_rate+"</span>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='col-md-8 my-auto'>" +
                    "<div class='replyText my-auto review'>" +
                    "<p class='replyText'>" + data.reviews[counter].replies[counterReply].general_impression + "</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='row mt-3 ml-5'>" +
                    "<p>" +
                    "<a class='text-decoration-none mr-4' href='#'>Відповісти</a>" +
                    "<div class='mr-3'>" +
                    "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true'></i>" +
                    "<span class='quantityLikesEp' name='likesReview'> "+ data.reviews[counter].replies[counterReply].rate  + "</span>" +
                    "</div>" +
                    "<a class='text-decoration-none mr-2' href='#' onclick='likeReview("+data.reviews[counter].replies[counterReply].id+")'>Підтримую</a>" +
                    "<a id = 'disagree' onclick='likeReview("+data.reviews[counter].replies[counterReply].id+");' class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>" +
                    "<div class='ml-auto mr-5'>" + dateReply.getDate() + '.'+ (dateReply.getMonth() + 1)+'.' + dateReply.getFullYear() + "  " + data.reviews[counter].replies[counterReply].time_rev.substr(0, 5) +
                    "</div>" +
                    "</p>" +
                    "</div>" +
                    "</div>";

                counterReply++;

                while(counterReply<data.reviews[counter].replies.length){
                    let dateReply1 = new Date(data.reviews[counter].replies[counterReply].date_rev);
                    res+= "<a href='#' data-toggle='collapse' data-target='#otherSComments'>Ще "+(data.reviews[counter].replies.length-1)+" коментар(-iв)</a>" +
                        "<div id='otherSComments' class='mt-3 collapse'>" +
                        "<div class='container-fluid rounded mb-5 borderReview'>" +
                        "<div class='row'>" +
                        "<div class='col-md-4'>" +
                        "<div class='text-center mainInfoUser'>" +
                        "<br>" +
                        "<img class='rounded-circle mt-3 replyEpAvatar' src='/images/defUser.png'>" +
                        "<br>" +
                        "<output class='replyUsernameEp' name='replyUserName'>" +data.reviews[counter].replies[counterReply].nickname  + "</output>" +
                        "<br>" +
                        "</div>" +
                        "<div class='row userRate'>" +
                        "<div class='col-sm-6 text-center subjectRateRevEp'>" +
                        "<img class='replySubjPageReviews' src='/images/subject.png'>" +
                        "</div>" +
                        "<div class='col-sm-6 text-center'>" +
                        "<span> " +data.reviews[counter].replies[counterReply].subject_rate+"  </span>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "<div class='col-md-8 my-auto'>" +
                        "<div class='replyText my-auto review'>" +
                        "<p class='replyText'>"+ data.reviews[counter].replies[counterReply].general_impression +"</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "<div class='row mt-3 ml-5'>" +
                        "<p>" +
                        "<a class='text-decoration-none mr-4' href='#'>Відповісти</a>" +
                        "<div class='mr-3'>" +
                        "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true' ></i>" +
                        "<span class='quantityLikesEp' name='likesReview'> "+ data.reviews[counter].replies[counterReply].rate + "</span>" +
                        "</div>" +
                        "<a class='text-decoration-none mr-2' href='#' onclick='likeReview("+data.reviews[counter].replies[counterReply].id+")'>Підтримую</a>" +
                        "<a id = 'disagree' onclick='likeReview("+data.reviews[counter].replies[counterReply].id+");' class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>" +
                        "<div class='ml-auto'>" + dateReply1.getDate() + '.'+ (dateReply1.getMonth() + 1)+'.' + dateReply1.getFullYear() + "  " + data.reviews[counter].replies[counterReply].time_rev.substr(0, 5) +
                        "</div>" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    counterReply++;
                }
                res+="</div>";
            }

            counter++;
        }
       /* res += "<div class='reply'>" +
            "<div class='container-fluid rounded mb-5 borderReview'>" +
            "<div class='row'>" +
            "<div class='col-md-4'>" +
            "<div class='text-center mainInfoUser'>" +
            "<br>" +
            "<img class='rounded-circle mt-3 replyEpAvatar' src='/images/defUser.png'>" +
            "<br>" +
            "<output class='replyUsernameEp' name='replyUserName'>" + yellowstone123 + "</output>" +
            "<br>" +
            "</div>" +
            "<div class='row userRate'>" +
            "<div class='col-sm-6 text-center subjectRateRevEp'>" +
            "<img class='replySubjPageReviews' src='/images/subject.png'>" +
            "</div>" +
            "<div class='col-sm-6 text-center'>" +
            "<span> 4  </span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='col-md-8 my-auto'>" +
            "<div class='replyText my-auto review'>" +
            "<p class='replyText'> + КурсДужеСподобався + </p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='row mt-3 ml-5'>" +
            "<p>" +
            "<a class='text-decoration-none mr-4' href='#'>Відповісти</a>" +
            "<div class='mr-3'>" +
            "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true'></i>" +
            "<span class='quantityLikesEp' name='likesReview'> + 2 + </span>" +
            "</div>" +
            "<a class='text-decoration-none mr-2' href='#'>Підтримую</a>" +
            "<a class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>" +
            "<button data-toggle='modal' data-target='#complain' class='complainreplyButton btn' type='button'><i class='fa fa-exclamation-circle complIcon' aria-hidden='true'></i></button>" +
            "</p>" +
            "</div>" +
            "</div>" +
            "<a href='#' data-toggle='collapse' data-target='#otherSComments'>Ще  1  коментар</a>" +
            "<div id='otherSComments' class='mt-3 collapse'>" +
            "<div class='container-fluid rounded mb-5 borderReview'>" +
            "<div class='row'>" +
            "<div class='col-md-4'>" +
            "<div class='text-center mainInfoUser'>" +
            "<br>" +
            "<img class='rounded-circle mt-3 replyEpAvatar' src='/images/defUser.png'>" +
            "<br>" +
            "<output class='replyUsernameEp' name='replyUserName'> + yellowstone123 + </output>" +
            "<br>" +
            "</div>" +
            "<div class='row userRate'>" +
            "<div class='col-sm-6 text-center subjectRateRevEp'>" +
            "<img class='replySubjPageReviews' src='/images/subject.png'>" +
            "</div>" +
            "<div class='col-sm-6 text-center'>" +
            "<span>  4  </span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='col-md-8 my-auto'>" +
            "<div class='replyText my-auto review'>" +
            "<p class='replyText'> + КурсДужеСподобався + </p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='row mt-3 ml-5'>" +
            "<p>" +
            "<a class='text-decoration-none mr-4' href='#'>Відповісти</a>" +
            "<div class='mr-3'>" +
            "<i class='fa fa-thumbs-o-up likesRevEp' aria-hidden='true' ></i>" +
            "<span class='quantityLikesEp' name='likesReview'> + 2 + </span>" +
            "</div>" +
            "<a class='text-decoration-none mr-2' href='#'>Підтримую</a>" +
            "<a class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>" +
            "<button data-toggle='modal' data-target='#complain' class='complainreplyButton btn' type='button'><i class='fa fa-exclamation-circle complIcon' aria-hidden='true'></i></button>" +
            "</p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";*/

        return res;
    }

});