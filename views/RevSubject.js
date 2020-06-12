$(document).ready(function () {

    $('#makeReviewSubject').click(getInfo);


    function getInfo() {

        let urlPartsArr = window.location.href.split('/');
        let subject_id = urlPartsArr[urlPartsArr.length - 2];

        let date = new Date();
        if ($("#form1").serializeArray().length > 0 &&
            $("#form2").serializeArray().length > 0 &&
            $("#form3").serializeArray().length > 0 &&
            $("#form4").serializeArray().length > 0 &&
            $("#form5").serializeArray().length > 0 &&
            $("#form6").serializeArray().length > 0 &&
            $("#form7").serializeArray().length > 0 &&
            $("#form8").serializeArray().length > 0) {

            var dataR = {
                need_basic_knowledge: $("#form1").serializeArray()[0].value,
                edu_technique: $("#form2").serializeArray()[0].value,
                course_complexity: $("#form3").serializeArray()[0].value,
                nowadays_knowledge: $("#form4").serializeArray()[0].value,
                theory_practice: $("#form5").serializeArray()[0].value,
                teacher_criticism: $("#form6").serializeArray()[0].value,
                using_knowledge: $("#form7").serializeArray()[0].value,
                general_impression: $("#form8").serializeArray()[0].value,
                subject_id,
                time_rev: date.getHours() + ':' + date.getMinutes(),
                date_rev: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()

            };
//console.log(dataR);
            $.ajax({
                url: '/subj/' + subject_id + '/createReview',
                type: 'POST',
                data: dataR,
                success: function (data, textStatus, xhr) {
                    alert(data.message)
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