$(document).ready(function () {
    let urlPartsArr = window.location.href.split('/');
    let user_nick = urlPartsArr[urlPartsArr.length - 1];

    let showTelegram="";
    let showFacebook="";
    let showInstagram="";

    getInfoUser();
    getInfoReviews();

    function getInfoUser() {



        $.ajax({
          //  url: "http://92.249.117.82:4321/profile/:" + user_nick + "/data",
            url: "/profile/" + user_nick + "/data",
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
    function getInfoReviews(){
        // let urlPartsArr = window.location.href.split('/');
        // let user_nick = urlPartsArr[urlPartsArr.length - 1];

        $.ajax({
            //  url: "http://92.249.117.82:4321/profile/:" + user_nick + "/data",
            url: "/profile/" + user_nick + "/reviews",
            type: 'GET',
            success: function (data, textStatus, xhr) {
                console.log(data);
                formatDataRev(data);
            },
            error: function (xhr, textStatus, errorThrown) {

                console.log('Error in Operation');
            }
        });
    }
    function formatDataRev(data){
        for(i=0;i<data.subject_reviews.length;i++){
            data.subject_reviews[i].title = data.subject_reviews[i].title[0].toUpperCase()+ data.subject_reviews[i].title.slice(1);
        }
        for(i=0;i<data.ep_reviews.length;i++){
            switch(data.ep_reviews[i].foreign_language) {
                case 1:
                    data.ep_reviews[i].foreign_language = "A1";
                    break;
                case 2:
                    data.ep_reviews[i].foreign_language = "A2";
                    break;
                case 3:
                    data.ep_reviews[i].foreign_language = "B1";
                    break;
                case 4:
                    data.ep_reviews[i].foreign_language = "B2";
                    break;
                case 5:
                    data.ep_reviews[i].foreign_language = "C1";
                    break;
                case 6:
                    data.ep_reviews[i].foreign_language = "C2";
                    break;
            }
        }

        $('#revInfo').html(showUserRev(data));
    }
    function formatData(data) {

        data.branch_title = " "+data.branch_title[0].toUpperCase() + data.branch_title.slice(1);

        if(data.telegram !== "" && data.telegram !== null){
            showTelegram= "<a href='"+data.telegram+"'><button  class='btn btn-lg rounded-circle socialBut'  type='button'><i class='fa fa-telegram'  aria-hidden='true'></i></button></a>";
        }
        if(data.facebook !== "" &&  data.facebook !== null){
            showFacebook= "<a href='"+data.facebook+"'><button  class='btn btn-lg rounded-circle socialBut' type='button'><i class='fa fa-facebook-square' aria-hidden='true'></i> </button></a>";
        }
        if(data.instagram !== "" &&  data.instagram !== null){
        showInstagram = "<a href='"+data.instagram+"'><button  class='btn btn-lg rounded-circle socialBut' type='button'><i class='fa fa-instagram' aria-hidden='true'></i> </button></a>";
        }
       switch (data.faculty_title) {
           case "фі":
               data.faculty_title = "інформатики";
               break;
           case "фпрн":
               data.faculty_title = "природничих наук";
               break;
           case "фпвн":
               data.faculty_title = "правничих наук";
               break;
           case "фен":
               data.faculty_title = "економічних наук";
               break;
           case "фгн":
               data.faculty_title = "гуманітарних наук";
               break;
           case "фснст":
               data.faculty_title = "соціальних наук та соціальних технологій";
               break;
       }

        $('#infoUser').html(showUserInfo(data));
    }

    function showUserRev(data) {
        let counter = 0;
        let res = "";
        let needKnow="";
        let dontNeedKnow="";
        let likeTech="";
        let dontLikeTech="";
        let hardCourse="";
        let notHardCourse="";
        let usingKnowledge="";
        let notUsingKnowledge="";
        let nowadaysKnowledge ="";
        let notNowadaysKnowledge="";
        let theoryPractice="";
        let notTheoryPractice="";
        let teacherCriricism="";
        let notTeacherCriticism="";

        let goodPlaceRating="";
        let badPlaceRating="";
        let goodAdapt="";
        let badAdapt="";
        let bigEductDiff="";
        let smallEducDiff="";

        res+= "<h4 class='myReviews mb-3 mt-1 ml-5'> Відгуки ("+(data.subject_reviews.length+data.ep_reviews.length)+")</h4>";
        while (counter < data.subject_reviews.length) {
            let dNK=10-data.subject_reviews[counter].need_basic_knowledge;
            let dLT=10-data.subject_reviews[counter].edu_technique;
            let nHC=10-data.subject_reviews[counter].course_complexity;
            let nUK = 10 -data.subject_reviews[counter].using_knowledge;
            let nNK=10-data.subject_reviews[counter].nowadays_knowledge;
            let nTP=10-data.subject_reviews[counter].theory_practice;
            let nTC=10-data.subject_reviews[counter].teacher_criticism;

            while(data.subject_reviews[counter].need_basic_knowledge>0){
                needKnow+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].need_basic_knowledge--;
            }
            while(dNK>0){
               dontNeedKnow+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
               dNK--;
            }

            while(data.subject_reviews[counter].edu_technique>0){
                likeTech+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].edu_technique--;
            }
            while(dLT>0){
                dontLikeTech+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                dLT--;
            }

            while(data.subject_reviews[counter].course_complexity>0){
                hardCourse+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].course_complexity--;
            }
            while(nHC>0){
                notHardCourse+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nHC--;
            }

            while(data.subject_reviews[counter].using_knowledge>0){
                usingKnowledge+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].using_knowledge--;
            }
            while(nUK>0){
                notUsingKnowledge+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nUK--;
            }

            while(data.subject_reviews[counter].nowadays_knowledge>0){
                nowadaysKnowledge+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].nowadays_knowledge--;
            }
            while(nNK>0){
                notNowadaysKnowledge+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nNK--;
            }

            while(data.subject_reviews[counter].theory_practice>0){
                theoryPractice+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].theory_practice--;
            }
            while(nTP>0){
                notTheoryPractice+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nTP--;
            }

            while(data.subject_reviews[counter].teacher_criticism>0){
                teacherCriricism+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.subject_reviews[counter].teacher_criticism--;
            }
            while(nTC>0){
                notTeacherCriticism+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nTC--;
            }

            res +=
            "<div class='container'>"+
                "<div id='accordion'>"+
                "<div class='card'>"+
                "<div class='card-header cardHeaderProfile'>"+
                "<div class='row rowCard'>"+
                "<div class='nameRev ml-3 text-white nameReviewProfile'>"+
                data.subject_reviews[counter].title+
            "</div>"+
            "<div class='spaceBetwCols'></div>"+
                "<div class='avgGrade text-right text-white nameReviewProfile'>"+data.subject_reviews[counter].average_rate+"</div>"+
                "<div class='spaceBetwCols'></div>"+
                "<div class='dropDown text-right'>"+
                "<a class='card-link text-white nameReviewProfile' data-toggle='collapse' href='#collapseOne'>"+
                "<i class='fa fa-chevron-down' aria-hidden='true'></i></a>"+
            "</div>"+
            "<div class='spaceBetwCols'></div>"+
                "</div>"+
                "</div>"+
                "<div id='collapseOne' class='collapse' data-parent='#accordion'>"+
                "<div class='card-body'>"+
                "<div class='row'>"+
                "<div class='col-md-5'>"+
                "<p class='ml-3 myRevHeader'>Для розуміння курсу не потрібні початкові знання </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='needBaseKnow' />" +
                needKnow+
                dontNeedKnow+
            "</label>"+
            "</form>"+

            "<p class='ml-3 myRevHeader'>Мені сподобалась техніка викладання </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='likeTechnique' />"+
                likeTech+
                dontLikeTech+
            "</label>"+
            "</form>"+

            "<p class='ml-3 myRevHeader'>Курс був складним </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='complexityOfCourse' value='6' />"+
              hardCourse+
                notHardCourse+
           "</label>"+
            "</form>"+

            "<p class='ml-3 myRevHeader'>Знання були корисні для реального життя </p>"+
            "<form class='ml-4 rateReview'>"+
               "<label>"+
                "<input type='radio' name='complexityOfCourse' />"+
                usingKnowledge+
                notUsingKnowledge+
            "</label>"+
            "</form>"+
            "</div>"+
            "<div class='col-md-5'>"+
                "<p class='ml-3 myRevHeader'>Матеріали курсу були актуальними </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='actualMaterials'/>"+
                nowadaysKnowledge+
                notNowadaysKnowledge+
            "</label>"+
            "</form>"+

            "<p class='ml-3 myRevHeader'>Практика повністю відповідала теорії </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='practiceToTheory'/>"+
                theoryPractice+
                notTheoryPractice+
            "</label>"+
            "</form>"+

            "<p class='ml-3 myRevHeader'>Критика зі сторони викладача була зрозумілою та корисною </p>"+
            "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='critics' />"+
                teacherCriricism+
                notTeacherCriticism+
            "</label>"+
            "</form>"+
            "</div>"+
            "</div>"+
            "<div class='row mt-3 mr-3 ml-3 mb-4 myRevHeader'>"+
                data.subject_reviews[counter].general_impression+
            "</div>"+
            "<div class='row'>"+
                "<div class='col-md-4'></div>"+
                "<div class='col-md-4'></div>"+
                "<div class='col-md-4'>"+
                "<a class='btn btn-block detailsReviewProfile' href='/subj/" + data.subject_reviews[counter].subject_id + "'>Інші відгуки</a>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "<br>";

            counter++;
            needKnow="";
            dontNeedKnow="";
            likeTech="";
            dontLikeTech="";
            hardCourse="";
            notHardCourse="";
            usingKnowledge="";
            notUsingKnowledge="";
            nowadaysKnowledge ="";
            notNowadaysKnowledge="";
            theoryPractice="";
            notTheoryPractice="";
            teacherCriricism="";
            notTeacherCriticism="";
        }
        counter=0;
        // let goodPlaceRating="";
        // let badPlaceRating="";
        // let goodAdapt="";
        // let badAdapt="";
        // let bigEductDiff="";
        // let smallEducDiff="";

        while(counter<data.ep_reviews.length){
             let notPR=10-data.ep_reviews[counter].place_rating;
             let dAdapt=10-data.ep_reviews[counter].adaptation;
             let nED=10-data.ep_reviews[counter].edu_difference;


            while(data.ep_reviews[counter].place_rating>0){
                goodPlaceRating+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.ep_reviews[counter].place_rating--;
            }
            while(notPR>0){
                badPlaceRating+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                notPR--;
            }
            while(data.ep_reviews[counter].adaptation>0){
                goodAdapt+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.ep_reviews[counter].adaptation--;
            }
            while(dAdapt>0){
                badAdapt+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                dAdapt--;
            }
            while(data.ep_reviews[counter].edu_difference>0){
                bigEductDiff+= "<span class='iconRate'><i class='fa fa-circle-o mr-1 iconSize' aria-hidden='true'></i></span>";
                data.ep_reviews[counter].edu_difference--;
            }
            while(nED>0){
                smallEducDiff+= "<span class='iconTransp'><i class='fa fa-circle-o mr-1' aria-hidden='true'></i></span>";
                nED--;
            }

            res +=
                "<div class='container'>"+
                "<div id='accordion'>"+
                "<div class='card'>"+
                "<div class='card-header cardHeaderProfile'>"+
                "<div class='row rowCard'>"+
                "<div class='nameRev ml-3 text-white nameReviewProfile'>"+
                data.ep_reviews[counter].title+ " "+ data.ep_reviews[counter].university+
                "</div>"+
                "<div class='spaceBetwCols'></div>"+
                "<div class='avgGrade text-right text-white nameReviewProfile'>"+data.ep_reviews[counter].average_rate+"</div>"+
                "<div class='spaceBetwCols'></div>"+
                "<div class='dropDown text-right'>"+
                "<a class='card-link text-white nameReviewProfile' data-toggle='collapse' href='#collapseOne'>"+
                "<i class='fa fa-chevron-down' aria-hidden='true'></i></a>"+
                "</div>"+
                "<div class='spaceBetwCols'></div>"+
                "</div>"+
                "</div>"+
                "<div id='collapseOne' class='collapse' data-parent='#accordion'>"+
                "<div class='card-body'>"+
                "<div class='row'>"+
                "<div class='col-md-5'>"+
                "<p class='ml-3 myRevHeader'>Оцінка місця проживання </p>"+
                "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='needBaseKnow' />" +
                goodPlaceRating+
                badPlaceRating+
                "</label>"+
                "</form>"+

                "<p class='ml-3 myRevHeader'>Адаптація пройшла успішно </p>"+
                "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='likeTechnique' />"+
                goodAdapt+
                badAdapt+
                "</label>"+
                "</form>"+

                "<p class='ml-3 myRevHeader'>Різниця в навчанні </p>"+
                "<form class='ml-4 rateReview'>"+
                "<label>"+
                "<input type='radio' name='complexityOfCourse' value='6' />"+
                bigEductDiff+
                smallEducDiff+
                "</label>"+
                "</form>"+

                "</div>"+
                "<div class='col-md-5'>"+
                "<p class='ml-3 mt-2 myRevHeader'>Мій рівень англійської </p>"+
                "<p class='ml-3 mb-3 myRevHeader'>"+data.ep_reviews[counter].foreign_language+"</p>"+
                "<p class='ml-3 mt-4 myRevHeader'>Середній бал в КМА на момент поїздки </p>"+
                "<p class='ml-3 mt-4 mb-3 myRevHeader'>"+data.ep_reviews[counter].avarage_bal_KMA+"</p>"+
                "</div>"+
                "</div>"+
                "<div class='row mt-3 mr-3 ml-3 mb-4 myRevHeader'>"+
                data.ep_reviews[counter].general_impression+
                "</div>"+
                "<div class='row'>"+
                "<div class='col-md-4'></div>"+
                "<div class='col-md-4'></div>"+
                "<div class='col-md-4'>"+
                "<a class='btn btn-block detailsReviewProfile' href='/ep/" + data.ep_reviews[counter].ep_id + "'>Інші відгуки</a>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<br>";

            counter++;
             goodPlaceRating="";
             badPlaceRating="";
             goodAdapt="";
             badAdapt="";
             bigEductDiff="";
            smallEducDiff="";
        }

        return res;
    }

    function showUserInfo(data) {
        let res="";
        res="<h4 class='myReviews mt-5 mb-3 ml-5'>Профіль</h4>"+
            "<div class='container rounded mb-5 myProfileDiv'>"+
            "<div class='row'>"+
            "<div class='col-md-4'>"+
            "<div class='text-center mainInfoUser'>"+
            "<br>"+
            "<img class='rounded-circle mt-3 avatarInProfile' src=" + data.image_string + ">"+
            "<br>"+
            "<output class='mt-1 rateProfile' name='facultyUser'>Рейтинг</output>"+
            "<br>"+
            "</div>"+
            "<div class='row userRate'>"+
            "<div class='col-sm-3 text-center subjEPRateProfile'>"+
            "<img class='subjPageReviews' src='/images/subject.png'>"+
            "</div>"+
            "<div class='col-sm-3 text-center'>"+
            "<span>"+data.subject_rate+"</span>"+
            "</div>"+
            "<div class='col-sm-3 text-center subjEPRateProfile'>"+
            "<img class='epPageReviews' src='/images/Vector.png'>"+
            "</div>"+
            "<div class='col-sm-3 text-center'>"+
            "<span>"+data.ep_rate+"</span>"+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='infoProfile1'>"+
            "<p>"+
            "<output class='profileUsername' name='profileUsername'>"+data.nickname+"</output>"+
            "</p>"+
            "<p class='profileFacultyCourse'>"+
            "<output class='facultyInProfile' name='profileFaculty'>Факультет </output>"+
            "<br>"+
            "<output class='courseInProfile' name='profileCourse'>"+data.faculty_title+"</output>"+
            "</p>"+
          showTelegram+
            showInstagram+
            showFacebook+
        "</div>"+
        "<div class='spaceBetweenInfo'></div>"+
            "<div class='infoProfile2'>"+
            "<p>"+
            "<span class='emailInProfile'>Спеціальність</span>"+
            "<br>"+
           "<output class='emailInProfile' name='profileEmail'>"+data.branch_id+ data.branch_title+"</output>"+
       " </p>"+
       " </div>"+

        "</div>"+
        "<div class='row'>"+
            "<div class='col-md-4'></div>"+
            "<div class='col-md-8'>"+
            // "<a href='/settings'><button class='btn btn-block text-white text-center mt-3 mb-2 editProfileButton'>Редагувати профіль <i class='fa fa-pencil editProfileIcon' aria-hidden='true'></i></button></a>"+
"</div>"+
        "</div>"+
        "</div>"+
        "<br>";
        return res;
    }
});