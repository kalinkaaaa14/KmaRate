$(document).ready(function () {
   getInfo();
    getActiveUser();

   function getInfo() {
       $.ajax({

           url: "/subj/most-popular",
           type: 'GET',
           success: function (data, textStatus, xhr) {
              // console.log(data);

              formatData(data);
           },
           error: function (xhr, textStatus, errorThrown) {

               console.log('Error in Operation');
           }
       });

   }

   function getActiveUser(){
       //alert("lll");
       $.ajax({

           url: "/subj/active-user",
           type: 'GET',
           success: function (data, textStatus, xhr) {
               console.log(data);
               formatUsers(data);
           },
           error: function (xhr, textStatus, errorThrown) {

               console.log('Error in Operation');
           }
       });

   }

   function formatData(data){
       $('#topSubj').html(showSubj(data));
   }

   function formatUsers(data) {
       $('#topUsers').html(showUserInfo(data));
   }
       function showUserInfo(data) {
           let res = "";
           res += "<h4 class='display-4 text-center mt-5 mb-5'>Найактивніші користувачі!</h4>";
           for(i=0; i<data.users.length;i++) {

               if (data.users[i].faculty_title.length > 2 && data.users[i].faculty_title[1] === 'п') {
                   data.users[i].faculty_title = data.users[i].faculty_title.slice(0, 2).toUpperCase() +
                       data.users[i].faculty_title[2] + data.users[i].faculty_title[3].toUpperCase();
               } else {
                   data.users[i].faculty_title = data.users[i].faculty_title.toUpperCase();
               }

               res += "<div class='container rounded mb-5 myProfileDiv'>" +
                   "<div class='row'>" +
                   "<div class='col-md-4'>" +
                   "<div class='text-center mainInfoUser'>" +
                   "<br>" +
                   "<a href='/profile/" + data.users[i].nickname + "'><img class='rounded-circle mt-3 avatarInProfile' src=" + data.users[i].image_string + "></a>" +
                   "<br>" +
                   "<output class='mt-1 rateProfile' name='facultyUser'>Рейтинг</output>" +
                   "<br>" +
                   "</div>" +
                   "<div class='row userRate'>" +
                   "<div class='col-sm-3 text-center subjEPRateProfile'>" +
                   "<img class='subjPageReviews' src='/images/subject.png'>" +
                   "</div>" +
                   "<div class='col-sm-3 text-center'>" +
                   "<span>" + data.users[i].subject_rate + "</span>" +
                   "</div>" +
                   "<div class='col-sm-3 text-center subjEPRateProfile'>" +
                   "<img class='epPageReviews' src='/images/Vector.png'>" +
                   "</div>" +
                   "<div class='col-sm-3 text-center'>" +
                   "<span>" + data.users[i].ep_rate + "</span>" +
                   "</div>" +
                   "</div>" +
                   "</div>" +
                   "<div class='infoProfile1'>" +
                   "<p>" +
                   "<a class='profileUsername text-decoration-none' name='profileUsername'  href='/profile/" + data.users[i].nickname + "'> "+ data.users[i].nickname + "</a>" +
                   "</p>" +
                   "<p class='profileFacultyCourse'>" +
                   "<output class='facultyInProfile' name='profileFaculty'>Факультет </output>" +
                   "<br>" +
                   "<output class='courseInProfile' name='profileCourse'>" + data.users[i].faculty_title + "</output>" +
                   "</p>" +
                   "</div>" +
                   "<div class='spaceBetweenInfo'></div>" +
                   "<div class='infoProfile2'>" +
                   "<p>" +
                   "<span class='emailInProfile'>Спеціальність</span>" +
                   "<br>" +
                   "<output class='emailInProfile' name='profileEmail'>" + data.users[i].branch_id +" " +(data.users[i].branch_title[0].toUpperCase()+data.users[i].branch_title.slice(1))+ "</output>" +
                   " </p>" +
                   " </div>" +

                   "</div>" +
                   "<div class='row'>" +
                   "<div class='col-md-4'></div>" +
                   "<div class='col-md-8'>" +
                   // "<a href='/settings'><button class='btn btn-block text-white text-center mt-3 mb-2 editProfileButton'>Редагувати профіль <i class='fa fa-pencil editProfileIcon' aria-hidden='true'></i></button></a>"+
                   "</div>" +
                   "</div>" +
                   "</div>" +
                   "<br>";
           }
           return res;


       }


       function showSubj(data) {
           let res = "";
           res += "<h4 class='display-4 text-center mt-5 mb-5'>Дисципліни з найбільшою кількістю відгуків</h4>";

           for (i = 0; i < data.subjects.length; i++) {
               res += "<div class='container-fluid rounded popularSubjBorder'>" +
                   " <div class='row'>" +
                   "<div class='col-sm-4 firstPart'>" +
                   "<span class='text-white subjectYearMain'><small></small></span>" +
                   "<br>" +
                   "<span class='text-white popSubjFaculty'><small></small></span>" +
                   "<br>" +
                   "<h6 class='text-white popSubjMain  mt-3'>" + (data.subjects[i].title[0].toUpperCase() + data.subjects[i].title.slice(1)) + "</h6>" +
                   "<br> <br>" +
                   "</div>" +
                   "<div class='col-sm-3 my-auto'>" +
                   "<h5 class='mt-3 average'>Середній рейтинг</h5>" +
                   "<span class='popSubjQuantityReviews'><small>" + data.subjects[i].reviews_amount + " відгуків</small></span>" +
                   "</div>" +
                   "<div class='col-sm-2 my-auto'>" +
                   "<div class='averageValue'>" + data.subjects[i].average_grade + "</div>" +
                   "</div>" +

                   "<div class='col-sm-3  my-auto'>" +
                   "<a href='/subj/" + data.subjects[i].id + "' class='btn text-white buttonAllRev'>Усі відгуки</a>" +
                   `<button onclick="window.location='/subj/${data.subjects[i].id}/createReview'" class='btn text-white buttonAllRev'>Залишити відгук</button>` +
                   "</div>" +

                   "</div>" +
                   "</div>" +
                   "<br>";
           }
           return res;
       }
});