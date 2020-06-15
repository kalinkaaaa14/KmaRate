$(document).ready(function () {

    $('#makeReviewEP').click(getInfo);

    console.log("i'm hereeeeeeeeeeeee");
    function getInfo() {
        console.log("i'm here");
        let urlPartsArr = window.location.href.split('/');
        let ep_id = urlPartsArr[urlPartsArr.length - 2];

        let date = new Date();
        if ($("#form1EP").serializeArray().length > 0 &&
            $("#successAdapt").serializeArray().length > 0 &&
            $("#diffEducation").serializeArray().length > 0 )
          {

            var dataR = {
                place_rating: $("#form1EP").serializeArray()[0].value,
                foreign_language: document.getElementsByName("engLevel")[0].value,
                avarage_bal_KMA: document.getElementsByName("balKMA")[0].value,
                adaptation: $("#successAdapt").serializeArray()[0].value,
                edu_difference: $("#diffEducation").serializeArray()[0].value,
                general_impression: $("#experienceHere").serializeArray()[0].value,
                ep_id,
                time_rev: date.getHours() + ':' + date.getMinutes(),
                date_rev: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
            };
//console.log(dataR);
            $.ajax({
                url: '/ep/' + ep_id + '/createReview',
                type: 'POST',
                data: dataR,
                success: function (data, textStatus, xhr) {
                    console.log(data);
                    alert(data.message);
                    window.location = data.redirect;
                },

                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });

        }else {
            alert("Заповніть всі поля, позначені *");
        }
    }


});