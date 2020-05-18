
$(document).ready(function () {
    let today = new Date().getMonth();
    // alert(today);//4
    if (today < 8) {
        document.getElementById('year').value = new Date().getFullYear() - 1;
    } else {
        document.getElementById('year').value = new Date().getFullYear();
    }

    function getInfo() {
        var subj = {
            title: document.getElementsByName('title')[0].value,
            teacher: document.getElementsByName("teacher")[0].value,
            year: document.getElementsByName("year")[0].value,
            courses: Array.from(document.querySelectorAll('input.subjectCourse:checked')).map(cb => cb.value),
            semesters: Array.from(document.querySelectorAll('input.semestersSubject:checked')).map(cb => cb.value),
            faculties: Array.from(document.querySelectorAll('input.facultiesSubject:checked')).map(cb => cb.value)
        };

        $.ajax({
            url: '/subj/filter',
            type: 'GET',
            data: subj,

            success: function (data, textStatus, xhr) {
                formatData(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }

    $('#searchSButton').click(function () {
        var subject = {
            title: document.getElementsByName('title')[0].value,
            teacher: document.getElementsByName("teacher")[0].value,
            year: document.getElementsByName("year")[0].value,
            courses: Array.from(document.querySelectorAll('input.subjectCourse:checked')).map(cb => cb.value),
            semesters: Array.from(document.querySelectorAll('input.semestersSubject:checked')).map(cb => cb.value),
            faculties: Array.from(document.querySelectorAll('input.facultiesSubject:checked')).map(cb => cb.value)
        };

        $.ajax({
            url: '/subj/filter',
            type: 'GET',
            data: subject,

            success: function (data, textStatus, xhr) {

                console.log(data);

                formatData(data)

            },

            error: function (xhr, textStatus, errorThrown) {

                console.log('Error in Operation');
            }
        });
    });


    function formatData(data){
        let counter=0;
        let i=data.subjects.length;
        while(counter<i){
            if(data.subjects[counter].faculty.length>2 && data.subjects[counter].faculty[1]==='п'){
                data.subjects[counter].faculty=data.subjects[counter].faculty.slice(0,2).toUpperCase()+data.subjects[counter].faculty[2]+data.subjects[counter].faculty,slice(3);
            }else{
                data.subjects[counter].faculty=data.subjects[counter].faculty.toUpperCase();
            }
           // data.subjects[counter].course=data.subjects[counter].course;
            data.subjects[counter].title=data.subjects[counter].title[0].toUpperCase() + data.subjects[counter].title.slice(1);
            data.subjects[counter].last_name= data.subjects[counter].last_name[0].toUpperCase() + data.subjects[counter].last_name.slice(1);
            data.subjects[counter].first_name= data.subjects[counter].first_name[0].toUpperCase() + ".";
            data.subjects[counter].patronymic=data.subjects[counter].patronymic[0].toUpperCase() + ".";
            counter++;
        }

    $('#subjectsFromServer').html(showSubjects(data));
    }

    function showSubjects(data) {

        let counter = 0;
        let res = "";
        while (counter < data.subjects.length) {
            res += "<div class='container-fluid ' style='outline: 2px solid lightgray;  border: 0.1px solid #fff;'>" +
                "<div class='row'>" +
                "<div class='col-sm-4' style='background-color: #274B69'>" +
                "<span class='text-white' style='position: absolute;top: 8px;right: 16px;'><small>"
                + data.subjects[counter].faculty + "</small></span>"
                + "<br>" + "<h6 class='text-white  mt-3' >"
                + data.subjects[counter].title + "</h6>" + "<br> <br>" + "<span class='text-white' style=' position: absolute; bottom: 8px; left: 16px;'><small>"
                + data.subjects[counter].last_name + " " + data.subjects[counter].first_name + " " + data.subjects[counter].patronymic
                + "</small></span>" + "<span class='text-white' style='position: absolute;bottom: 8px;right: 16px;'><small>"
                + data.subjects[counter].course + "</small></span>" + "</div>" + "<div class='col-sm-3 my-auto'>" +
                "<h5 class='mt-3 '>Середній рейтинг</h5>" +
                "<span style='color: rgba(27,23,22,0.7)'><small>" + data.subjects[counter].reviews_amount + " відгуків</small></span>" +
                "</div>" + "<div class='col-sm-2 my-auto'>" + "<div>" +
                "<button data-toggle='modal' data-target='#details' type='button' class='btn btn-lg'>" + data.subjects[counter].average_grade + "<i class='fa fa-sort-desc' aria-hidden='true'></i>" +
                "</button>" + "</div>" + "</div>" +
                "<div class='col-sm-3  my-auto'>" +
                "<a href='/subj/subjects[i].id' class='btn text-white' style='background-color: #274B69;margin-bottom: 5px;'>Усі відгуки</a>" +
                "<button onclick='document.location=/user/RevSubject.html' class='btn text-white' style='background-color: #274B69;margin-bottom: 5px;'>Залишити відгук</button>" +
                "</div>" +
                "</div>" +
                "</div>" + "<br>";

            counter++;
        }
        return res;
    }


    /*
    function detalization(data){
       // alert(22222);
              let c = 0;
            let details = "";
            while (c < data.subjects.length) {

            details +=
                "<div class='modal-content'>" + "<div class='modal-header'>" +
                "<h4 class='modal-title'>Детальніше...</h4>" +
                "<button type='button' class='close' data-dismiss='modal'>&times;</button>"
                + " </div>" +

                "<div class='modal-body'>"
                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Для розуміння курсу не потрібні початкові знання </p>"
                + "</div>" +
                "<div class='col-sm-1'>"
                + "<output name='basicKnowledge' style='font-weight: bold;'>" + data.subjects[c].need_basic_knowledge + "</output>"
                + "</div>"
                + "</div>"

                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Критика зі сторони викладача була зрозумілою та обгрунтованою </p>"
                + "</div>"
                + "<div class='col-sm-1'>"
                + "<output name='criticism' style='font-weight: bold;'>" + data.subjects[c].teacher_criticism + "</output>"
                + "</div>"
                + "</div>"

                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Матеріали курсу були актуальними </p>"
                + "</div>"
                + "<div class='col-sm-1'>"
                + " <output name='modernMaterials' style='font-weight: bold;'>" + data.subjects[c].nowadays_knowledge + "</output>"
                + "</div>"
                + " </div>"

                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Практичні заняття відповідали теоретичним </p>"
                + "</div>"
                + "<div class='col-sm-1'>"
                + "<output name='practiceToTheory' style='font-weight: bold;'>" + data.subjects[c].theory_practice + "</output>"
                + "</div>"
                + "</div>"

                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Курс був нескладним </p>"
                + "</div>"
                + "<div class='col-sm-1'>"
                + "<output name='complexityCourse' style='font-weight: bold;'>" + data.subjects[c].course_complexity + "</output>"
                + "</div>"
                + "</div>"

                + "<div class='row'>"
                + "<div class='col-sm-11'>"
                + "<p>Знання були корисні для реального життя </p>"
                + "</div>"
                + "<div class='col-sm-1'>"
                + "<output name='valuableKnowl' style='font-weight: bold;'>" + data.subjects[c].using_knowledge + "</output>"
                + "</div>"
                + "</div>"

                + "</div>"

                + "<div class='modal-footer'>"
                + "<button type='button' class='btn btn-danger' data-dismiss='modal'>Закрити</button>"
                + "</div>"
                + "</div>"
            +"</div>";

            c++;
              }

            return details;
        }*/
});