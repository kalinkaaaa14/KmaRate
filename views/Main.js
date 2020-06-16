$(document).ready(function () {
   getInfo();

   function getInfo() {
       $.ajax({

           url: "/subj/most-popular",
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

   function getActiveUser(){
       $.ajax({

           url: " /subj/active-user",
           type: 'GET',
           success: function (data, textStatus, xhr) {
               console.log(data);
               //formatData(data);
           },
           error: function (xhr, textStatus, errorThrown) {

               console.log('Error in Operation');
           }
       });

   }

   function formatData(data){
       $('#topSubj').html(showSubj(data));
   }

   function showSubj(data){
       let res="";
       res+="<h4 class='display-4 text-center mt-5 mb-5'>Дисципліни з найбільшою кількістю відгуків</h4>";

       for(i=0; i< data.subjects.length;i++){
           res+=  "<div class='container-fluid rounded popularSubjBorder'>"+
              " <div class='row'>"+
               "<div class='col-sm-4 firstPart'>"+
               "<span class='text-white subjectYearMain'><small></small></span>"+
           "<br>"+
        "<span class='text-white popSubjFaculty'><small></small></span>"+
           "<br>"+
           "<h6 class='text-white popSubjMain  mt-3'>"+(data.subjects[i].title[0].toUpperCase()+data.subjects[i].title.slice(1))+"</h6>"+
           "<br> <br>"+
           "</div>"+
           "<div class='col-sm-3 my-auto'>"+
               "<h5 class='mt-3 average'>Середній рейтинг</h5>"+
           "<span class='popSubjQuantityReviews'><small>"+data.subjects[i].reviews_amount+" відгуків</small></span>"+
           "</div>"+
           "<div class='col-sm-2 my-auto'>"+
               "<div class='averageValue'>"+data.subjects[i].average_grade+"</div>"+
               "</div>"+

               "<div class='col-sm-3  my-auto'>"+
               "<a href='/subj/" + data.subjects[i].id + "' class='btn text-white buttonAllRev'>Усі відгуки</a>"+
           `<button onclick="window.location='/subj/${data.subjects[i].id}/createReview'" class='btn text-white buttonAllRev'>Залишити відгук</button>`+
           "</div>"+

           "</div>"+
           "</div>"+
           "<br>";
       }
       return res;
   }

});