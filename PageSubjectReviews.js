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
       // formatData(data);
        $.ajax({
            url: "/subj/4/data",
            type: 'GET',
            success: function (data, textStatus, xhr) {
              console.log(data);
                formatData(data);
            },
            error: function (xhr, textStatus, errorThrown) {

                console.log('Error in Operation');
            }
        });
    }

    function formatData(data) {
        if(data.subject.faculty.length>2 && data.subject.faculty[1]==='п'){
            data.subject.faculty=data.subject.faculty.slice(0,2).toUpperCase()+data.subject.faculty[2]+data.subject.faculty.slice(3);
        }else{
            data.subject.faculty=data.subject.faculty.toUpperCase();
        }
        // data.subjects[counter].course=data.subjects[counter].course+;
        data.subject.title=data.subject.title[0].toUpperCase() + data.subject.title.slice(1);
        data.subject.last_name= data.subject.last_name[0].toUpperCase() + data.subject.last_name.slice(1);
        data.subject.first_name= data.subject.first_name[0].toUpperCase() + ".";
        data.subject.patronymic=data.subject.patronymic[0].toUpperCase() + ".";

        $('#infoSubj').html(showSubjInfo(data));
        $('#allReviews').html(showReviews(data));

    }

    function showSubjInfo(data) {
        let res = "";
        res = "<div class='container-fluid mt-5' style='outline: 2px solid lightgray;  border: 0.1px solid #fff;'>"+
            "<div class='row'>" +
            "<div class='col-sm-4' style='background-color: #274B69'>" +
            "<span class='text-white' style='position: absolute;top: 8px;left: 16px;'><small>" + data.subject.year + "</small></span>" +
            "<br>" +
            "<span class='text-white' style='position: absolute;top: 8px;right: 16px;'><small>" + data.subject.faculty + "</small></span>" +
            "<br>" +

            "<h6 class='text-white  mt-5 mb-5' style='text-align: left;'>" + data.subject.title + "</h6>" +

            "<span class='text-white' style='position: absolute; bottom: 8px; left: 16px;'><small>" + data.subject.last_name+" "+data.subject.first_name+data.subject.patronymic + "</small></span>" +
            "<span class='text-white' style='position: absolute;bottom: 8px;right: 16px;'><small>" + data.subject.course + "курс </small></span>" +
            "</div>" +

            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Потрібні початкові знання</span>" +
            "<br>" +
            "<output name='basicKnowledgeSub' style='font-weight: bolder'>" + data.subject.need_basic_knowledge + "</output>" +
            "</p>" +
            "<p>" +
            "<span >Техніка викладання</span>" +
            "<br>" +
            "<output name='technique' style='font-weight: bold'>" + data.subject.edu_technique + "</output>" +
            "</p>" +
            "<p>" +
            "<span>Складність курсу</span>" +
            "<br>" +
            "<output name='complexityC' style='font-weight: bold'>" + data.subject.course_complexity+ "</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-3 my-auto'>" +
            "<p class='mt-4'>" +
            "<span>Актуальність матеріалів курсу</span>" +
            "<br>" +
            "<output name='modernMater' style='font-weight: bolder'>" + data.subject.nowadays_knowledge + "</output>" +
            "</p>" +
            "<p>" +
            "<span >Відповідність теорії та практики</span>" +
            "<br>" +
            "<output name='technique' style='font-weight: bold'>" + data.subject.theory_practice + "</output>" +
            "</p>" +
            "<p>" +
            "<span>Критика зі сторони викладача</span>" +
            "<br>" +
            "<output  name='criticismTeacher' style='font-weight: bold'>" + data.subject.teacher_criticism + "</output>" +
            "</p>" +
            "</div>" +
            "<div class='col-sm-2  my-auto text-center'>" +
            "<h2>" + data.subject.average_grade + "</h2>" +
            "<span style='color: rgba(27,23,22,0.7)'><small>" + data.subject.reviews_amount + " відгуків</small></span>" +
            "</div>" +
            "</div>"+
        "</div>"+
            "<div>"+
            "<button onclick='makeReview()' class='btn btn-block text-white text-center' style='background-color: #274B69;'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Залишити відгук</button>"+
            "</div>";

        return res;
            //onclick="document.location='/user/RevSubject.html'"
    }
    function makeReview() {
        document.location='/user/RevSubject.html';
    }

    function showButRev() {
let res="";
res= "<div>"+
    "<button onclick='document.location='/user/RevSubject.html'"+"class='btn btn-block text-white text-center' style='background-color: #274B69;'><i class='fa fa-pencil-square-o' aria-hidden='true'></i> Залишити відгук</button>"+
    "</div>";
return res;
    }
