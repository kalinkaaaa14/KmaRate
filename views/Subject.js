function addTeacher(i){
    document.getElementById("addTeacher"+i).style.display = "block";
    document.getElementById("buttonAdd"+i).style.display = "none";
}
function cancelTeacher(i){
    document.getElementById("addTeacher"+i).style.display = "none";
    document.getElementById("buttonAdd"+i).style.display = "block";
}

$(document).ready(function () {
    let today = new Date().getMonth();
    // alert(today);//4
    if (today < 8) {
        document.getElementById('year').value = new Date().getFullYear() - 1;
    } else {
        document.getElementById('year').value = new Date().getFullYear();
    }

    getInfo();
    allTeachers();

    $('#searchSButton').click(getInfo);

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
                console.log(data);
                formatData(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }

    function allTeachers() {

        $.ajax({
            url: '/subj/teachers',
            type: 'GET',
            success: function (data, textStatus, xhr) {
         //       console.log(data);
               formatTeachers(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }
    let teachers="";
    function formatTeachers(data) {
        for(s=0; s<data.length;s++){
            data[s].first_name= data[s].first_name[0].toUpperCase()+ data[s].first_name.slice(1);
            data[s].last_name= data[s].last_name[0].toUpperCase()+ data[s].last_name.slice(1);
            data[s].patronymic= data[s].patronymic[0].toUpperCase()+ data[s].patronymic.slice(1);
        }

        let dataL = 0;

        teachers+="<select name='chooseTeacher' id='chooseTeacher' class='custom-select' required>";
        while(dataL<data.length){
            teachers+=  "<option>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            dataL++;
        }
        teachers+="</select>";
    }

    function formatData(data) {

        let counter = 0;
        let teach="";
        let i = data.subjects.length;
        while (counter < i) {
            if (data.subjects[counter].faculty.length > 2 && data.subjects[counter].faculty[1] === 'п') {
                data.subjects[counter].faculty = data.subjects[counter].faculty.slice(0, 2).toUpperCase() +
                    data.subjects[counter].faculty[2] + data.subjects[counter].faculty, slice(3);
            } else {
                data.subjects[counter].faculty = data.subjects[counter].faculty.toUpperCase();
            }


            data.subjects[counter].semester = " "+data.subjects[counter].semester[0].toUpperCase() + data.subjects[counter].semester.slice(1);
            data.subjects[counter].title = data.subjects[counter].title[0].toUpperCase() + data.subjects[counter].title.slice(1);
            data.subjects[counter].last_name = data.subjects[counter].last_name[0].toUpperCase() + data.subjects[counter].last_name.slice(1);
            data.subjects[counter].first_name = data.subjects[counter].first_name[0].toUpperCase() + ".";
            data.subjects[counter].patronymic = data.subjects[counter].patronymic[0].toUpperCase() + ".";
            counter++;
        }

        $('#subjectsFromServer').html(showSubjects(data));
    }

    function showSubjects(data) {

        let counter = 0;
        let res = "";
        let reviews="";
        let editSubject="";
        let addSubject="";
        let editSubjectDiv="";
        let addSubjectDiv="";
        let isAdmin=true;
        var i=0;

        //let isAdmin=false;
        if (isAdmin == true){
            editSubject="<button data-toggle='collapse' data-target='#editSubject' class='btn text-white makeEpRev'>Редагувати</button>";
            addSubject="<button data-toggle='collapse' data-target='#addSubject' class='btn btn-block text-white makeEpRev mb-3'>Додати дисципліну</button>";
            addSubjectDiv="<div id='addSubject' class='collapse'>" +
                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='titleCreate'>Назва</label>"+
                "<input type='text' name='titleCreate' class='form-control ml-5' id='titleCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='courseCreate'>Курс </label>"+
                "<select id='courseCreate'  name='courseCreate' class='custom-select courseAdd'>"+
                "<option value='bp1'>БП-1</option>"+
                "<option value='bp2'>БП-2</option>"+
                "<option value='bp3'>БП-3</option>"+
                "<option value='bp4'>БП-4</option>"+
                "<option value='mp1'>МП-1</option>"+
                "<option value='mp2'>МП-2</option>"+
                "</select>"+
               // "<input type='number' name='courseCreate' class='form-control courseAdd' id='courseCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='facultyCreate'>Факультет</label>"+
                "<select id='facultyCreate' name='facultyCreate' class='custom-select facultyAdd'>"+
                "<option value='fi'>ФІ</option>"+
                "<option value='fen'>ФЕН</option>"+
                "<option value='fgn'>ФГН</option>"+
                "<option value='fprn'>ФПрН</option>"+
                "<option value='fpvn'>ФПвН</option>"+
                "<option value='fsnst'>ФСНСТ</option>"+
                "</select>"+
              //  "<input type='text' name='facultyCreate' class='form-control facultyAdd' id='facultyCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-4' for='yearCreate'>Рік викладання</label>"+
                "<input type='number' name='yearCreate' class='form-control ' id='yearCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='semesterCreate'>Семестр</label>"+
                "<select id='semesterCreate'  name='semesterCreate' class='custom-select semesterAdd'>"+
                "<option value='autumn'>Осінь</option>"+
                "<option value='spring'>Весна</option>"+
                "<option value='summer'>Літо</option>"+
                "</select>"+
                //"<input type='text' name='semesterCreate' class='form-control semesterAdd' id='semesterCreate'>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                "<div class='text-center'>"+
                "<div id='buttonAdd0'>"+
                "<button onclick='addTeacher("+0+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher0' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                  teachers+
                "<div class='text-center'>"+
                "<div id='buttonAdd1'>"+
                "<button onclick='cancelTeacher("+0+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+1+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='' class='btn bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher1' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers+
                "<div class='text-center'>"+
                "<div id='buttonAdd2'>"+
                "<button onclick='cancelTeacher("+1+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+2+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher2' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers+
                "<div class='text-center'>"+
                "<div id='buttonAdd3'>"+
                "<button onclick='cancelTeacher("+2+")' class='btn bg-danger text-white mt-3 mb-2 mr-3'>Скасувати</button>"+
                "<button onclick='addTeacher("+3+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher3' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers+
                "<div class='text-center'>"+
                "<div id='buttonAdd4'>"+
                "<button onclick='cancelTeacher("+3+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+4+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher4' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers+
                "<div class='text-center'>"+
                "<div id='buttonAdd5'>"+
                "<button onclick='cancelTeacher("+4+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+5+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher5' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                 teachers+
                "<div class='text-center'>"+
                "<button onclick='cancelTeacher("+5+")' class='btn bg-danger text-white mt-3 mb-2 mr-5'>Скасувати</button>"+
                "<button onclick='' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>";
        }

        res+=addSubject;
        res+=addSubjectDiv;
        while (counter < data.subjects.length) {
            /*
            if(data.subjects[counter].reviews_amount == 1){
                reviews=" відгук";
            }else if(data.subjects[counter].reviews_amount ===2 || data.subjects[counter].reviews_amount === 3 || data.subjects[counter].reviews_amount===4){
                reviews=" відгуки";
            }else{
                reviews=" відгуків";
            }*/
            // editSubjectDiv="<div id='editSubject' class='collapse'>" +
            //     "<div class='row'>" +
            //     "<div class='col-sm-7'>" +
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='titleEdit'>Назва</label>"+
            //     "<input type='text' name='titleEdit' class='form-control' id='titleEdit' value='"+data.subjects[counter].title+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='surnameEdit'>Прізвище викладача</label>"+
            //     "<input type='text' name='surnameEdit' class='form-control' id='surnameEdit' value='"+data.subjects[counter].last_name+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='nameEdit'>Ім'я викладача</label>"+
            //     "<input type='text' name='nameEdit' class='form-control' id='nameEdit' value='"+data.subjects[counter].first_name+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='patronymicEdit'>По-батькові викладача</label>"+
            //     "<input type='text' name='patronymicEdit' class='form-control' id='patronymicEdit' value='"+data.subjects[counter].patronymic+"'>"+
            //     "</div>"+
            //     "</div>"+
            //     "<div class='col-sm-2'></div>"+
            //     "<div class='col-sm-3'>" +
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='courseEdit'>Курс</label>"+
            //     "<input type='number' name='courseEdit' class='form-control' id='courseEdit' value='"+data.subjects[counter].course+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='facultyEdit'>Факультет</label>"+
            //     "<input type='text' name='facultyEdit' class='form-control' id='facultyEdit' value='"+data.subjects[counter].faculty+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='yearEdit'>Рік викладання</label>"+
            //     "<input type='number' name='yearEdit' class='form-control' id='yearEdit' value='"+data.subjects[counter].year+"'>"+
            //     "</div>"+
            //     "<div class='form-inline'>"+
            //     "<label class='ml-5 mr-5' for='semesterEdit'>Семестр</label>"+
            //     "<input type='text' name='semesterEdit' class='form-control' id='semesterEdit' value='"+data.subjects[counter].semester+"'>"+
            //     "</div>"+
            //     "</div>"+
            //     "</div>"+
            //     "</div>";


            res += "<div class='container-fluid rounded epFilters'>" +
                "<div class='row'>" +
                "<div class='col-sm-4 firstPart'>" +
                "<span class='text-white subjectYearMain'><small>"+data.subjects[counter].year+ data.subjects[counter].semester+"</small></span>"+
                "<br>"+
                "<span class='text-white epFiltersCourse'><small>"
                + data.subjects[counter].faculty + "</small></span>"
                + "<br>" + "<h6 class='text-white  mt-3' >"
                + data.subjects[counter].title + "</h6>" + "<br> <br>" + "<span class='text-white subjectRevSNP'><small>"
                + data.subjects[counter].last_name + " " + data.subjects[counter].first_name + " " + data.subjects[counter].patronymic
                + "</small></span>"
                + "<span class='text-white subjectRevCourse'><small>"
                + data.subjects[counter].course + " курс</small></span>"
                + "</div>"
                + "<div class='col-sm-3 my-auto'>" +
                "<h5 class='mt-3 '>Середній рейтинг</h5>" +
                "<span class='quantityEPreview'><small>" + data.subjects[counter].reviews_amount + " відгук(-ів)</small></span>" +
                "</div>" + "<div class='col-sm-2 my-auto'>" + "<div>" +
                "<button data-toggle='modal' data-target='#details' type='button' class='btn btn-lg'>" + data.subjects[counter].average_grade +
                "</button>" + "</div>" + "</div>" +
                "<div class='col-sm-3  my-auto'>" +
                "<a href='/subj/" + data.subjects[counter].id + "' class='btn text-white showAllEPReviews'>Усі відгуки</a>" +
                `<button onclick="window.location='/subj/${data.subjects[counter].id}/createReview'" class='btn text-white makeEpRev'>Залишити відгук</button>` +
                editSubject+
                "</div>" +
                "</div>" +
                "</div>" +editSubjectDiv+ "<br>";

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