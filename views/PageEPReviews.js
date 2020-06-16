let getInfoFunction;

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
        ep_review_id: id,
        general_impression: document.getElementsByName('replyText' + id)[0].value,
        date_rev: now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear(),
        time_rev: now.getHours() + ":" + now.getMinutes()
    };
    console.log(sendReply);
    if(sendReply.general_impression===""){
        alert("Залиште коментар, будь ласка.");
    }else {
        $.ajax({
            url: '/ep/reviews/reply',
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
        general_impression: document.getElementsByName('replyTextR' + id)[0].value,
        date_rev: now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear(),
        time_rev: now.getHours() + ":" + now.getMinutes()
    };
//    console.log(sendReply);
    if(sendReply.general_impression.toString()===""){
        alert("Залиште коментар, будь ласка.");
    }else {
        $.ajax({
            url: '/ep/reviews/reply',
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

function makeReplyReply(id) {
    document.getElementById("makeReplyReplyDiv" + id).style.display = "block";
    document.getElementById("buttonReplyReplyHide" + id).style.display = "none";
}

function cancelMakeReplyReply(id) {
    document.getElementById("makeReplyReplyDiv" + id).style.display = "none";
    document.getElementById("buttonReplyReplyHide" + id).style.display = "block";
}

function likeReview(review_id, reviewerId, isLike) {
    $.ajax({
        url: "/ep/rate/reviews/" + review_id,
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
        url: "/ep/rate/reply/" + reply_id,
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
$(document).ready(function () {
    /*var data={
       {"exchange_program":
       {"id":5,
       "title":"Erasmus+-",
       "university":"УКУ",
       "place_rating":"4.0",
       "adaptation":"4.0",
       "edu_difference":"5.0",
       "foreign_language":null,
       "average_grade":"4.0",
       "reviews_amount":"1",
       "branches":[
       {"id":122,"title":"комп’ютерні науки"},
       {"id":81,"title":"право"}]

       }
        }
    }*/


    getInfo();
    getInfoFunction = getInfo;

    function getInfo() {
        let urlPartsArr = window.location.href.split('/');
        let ep_id = urlPartsArr[urlPartsArr.length - 1];
        document.getElementById('allReviews').innerHTML = '';


        $.ajax({
            url: "/ep/" + ep_id + "/data/exchange-program",
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

       function getReviews(offset) {

             $.ajax({
                 url: "/ep/" + ep_id + "/data/reviews/" + offset,
                 type: 'GET',
                 success: function (data, textStatus, xhr) {
                     console.log(data);
                     if (data !== null) {
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

    function formatData(data){
        console.log("in format data");
            for (i = 0; i < data.exchange_program.branches.length; i++) {
                data.exchange_program.branches[i].title = data.exchange_program.branches[i].title[0].toUpperCase() + data.exchange_program.branches[i].title.slice(1);
            }
        $('#infoEp').html(showSubjInfo(data));
    }

    function showSubjInfo(data) {

        let res = "";
        let tooltipBranches = "";
        let quantityTeach = "";

        if (data.exchange_program.branches.length > 1) {
            for (q = 1; q < data.exchange_program.branches.length; q++) {
                tooltipBranches += data.exchange_program.branches[q].id + " " + data.exchange_program.branches[q].title + "; ";
            }
            quantityTeach = " +" + (data.exchange_program.branches.length - 1);
        }

        res+=   "<div class='container-fluid mt-5 borderEP'>"+
            "<div class='row'>"+
            "<div class='col-md-4 EPInfoBackground'>"+
            "<span class='text-white epTitle'><small>" + data.exchange_program.title + "</small></span>" +
            "<br>" +
            "<span class='text-white epFiltersCourse'><small></small></span>"
            + "<br>" + "<h3 class='text-white  mt-3' >"
            + data.exchange_program.university + "</h3>"
            + "<br><br>" +
            "<span class='text-white subjectRevSNP'><small>" + data.exchange_program.branches[0].id + " " + data.exchange_program.branches[0].title
            + "</small><a href='#' class='text-white quantityTeach' data-toggle='tooltip' data-html='true' title='" + tooltipBranches + "'>" + quantityTeach + "</a></span>"

            +"</div>"+
            "<div class='colSpace'></div>"+
            "<div class='colFirstEp my-auto'>"+
            "<p class='mt-4'>"+
            "<span class='fontSub'>Оцінка місця проживання</span>"+
        "<br>"+
        "<output class='characteristics' name='basicKnowledgeSub'>"+data.exchange_program.place_rating+"</output>"+
            "</p>"+
            "<p>"+
            "<span class='fontSub'>Середній рівень англійської</span>"+
        "<br>"+
        "<output class='characteristics' name='technique'>"+data.exchange_program.foreign_language+"</output>"+
            "</p>"+
            "</div>"+
            "<div class='colSecondEp my-auto'>"+
            "<p class='mt-4'>"+
            "<span class='fontSub'>Успішність адаптації</span>"+
        "<br>"+
        "<output class='characteristics' name='modernMater'>"+data.exchange_program.adaptation+"</output>"+
            "</p>"+
            "<p>"+
            "<span class='fontSub'>Середній бал в КМА на момент поїздки</span>"+
        "<br>"+
        "<output class='characteristics' name='technique'>"+data.exchange_program.avarage_bal_KMA+"</output>"+
           "</p>"+
            "</div>"+
            "<div class='colThird my-auto text-center'>"+
            "<h2 >"+data.exchange_program.average_grade+"</h2>"+
            "<span class='quantityRevEPPage'><small>"+data.exchange_program.reviews_amount+" відгуків</small></span>"+
       " </div>"+
        "</div>"+
        "</div>"+
        "<div >"+
            `<button onclick="window.location='/ep/${data.exchange_program.id}/createReview'" class='btn btn-block text-white text-center makeEpPageRev'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Залишити відгук</button>` + "</div>";

        return res;
    }

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

        res+= " <h3 class='mt-5 mb-5 ml-5 allEpRev'>Усі відгуки</h3>";
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
            "<span id='UserRate" + data.reviews[counter].review_id + "'>" + data.reviews[counter].ep_rate + "</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='firstCol'>" +
            "<p class='mt-4'>"+
            "<span class='fontSub'>Оцінка місця проживання</span>"+
            "<br>"+
            "<output class='characteristics' name='basicKnowledgeSub'>"+data.reviews[counter].place_rating+"</output>"+
            "</p>"+
            "<p>"+
            "<span class='fontSub'>Середній рівень англійської</span>"+
            "<br>"+
            "<output class='characteristics' name='technique'>"+data.reviews[counter].foreign_language+"</output>"+
            "</p>"+
            "</div>" +
            "<div class='secondCol'>" +
            "<p class='mt-4'>"+
            "<span class='fontSub'>Успішність адаптації</span>"+
            "<br>"+
            "<output class='characteristics' name='modernMater'>"+data.reviews[counter].adaptation+"</output>"+
            "</p>"+
            "<p>"+
            "<span class='fontSub'>Середній бал в КМА на момент поїздки</span>"+
            "<br>"+
            "<output class='characteristics' name='technique'>"+data.reviews[counter].avarage_bal_KMA+"</output>"+
            "</p>"+
            "</div>"+
            "<div class='thirdCol my-auto text-center'>" +
            "<h2>" + data.reviews[counter].average_grade + "</h2>" +
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
                "<span id='UserReply" + data.reviews[counter].replies[counterReply].id + "'>" + data.reviews[counter].replies[counterReply].ep_rate + "</span>" +
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
                "<button onclick='makeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>" +
                "</div>" +
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
                    "<span id='UserReply" + data.reviews[counter].replies[counterReply].id + "'> " + data.reviews[counter].replies[counterReply].ep_rate + "  </span>" +
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
                    "<button onclick='makeReplyReply(" + data.reviews[counter].replies[counterReply].id + ");' class='btn btn-lg text-decoration-none mr-2'>Відповісти</button>" +
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

