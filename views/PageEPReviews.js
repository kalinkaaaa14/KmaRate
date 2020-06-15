let getInfoFunction;

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
    getInfoFunction = getInfo;

    function getInfo() {
        let urlPartsArr = window.location.href.split('/');
        let ep_id = urlPartsArr[urlPartsArr.length - 1];
        document.getElementById('allReviews').innerHTML = '';


        $.ajax({
            url: "/ep/" + ep_id + "/data/exchange_program",
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

});