//додати час і дату відгукам
    function showReviews(data){
        let counter=0;
        let res="";
        while (counter < data.reviews.length) {
            res = "<h3 class='mt-5 mb-5 ml-5' style='font-size: 36px;'>Усі відгуки</h3>"+
                "<div class='container-fluid rounded mb-5' style='border: 1px solid lightgray;'>" +
                "<div class='row'>" +
                "<div class='col-md-4'>" +
                "<div class='text-center mainInfoUser'>" +
                "<br>" +
                "<img class='rounded-circle mt-3' src='/images/defUser.png' style='width:200px;height:200px ;'>" +
                "<br>" +
                "<output name='userName' style='font-weight: bold;'>" + data.reviews[counter].nickname + "</output>" +
                "<br>" +
                "</div>" +
                "<div class='row userRate text-center' style='border: 1px solid lightgray;'>" +
                "<div class='col-sm-6 text-center' style='background: #274B69;'>" +
                "<img class='subjPageReviews' src='/images/subject.png'>" +
                "</div>" +
                "<div class='col-sm-6 text-center'>" +
                "<span>" + data.reviews[counter].reviewsAmount + "</span>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='firstCol'>" +
                "<p>" +
                "<span>Складність курсу</span>" +
                "<br>" +
                "<output name='complexityC' style='font-weight: bold'>" + data.reviews[counter].course_complexity + "</output>" +
                "</p>" +

                "<p>" +
                "<span>Потрібні початкові знання</span>" +
                "<br>" +
                "<output name='basicKnowledgeSub' style='font-weight: bolder'>" + data.reviews[counter].need_basic_knowledge + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Критика зі сторони викладача</span>" +
                "<br>" +
                "<output  name='criticismTeacher' style='font-weight: bold'>" + data.reviews[counter].teacher_criticism + "</output>" +
                "</p>" +
                "</div>" +
                "<div class='secondCol'>" +
                "<p>" +
                "<span>Техніка викладання</span>" +
                "<br>" +
                "<output name='technique' style='font-weight: bold'>" + data.reviews[counter].edu_technique + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Актуальність матеріалів курсу</span>" +
                "<br>" +
                "<output name='modernMater' style='font-weight: bolder'>" + data.reviews[counter].nowadays_knowledge + "</output>" +
                "</p>" +
                "<p>" +
                "<span>Відповідність теорії та практики</span>" +
                "<br>" +
                "<output name='technique' style='font-weight: bold'>" + data.reviews[counter].theory_practice + "</output>" +
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
                "<a class='text-decoration-none mr-4' href='#'>Відповісти</a>" +
                "<div class='mr-3'>" +
                "<i class='fa fa-thumbs-o-up' aria-hidden='true' style='color: #274B69;'></i>" +
                "<span name='likesReview' style='font-weight: bold;'>" + data.reviews[counter].rate + "</span>" +
                "</div>" +
                "<a class='text-decoration-none mr-2' href='#'>Підтримую</a>" +
                "<a class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>"+
                "<button data-toggle='modal' data-target='#complain' class='complainButton btn' type='button' style='margin-top: -15px;'><i class='fa fa-exclamation-circle' style='color: #274B69;' aria-hidden='true'></i></button>" +
                "<div class='ml-auto'> " +
                data.reviews[counter].date_rev+" "+ data.reviews[counter].time_rev+
                "</div>"+

                "</p>" +
                "</div>" +
                "</div>" +
                "<div class='reply'>" +
                "<div class='container-fluid rounded mb-5' style='border: 1px solid lightgray;'>" +
                "<div class='row'>" +
                "<div class='col-md-4'>" +
                "<div class='text-center mainInfoUser'>" +
                "<br>" +
                "<img class='rounded-circle mt-3' src='/images/defUser.png' style='width:150px;height:150px ;'>" +
                "<br>" +
                "<output name='replyUserName' style='font-weight: bold;'> + yellowstone123 + </output>" +
                "<br>" +
                "</div>" +
                "<div class='row userRate' style='border: 1px solid lightgray;'>" +
                "<div class='col-sm-6 text-center' style='background: #274B69;'>" +
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
                "<i class='fa fa-thumbs-o-up' aria-hidden='true' style='color: #274B69;' ></i>" +
                "<span name='likesReview' style='font-weight: bold;'> + 2 + </span>" +
                "</div>" +
                "<a class='text-decoration-none mr-2' href='#'>Підтримую</a>" +
                "<a class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>"+
                "<button data-toggle='modal' data-target='#complain' class='complainreplyButton btn' type='button' style='margin-top: -15px;'><i class='fa fa-exclamation-circle' style='color: #274B69;' aria-hidden='true'></i></button>" +
                "</p>" +
                "</div>" +
                "</div>" +
                "<a href='#' data-toggle='collapse' data-target='#otherSComments'>Ще  1  коментар</a>" +
                "<div id='otherSComments' class='mt-3 collapse'>" +
                "<div class='container-fluid rounded mb-5' style='border: 1px solid lightgray;'>" +
                "<div class='row'>" +
                "<div class='col-md-4'>" +
                "<div class='text-center mainInfoUser'>" +
                "<br>" +
                "<img class='rounded-circle mt-3' src='/images/defUser.png' style='width:150px;height:150px ;'>" +
                "<br>" +
                "<output name='replyUserName' style='font-weight: bold;'> + yellowstone123 + </output>" +
                "<br>" +
                "</div>" +
                "<div class='row userRate' style='border: 1px solid lightgray;'>" +
                "<div class='col-sm-6 text-center' style='background: #274B69;'>" +
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
                "<i class='fa fa-thumbs-o-up' aria-hidden='true' style='color: #274B69;' ></i>" +
                "<span name='likesReview' style='font-weight: bold;'> + 2 + </span>" +
                "</div>" +
                "<a class='text-decoration-none mr-2' href='#'>Підтримую</a>" +
                "<a class='text-decoration-none mr-5' href='#'>Не погоджуюсь</a>"+
                "<button data-toggle='modal' data-target='#complain' class='complainreplyButton btn' type='button' style='margin-top: -15px;'><i class='fa fa-exclamation-circle' style='color: #274B69;' aria-hidden='true'></i></button>" +
                "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

            counter++;
        }
return res;
    }
});