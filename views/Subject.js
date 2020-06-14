function addTeacher(i){
    document.getElementById("addTeacher"+i).style.display = "block";
    document.getElementById("buttonAdd"+i).style.display = "none";
}
function cancelTeacher(i){
    document.getElementById("addTeacher"+i).style.display = "none";
    document.getElementById("buttonAdd"+i).style.display = "block";
}
function addTeacherEdit(i){
    document.getElementById("addTeacherEdit"+i).style.display = "block";
    document.getElementById("buttonAddTeacher"+i).style.display = "none";
}
function cancelAddTeacherEdit(i){
    document.getElementById("addTeacherEdit"+i).style.display = "none";
    document.getElementById("buttonAddTeacher"+i).style.display = "block";
}
function hideDeleteTeacher(id){
    document.getElementById("teacherEdit"+id).style.display = "none";
}
//дороити перевірку на ввід
function createNewSubject(l){
    var tchrs=[];
    for(i=0;i<l;i++){
        tchrs[i]=document.getElementsByName('chooseTeacher'+i)[0].value;
    }
    var createSubject = {
        title: document.getElementsByName('titleCreate')[0].value,
        course: document.getElementsByName('courseCreate')[0].value,
        faculty_id: document.getElementsByName('facultyCreate')[0].value,
        year: document.getElementsByName('yearCreate')[0].value,
        semester: document.getElementsByName("semesterCreate")[0].value,
        teachers: tchrs
    };
    //console.log(createSubject);

    $.ajax({
        url: '/subj/new/subject',
        type: 'POST',
        data: createSubject,
        success: function (data, textStatus, xhr) {
           console.log(data);
           if(data.message){
               alert(data.message);
           }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
        }
    });
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
               console.log(data);
               formatTeachers(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }


    function formatData(data) {

        let counter = 0;
        let teach="";
        let i = data.subjects.length;
        while (counter < i) {
            if (data.subjects[counter].faculty.length > 2 && data.subjects[counter].faculty[1] === 'п') {
                data.subjects[counter].faculty = data.subjects[counter].faculty.slice(0, 2).toUpperCase() +
                    data.subjects[counter].faculty[2] + data.subjects[counter].faculty[3].toUpperCase();
            } else {
                data.subjects[counter].faculty = data.subjects[counter].faculty.toUpperCase();
            }

            data.subjects[counter].semester = " "+data.subjects[counter].semester[0].toUpperCase() + data.subjects[counter].semester.slice(1);
            data.subjects[counter].title = data.subjects[counter].title[0].toUpperCase() + data.subjects[counter].title.slice(1);

            for(k=0;k<data.subjects[counter].teachers.length;k++){
                data.subjects[counter].teachers[k].last_name = data.subjects[counter].teachers[k].last_name[0].toUpperCase() + data.subjects[counter].teachers[k].last_name.slice(1);
                data.subjects[counter].teachers[k].first_name = data.subjects[counter].teachers[k].first_name[0].toUpperCase() + ".";
                data.subjects[counter].teachers[k].patronymic = data.subjects[counter].teachers[k].patronymic[0].toUpperCase() + ".";
            }

            counter++;
        }



        $('#subjectsFromServer').html(showSubjects(data));
    }

    let teachers0="";
    let teachers1="";
    let teachers2="";
    let teachers3="";
    let teachers4="";
    let teachers5="";

    function formatTeachers(data) {
        for(s=0; s<data.length;s++){
            data[s].first_name= data[s].first_name[0].toUpperCase()+ data[s].first_name.slice(1);
            data[s].last_name= data[s].last_name[0].toUpperCase()+ data[s].last_name.slice(1);
            data[s].patronymic= data[s].patronymic[0].toUpperCase()+ data[s].patronymic.slice(1);
        }

        let dataL = 0;

        teachers0+="<select name='chooseTeacher"+0+"' class='custom-select mb-2' required>";
        teachers1+="<select name='chooseTeacher"+1+"' class='custom-select mb-2' required>";
        teachers2+="<select name='chooseTeacher"+2+"' class='custom-select mb-2' required>";
        teachers3+="<select name='chooseTeacher"+3+"' class='custom-select mb-2' required>";
        teachers4+="<select name='chooseTeacher"+4+"' class='custom-select mb-2' required>";
        teachers5+="<select name='chooseTeacher"+5+"' class='custom-select mb-2' required>";
        while(dataL<data.length){
            teachers0+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachers1+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachers2+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachers3+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachers4+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachers5+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";

            dataL++;
        }
        teachers0+="</select>";
        teachers1+="</select>";
        teachers2+="</select>";
        teachers3+="</select>";
        teachers4+="</select>";
        teachers5+="</select>";

    }

    function showSubjects(data) {

        let counter = 0;
        let res = "";
        let reviews="";
        let editSubject="";
        let addSubject="";
        let editSubjectDiv="";
        let addSubjectDiv="";
        let tooltipTeachers="";
        // let isAdmin=true;
        var i=0;

        //let isAdmin=false;
        if (data.isAdmin === true){

            addSubject="<button data-toggle='collapse' data-target='#addSubject' class='btn btn-block text-white makeEpRev mb-3'>Додати дисципліну</button>";

            addSubjectDiv="<div id='addSubject' class='collapse' style='overflow: hidden'>" +
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
                "<option value='1'>БП-1</option>"+
                "<option value='2'>БП-2</option>"+
                "<option value='3'>БП-3</option>"+
                "<option value='4'>БП-4</option>"+
                "<option value='5'>МП-1</option>"+
                "<option value='6'>МП-2</option>"+
                "</select>"+
               // "<input type='number' name='courseCreate' class='form-control courseAdd' id='courseCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='facultyCreate'>Факультет</label>"+
                "<select id='facultyCreate' name='facultyCreate' class='custom-select facultyAdd'>"+
                "<option value='1'>ФІ</option>"+
                "<option value='2'>ФЕН</option>"+
                "<option value='3'>ФГН</option>"+
                "<option value='4'>ФПрН</option>"+
                "<option value='5'>ФПвН</option>"+
                "<option value='6'>ФСНСТ</option>"+
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
                "<option value='осінь'>Осінь</option>"+
                "<option value='весна'>Весна</option>"+
                "<option value='літо'>Літо</option>"+
                "</select>"+
                //"<input type='text' name='semesterCreate' class='form-control semesterAdd' id='semesterCreate'>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-2'></div>"+
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
                  teachers0+
                "<div class='text-center'>"+
                "<div id='buttonAdd1'>"+
                "<button onclick='cancelTeacher("+0+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+1+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='createNewSubject("+1+");' class='btn bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher1' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers1+
                "<div class='text-center'>"+
                "<div id='buttonAdd2'>"+
                "<button onclick='cancelTeacher("+1+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+2+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='createNewSubject("+2+")' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher2' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers2+
                "<div class='text-center'>"+
                "<div id='buttonAdd3'>"+
                "<button onclick='cancelTeacher("+2+")' class='btn bg-danger text-white mt-3 mb-2 mr-3'>Скасувати</button>"+
                "<button onclick='addTeacher("+3+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick=''createNewSubject("+3+") class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher3' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers3+
                "<div class='text-center'>"+
                "<div id='buttonAdd4'>"+
                "<button onclick='cancelTeacher("+3+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+4+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='createNewSubject("+4+")' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher4' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                teachers4+
                "<div class='text-center'>"+
                "<div id='buttonAdd5'>"+
                "<button onclick='cancelTeacher("+4+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacher("+5+")' class='btn makeEpRev text-white  mt-3 ml-4 mb-2'>Додати викладача</button>"+
                "<button onclick='createNewSubject("+5+")' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacher5' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                 teachers5+
                "<div class='text-center'>"+
                "<button onclick='cancelTeacher("+5+")' class='btn bg-danger text-white mt-3 mb-2 mr-5'>Скасувати</button>"+
                "<button onclick='createNewSubject("+6+")' class='btn  bg-dark text-white  mt-3 ml-4 mb-2'>Підтвердити</button>"+
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
            let quantityTeach="";
            let teacherAll="";

           if(data.subjects[counter].teachers.length>1){
                for(q=1;q<data.subjects[counter].teachers.length;q++){
                    tooltipTeachers+=data.subjects[counter].teachers[q].last_name+" "+data.subjects[counter].teachers[q].first_name+" "+data.subjects[counter].teachers[q].patronymic+", ";
                    }
                quantityTeach=" +"+(data.subjects[counter].teachers.length-1);

           }

           for(j=0; j<data.subjects[counter].teachers.length;j++){
                   teacherAll+="<div class='row' id='teacherEdit"+counter+j+"'>"+
                       "<div class='col-sm-8'>" +
                       "<input value='"+data.subjects[counter].teachers[j].last_name+" "+data.subjects[counter].teachers[j].first_name+" "+data.subjects[counter].teachers[j].patronymic+"' type='text' name='teacherEdit"+counter+j+"' class='form-control ml-5 mt-3'>"+
                       "</div>"+
                       "<div class='col-sm-4'>" +
                       "<a><button  onclick='hideDeleteTeacher("+counter+j+")' class='btn btn-lg rounded-circle mt-3 ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                       "</div>"+
                       "</div>";
           }




            editSubjectDiv = "<div id='editSubject" + data.subjects[counter].id + "' class='collapse' style='overflow: hidden'>" +
                "<div class='row'>" +
                "<div class='col-sm-6'>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5 mt-4' for='titleEdit'>Назва</label>" +
                "<input type='text' name='titleEdit' class='form-control ml-5 mt-4' id='titleEdit' value='" + data.subjects[counter].title + "'>" +
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='courseEdit'>Курс </label>" +
                "<select id='courseEdit'  name='courseEdit' class='custom-select courseEdit'>" +
                "<option selected>" + data.subjects[counter].course + "</option>" +
                "<option value='bp1'>БП-1</option>" +
                "<option value='bp2'>БП-2</option>" +
                "<option value='bp3'>БП-3</option>" +
                "<option value='bp4'>БП-4</option>" +
                "<option value='mp1'>МП-1</option>" +
                "<option value='mp2'>МП-2</option>" +
                "</select>" +
                // "<input type='number' name='courseCreate' class='form-control courseAdd' id='courseCreate'>"+
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='facultyEdit'>Факультет</label>" +
                "<select id='facultyEdit' name='facultyEdit' class='custom-select facultyEdit'>" +
                "<option selected>" + data.subjects[counter].faculty + "</option>" +
                "<option value='fi'>ФІ</option>" +
                "<option value='fen'>ФЕН</option>" +
                "<option value='fgn'>ФГН</option>" +
                "<option value='fprn'>ФПрН</option>" +
                "<option value='fpvn'>ФПвН</option>" +
                "<option value='fsnst'>ФСНСТ</option>" +
                "</select>" +
                //  "<input type='text' name='facultyCreate' class='form-control facultyAdd' id='facultyCreate'>"+
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-4' for='yearEdit'>Рік викладання</label>" +
                "<input value='" + data.subjects[counter].year + "' type='number' name='yearEdit' class='form-control ' id='yearEdit'>" +
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='semesterEdit'>Семестр</label>" +
                "<select id='semesterEdit'  name='semesterEdit' class='custom-select semesterEdit'>" +
                "<option selected>" + data.subjects[counter].semester + "</option>" +
                "<option value='spring'>Весна</option>" +
                "<option value='summer'>Літо</option>" +
                "<option value='autumn'>Осінь</option>" +
                "</select>" +
                //"<input type='text' name='semesterCreate' class='form-control semesterAdd' id='semesterCreate'>"+
                "</div>" +
                "</div>" +
                "<div class='col-sm-6'>" +
                teacherAll+

                "<div class='row'>"+
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-6'>" +
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+0+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+0+")' class='btn makeEpRev text-white  mt-3  mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+0+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                teachers0+
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+1+"'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+0+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+1+")' class='btn makeEpRev text-white mr-1 mt-3 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+1+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                 teachers1+
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+2+"'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+1+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+2+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+2+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                teachers2+
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+3+"'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+2+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+3+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+3+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                teachers3+
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+4+"'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+3+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+4+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+4+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                teachers4+
                "<div class='text-center'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+5+"'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+4+")' class='btn bg-danger text-white mt-3 mb-2 mr-1'>Скасувати</button>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+5+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+5+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-1'></div>"+
                "<div class='col-sm-10'>" +
                teachers5+
                "<div class='text-center'>"+
                "<button onclick='cancelAddTeacherEdit("+data.subjects[counter].id+5+")' class='btn bg-danger text-white mt-3 mb-2 mr-2'>Скасувати</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-1'></div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+


                "</div>"+
                "</div>" +
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-4'>" +
                "<button onclick='' class='btn btn-block bg-dark text-white  mt-3 mb-2'>Оновити</button>"+
                "</div>"+
                "<div class='col-sm-4'></div>"+
                "</div>"+
                "</div>";

            if (data.isAdmin === true) {
                res += "<div class='container-fluid rounded epFilters'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4 firstPart'>" +
                    "<span class='text-white subjectYearMain'><small>" + data.subjects[counter].year + data.subjects[counter].semester + "</small></span>" +
                    "<br>" +
                    "<span class='text-white epFiltersCourse'><small>"
                    + data.subjects[counter].faculty + "</small></span>"
                    + "<br>" + "<h6 class='text-white  mt-3' >"
                    + data.subjects[counter].title + "</h6>" + "<br> <br>" + "<span class='text-white subjectRevSNP'><small>"
                    +data.subjects[counter].teachers[0].last_name+" "+data.subjects[counter].teachers[0].first_name
                    + "</small><a href='#' class='text-white quantityTeach' data-toggle='tooltip' data-html='true' title='"+tooltipTeachers+"'>"+quantityTeach+"</a></span>"
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
                    "<button data-toggle='collapse' data-target='#editSubject" + data.subjects[counter].id + "' class='btn text-white makeEpRev'>Редагувати</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" + editSubjectDiv + "<br>";
            }else{
                res += "<div class='container-fluid rounded epFilters'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4 firstPart'>" +
                    "<span class='text-white subjectYearMain'><small>" + data.subjects[counter].year + data.subjects[counter].semester + "</small></span>" +
                    "<br>" +
                    "<span class='text-white epFiltersCourse'><small>"
                    + data.subjects[counter].faculty + "</small></span>"
                    + "<br>" + "<h6 class='text-white  mt-3' >"
                    + data.subjects[counter].title + "</h6>" + "<br> <br>" +
                    "<span class='text-white subjectRevSNP'><small>"+data.subjects[counter].teachers[0].last_name+" "+data.subjects[counter].teachers[0].first_name+" "
                    +data.subjects[counter].teachers[0].patronymic
               + "</small><a href='#' class='text-white quantityTeach' data-toggle='tooltip' data-html='true' title='"+tooltipTeachers+"'>"+quantityTeach+"</a></span>"
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
                    "</div>" +
                    "</div>" +
                    "</div>" +"<br>";
            }
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