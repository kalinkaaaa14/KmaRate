let getInfoFunction;

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
        document.getElementById('allEPReviews').innerHTML = '';


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

       // setTimeout(getReviews, 0, 0);

        // function getReviews(offset) {
        //
        //     $.ajax({
        //         url: "/ep/" + ep_id + "/data/reviews/" + offset,
        //         type: 'GET',
        //         success: function (data, textStatus, xhr) {
        //             console.log(data);
        //             if (data !== null) {
        //                 let revLength = data.reviews.length;
        //                 showReviews(data);
        //                 setTimeout(getReviews, 0, offset + revLength);
        //                 // getReviews();
        //             }
        //         },
        //         error: function (xhr, textStatus, errorThrown) {
        //             console.log('Error in Operation');
        //         }
        //     });
        // }
    }

    function formatData(data){
        console.log("in format data");
            for (i = 0; i < data.exchange_program.branches.length; i++) {
                data.exchange_program.branches[i].title = data.exchange_program.branches[i].title[0].toUpperCase() + data.exchange_program.branches[i].title.slice(1);
            }
        $('#infoEp').html(showSubjInfo(data));
    }

    function showSubjInfo(data) {
        console.log("in subj info");
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
        `<button onclick='window.location='/ep/${data.exchange_program.id}/createReview'"  class='btn btn-block text-white text-center makeEpPageRev'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Залишити відгук</button>`+
        "</div>";

        return res;
    }

});

