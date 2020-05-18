$(document).ready(function () {

    $('#makeReviewSubject').click(getInfo);


    function getInfo() {
        var dataR={
            need_basic_knowledge: $("#form1").serializeArray()[0].value,
            edu_technique: $("#form2").serializeArray()[0].value,
            course_complexity: $("#form3").serializeArray()[0].value,
            nowadays_knowledge: $("#form4").serializeArray()[0].value,
            theory_practice: $("#form5").serializeArray()[0].value,
            teacher_criticism:$("#form6").serializeArray()[0].value,
            using_knowledge: $("#form7").serializeArray()[0].value,
            general_impression: $("#form8").serializeArray()[0].value
        };


//console.log(dataR);

        $.ajax({
            url:  'http://92.249.117.82:4321/subj/4/createReview',
            type: 'POST',
            data: dataR,
            success: function (data, textStatus, xhr) {
                console.log(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });


    }


});
