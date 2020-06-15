let arrT=[];
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
function cancelAddTeacherEdit(counter,i){
    document.getElementById("addTeacherEdit"+counter+i).style.display = "none";
    document.getElementById("buttonAddTeacher"+counter+i).style.display = "block";
}

function hideDeleteTeacher(counter,id){
    document.getElementById("teacherEdit"+counter+id).style.display = "none";
}
//дороити перевірку на ввід
function createNewTeacher() {
    let identical = false;
    var newTeacher = {
        first_name: document.getElementsByName('nameNew')[0].value,
        last_name: document.getElementsByName('surnameNew')[0].value,
        patronymic: document.getElementsByName('patronNew')[0].value
    }
    //console.log(newTeacher);
    for (m = 0; m < arrT.length; m++) {
        if (arrT[m].last_name.toString().toLowerCase() === newTeacher.last_name.toString().toLowerCase() &&
            arrT[m].first_name.toString().toLowerCase() === newTeacher.first_name.toString().toLowerCase() &&
            arrT[m].patronymic.toString().toLowerCase() === newTeacher.patronymic.toString().toLowerCase()) {
            identical = true;
            break;
        }
    }
    let regexp = /[^a-zа-я'"`єїі ]/i;

    if (regexp.test(newTeacher.last_name) ||
        regexp.test(newTeacher.first_name) ||
        regexp.test(newTeacher.patronymic)){
        alert("Некоректний символ при вводі.");
    } else if (newTeacher.name === "" ||
        newTeacher.surname === "" ||
        newTeacher.patronymic === "") {
        alert("Заповніть всі поля, позначені *");
    } else if (identical) {
        alert("Викладач з таким прізвищем, ім'ям та по-батькові вже існує.");
    } else {
         $.ajax({
             url: '/subj/new/teacher',
             type: 'POST',
             data: newTeacher,
             success: function (data, textStatus, xhr) {

                 if (data.message) {
                     alert(data.message);
                 }
                 },
             error: function (xhr, textStatus, errorThrown) {
                 console.log('Error in Operation');
             }
         });
    }
}

function createNewSubject(l) {
    var now = new Date();
    let diff=true;
    var tchrs = [];
    for (i = 0; i < l; i++) {
        tchrs[i] = document.getElementsByName('chooseTeacher' + i)[0].value;
    }
    var createSubject = {
        title: document.getElementsByName('titleCreate')[0].value,
        course: document.getElementsByName('courseCreate')[0].value,
        faculty_id: document.getElementsByName('facultyCreate')[0].value,
        year: document.getElementsByName('yearCreate')[0].value,
        semester: document.getElementsByName("semesterCreate")[0].value,
        teachers: tchrs
    };

    for (m = 0; m < createSubject.teachers.length - 1; m++) {
        for (n = m + 1; n < createSubject.teachers.length; n++) {
            if (createSubject.teachers[m] === createSubject.teachers[n]) {
               diff=false;
            }
        }
    }
    //console.log(createSubject);
    if (createSubject.title === "" ||
        createSubject.year === "" ||
        createSubject.course === "" ||
        createSubject.faculty_id === "" ||
        createSubject.semester === "") {
        alert("Заповніть всі місця,позначені *");
    } else if (createSubject.teachers[0] === "") {
        alert('Введіть хоча б 1 викладача');
    } else if (createSubject.year > now.getFullYear() - 1) {
        alert("Дисципліна ще не відбулася, користувачі не можуть залишати на неї відгук!");
    } else if(!diff){
        alert("Оберіть різних викладачів");
    } else{
            $.ajax({
                url: '/subj/new/subject',
                type: 'POST',
                data: createSubject,
                success: function (data, textStatus, xhr) {
                    console.log(data);
                    if (data.message) {
                        alert(data.message);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });
        }
}

function editSubject(id,counter, l){
    var now = new Date();

    var tchrs=[];
    let count=0;
    for(i=0;i<l;i++) {
    if (document.getElementById("teacherEdit" + counter + i).style.display !== "none") {
        tchrs[count] = document.getElementsByName("teacherEdit" + counter + i)[0].value;
        count++;
    }
}
for(i=0;i<6;i++){
   if(document.getElementById("addTeacherEdit"+id+i).style.display !== "none"){
       tchrs.push(document.getElementsByName("editTeacher" + counter + i)[0].value);
   }
}
       var editS={
       id: id,
        title: document.getElementsByName('titleEdit'+counter)[0].value,
        course: document.getElementsByName('courseEdit'+counter)[0].value,
        faculty_id: document.getElementsByName('facultyEdit'+counter)[0].value,
        year: document.getElementsByName('yearEdit'+counter)[0].value,
        semester: document.getElementsByName('semesterEdit'+counter)[0].value,
        teachers: tchrs
    }

for(m=0; m<editS.teachers.length-1;m++){
    for(n=m+1; n<editS.teachers.length;n++){
        if(editS.teachers[m]===editS.teachers[n]){
            return alert("Оберіть різних викладачів");
        }
    }
}
   // console.log(editS);
    if(editS.title === "" ||
        editS.year ===""||
        editS.course=== "" ||
        editS.faculty_id === "" ||
        editS.semester === "" ) {
        alert("Заповніть всі місця,позначені *");
    }else if(editS.teachers.length===0){
        alert("Дисципліна повинна мати хоча б 1 викладача.");
    }else if(editS.year> now.getFullYear()-1){
        alert("Дисципліна ще не відбулася, користувачі не можуть залишати на неї відгук!");
    }else {
        $.ajax({
            url: '/subj/edit/subject',
            type: 'POST',
            data: editS,
            success: function (data, textStatus, xhr) {
                  console.log(data);
                if (data.message) {
                   alert(data.message);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }

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
        var now = new Date();
        var subj = {
            title: document.getElementsByName('title')[0].value,
            teacher: document.getElementsByName("teacher")[0].value,
            year: document.getElementsByName("year")[0].value,
            courses: Array.from(document.querySelectorAll('input.subjectCourse:checked')).map(cb => cb.value),
            semesters: Array.from(document.querySelectorAll('input.semestersSubject:checked')).map(cb => cb.value),
            faculties: Array.from(document.querySelectorAll('input.facultiesSubject:checked')).map(cb => cb.value)
        };

        if(subj.year>now.getFullYear()-1){
            alert("Рік викладання у пошуку не має перевищувати рік поточного навчального року, а саме його початок.");
        } else if(subj.year.toString().includes(',') || subj.year.toString().includes('.')){
            alert("Введіть, будь ласка, рік цілим числом.");
        }else if(subj.year <2010 && subj.year >= 1615){
            alert("Рік викладання дисципліни занадто малий. Введіть будь ласка рік, більший за 2010.");
        }else if(subj.year <1615) {
            alert("Некоректні дані для вводу");
        }else{
            $.ajax({
                url: '/subj/filter',
                type: 'GET',
                data: subj,
                success: function (data, textStatus, xhr) {
                 //   console.log(data);
                    formatData(data);
                },

                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });
        }
    }

    function allTeachers() {

        $.ajax({
            url: '/subj/teachers',
            type: 'GET',
            success: function (data, textStatus, xhr) {
              // console.log(data);
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
                data.subjects[counter].teachers[k].first_name = data.subjects[counter].teachers[k].first_name[0].toUpperCase() + data.subjects[counter].teachers[k].first_name.slice(1);
                data.subjects[counter].teachers[k].patronymic = data.subjects[counter].teachers[k].patronymic[0].toUpperCase() + data.subjects[counter].teachers[k].patronymic.slice(1);
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

    let teachersEdit0="";
    let teachersEdit1="";
    let teachersEdit2="";
    let teachersEdit3="";
    let teachersEdit4="";
    let teachersEdit5="";


    function formatTeachers(data) {
        for(s=0; s<data.length;s++){
            data[s].first_name= data[s].first_name[0].toUpperCase()+ data[s].first_name.slice(1);
            data[s].last_name= data[s].last_name[0].toUpperCase()+ data[s].last_name.slice(1);
            data[s].patronymic= data[s].patronymic[0].toUpperCase()+ data[s].patronymic.slice(1);
        }

        let dataL = 0;

        teachers0+="<select name='chooseTeacher"+0+"' class='custom-select mb-2' required>";
        teachers0+=  "<option selected value=''></option>";
        teachers1+="<select name='chooseTeacher"+1+"' class='custom-select mb-2' required>";
        teachers2+="<select name='chooseTeacher"+2+"' class='custom-select mb-2' required>";
        teachers3+="<select name='chooseTeacher"+3+"' class='custom-select mb-2' required>";
        teachers4+="<select name='chooseTeacher"+4+"' class='custom-select mb-2' required>";
        teachers5+="<select name='chooseTeacher"+5+"' class='custom-select mb-2' required>";

        while(dataL<data.length){

            teachersEdit0+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+ " "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachersEdit1+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachersEdit2+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachersEdit3+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachersEdit4+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
            teachersEdit5+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+" "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";

            teachers0+=  "<option value='"+data[dataL].email+"'>"+data[dataL].last_name+ " "+data[dataL].first_name+" "+ data[dataL].patronymic+"</option>";
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

        arrT=data;
    }

    function allTeachersBesides(data,i) {
        let allOptions="";
        for(k=0; k<data.length;k++) {
            if (k === i) {
                allOptions += "<option selected value='" + data[k].email + "'>" + data[k].last_name + " " + data[k].first_name + " " + data[k].patronymic + "</option>";
            } else {
                allOptions += "<option value='" + data[k].email + "'>" + data[k].last_name + " " + data[k].first_name + " " + data[k].patronymic + "</option>";
            }
        }
        let indexes =[];
        let counter=0;
        for(q=0;q<arrT.length; q++){
            for(w=0;w<data.length;w++){
                if(arrT[q].email ===data[w].email){
                   indexes[counter]=q;
                   counter++;
                   break;
                }
            }
        }

        for(d=0;d<arrT.length;d++){
            let notHere=true;
            for(f=0; f<indexes.length;f++){
                if(d === indexes[f]){
                    notHere=false;
                }
            }
            if(notHere) {
                allOptions += "<option value='" + arrT[d].email + "'>" + arrT[d].last_name + " " + arrT[d].first_name + " " + arrT[d].patronymic + "</option>";
            }
        }
        return allOptions;
    }

    function showSubjects(data) {

        let counter = 0;
        let res = "";
        let reviews="";
        let editSubject="";
        let addSubject="";
        let addTeacher="";
        let editSubjectDiv="";
        let addSubjectDiv="";
        let addTeacherDiv="";
        let tooltipTeachers="";
        // let isAdmin=true;
        var i=0;

        //let isAdmin=false;
        if (data.isAdmin === true){

            addSubject="<button data-toggle='collapse' data-target='#addSubject' class='btn btn-block text-white makeEpRev mb-3'>Додати дисципліну</button>";
            addTeacher="<button data-toggle='collapse' data-target='#addNewTeacher' class='btn btn-block text-white makeEpRev mb-3'>Додати викладача</button>";

            addTeacherDiv="<div id='addNewTeacher' class='collapse' style='overflow: hidden'>"+
                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='surnameNew'>Прізвище *</label>"+
                "<input type='text'  name='surnameNew' class='form-control ml-5' id='surnameNew'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='nameNew'>Ім'я *</label>"+
                "<input type='text' name='nameNew' class='form-control nameNew' id='nameNew' >"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='patronNew'>По-батькові *</label>"+
                "<input type='text' name='patronNew' class='form-control patronymicNew' id='patronNew'>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-4'>" +
                "<button onclick='createNewTeacher()' class='btn btn-block bg-dark text-white  mt-3 mb-4'>Підтвердити</button>"+
                "</div>"+
                "</div>"
            +"</div>";

            addSubjectDiv="<div id='addSubject' class='collapse' style='overflow: hidden'>" +
                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='titleCreate'>Назва *</label>"+
                "<input type='text' name='titleCreate' class='form-control ml-5' id='titleCreate' required>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='courseCreate'>Курс *</label>"+
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
                "<label class='ml-5 mr-5' for='facultyCreate'>Факультет *</label>"+
                "<select id='facultyCreate' name='facultyCreate' class='custom-select facultyAdd'>"+
                "<option value='1'>ФІ</option>"+
                "<option value='2'>ФЕН</option>"+
                "<option value='3'>ФГН</option>"+
                "<option value='4'>ФПвН</option>"+
                "<option value='5'>ФПрН</option>"+
                "<option value='6'>ФСНСТ</option>"+
                "</select>"+
              //  "<input type='text' name='facultyCreate' class='form-control facultyAdd' id='facultyCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-4' for='yearCreate'>Рік викладання *</label>"+
                "<input type='number'  name='yearCreate' class='form-control ' id='yearCreate'>"+
                "</div>"+
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='semesterCreate'>Семестр *</label>"+
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
        res+=addTeacher;
        res+=addTeacherDiv;
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

           //  console.log(arrT);




           for(j=0; j<data.subjects[counter].teachers.length;j++){
                   teacherAll+="<div class='row'  id='teacherEdit"+counter+j+"'>"+
                       "<div class='col-sm-8'>" +
                       "<select name='teacherEdit"+counter+j+"' class='custom-select facultyEdit mt-4'>"+
                     allTeachersBesides(data.subjects[counter].teachers,j)+
                       "</select>"+
                       "</div>"+
                       "<div class='col-sm-4'>" +
                       "<a><button  onclick='hideDeleteTeacher("+counter+","+j+")' class='btn btn-lg rounded-circle mt-3 ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                       "</div>"+
                       "</div>";
           }

           let facultyOptions= "<select id='facultyEdit' name='facultyEdit"+counter+"' class='custom-select facultyEdit'>";
           let courseOptions= "<select id='courseEdit'  name='courseEdit"+counter+"' class='custom-select courseEdit'>";
           let semesterOptions= "<select id='semesterEdit'  name='semesterEdit"+counter+"' class='custom-select semesterEdit'>";
       switch(data.subjects[counter].semester){
           case " Осінь":
              semesterOptions+= "<option value='весна'>Весна</option>" +
               "<option value='літо'>Літо</option>" +
               "<option selected value='осінь'>Осінь</option>";
              break;
           case " Весна":
               semesterOptions+= "<option selected value='весна'>Весна</option>" +
                   "<option value='літо'>Літо</option>" +
                   "<option value='осінь'>Осінь</option>";
               break;
           case " Літо":
               semesterOptions+= "<option value='весна'>Весна</option>" +
                   "<option selected value='літо'>Літо</option>" +
                   "<option value='осінь'>Осінь</option>";
               break;
       }
       semesterOptions+="</select>";

            switch (data.subjects[counter].course) {
                case 1:
                  courseOptions+=  "<option selected value='1'>БП-1</option>" +
                    "<option value='2'>БП-2</option>" +
                    "<option value='3'>БП-3</option>" +
                    "<option value='4'>БП-4</option>" +
                    "<option value='5'>МП-1</option>" +
                    "<option value='6'>МП-2</option>";
                  break;
                  case 2:
                      courseOptions+=  "<option  value='1'>БП-1</option>" +
                          "<option selected value='2'>БП-2</option>" +
                          "<option value='3'>БП-3</option>" +
                          "<option value='4'>БП-4</option>" +
                          "<option value='5'>МП-1</option>" +
                          "<option value='6'>МП-2</option>";
                      break;
                    case 3:
                        courseOptions+=  "<option  value='1'>БП-1</option>" +
                            "<option value='2'>БП-2</option>" +
                            "<option selected value='3'>БП-3</option>" +
                            "<option value='4'>БП-4</option>" +
                            "<option value='5'>МП-1</option>" +
                            "<option value='6'>МП-2</option>";
                        break;
                case 4:
                    courseOptions+=  "<option  value='1'>БП-1</option>" +
                        "<option value='2'>БП-2</option>" +
                        "<option value='3'>БП-3</option>" +
                        "<option selected value='4'>БП-4</option>" +
                        "<option value='5'>МП-1</option>" +
                        "<option value='6'>МП-2</option>";
                    break;
                case 5:
                    courseOptions+=  "<option  value='1'>БП-1</option>" +
                        "<option value='2'>БП-2</option>" +
                        "<option  value='3'>БП-3</option>" +
                        "<option value='4'>БП-4</option>" +
                        "<option selected value='5'>МП-1</option>" +
                        "<option value='6'>МП-2</option>";
                    break;
                case 6:
                    courseOptions+=  "<option  value='1'>БП-1</option>" +
                        "<option value='2'>БП-2</option>" +
                        "<option  value='3'>БП-3</option>" +
                        "<option value='4'>БП-4</option>" +
                        "<option selected value='5'>МП-1</option>" +
                        "<option value='6'>МП-2</option>";
                    break;
            }
            courseOptions+="</select>";
           switch (data.subjects[counter].faculty) {
               case "ФІ":
                   facultyOptions +="<option selected value='1'>ФІ</option>"+
                       "<option value='2'>ФЕН</option>"+
                       "<option value='3'>ФГН</option>"+
                       "<option value='4'>ФПвН</option>"+
                       "<option value='5'>ФПрН</option>"+
                       "<option value='6'>ФСНСТ</option>";
                   break;
               case "ФЕН":
                   facultyOptions +="<option value='1'>ФІ</option>"+
                       "<option selected value='2'>ФЕН</option>"+
                       "<option value='3'>ФГН</option>"+
                       "<option value='4'>ФПвН</option>"+
                       "<option value='5'>ФПрН</option>"+
                       "<option value='6'>ФСНСТ</option>";
                   break;
               case "ФГН":
                   facultyOptions +="<option value='1'>ФІ</option>"+
                       "<option value='2'>ФЕН</option>"+
                       "<option selected value='3'>ФГН</option>"+
                       "<option value='4'>ФПвН</option>"+
                       "<option value='5'>ФПрН</option>"+
                       "<option value='6'>ФСНСТ</option>";
                   break;
               case "ФПвН":
                   facultyOptions +="<option value='1'>ФІ</option>"+
                       "<option value='2'>ФЕН</option>"+
                       "<option value='3'>ФГН</option>"+
                       "<option selected value='4'>ФПвН</option>"+
                       "<option value='5'>ФПрН</option>"+
                       "<option value='6'>ФСНСТ</option>";
                   break;
               case "ФПрН":
                   facultyOptions +="<option value='1'>ФІ</option>"+
                       "<option value='2'>ФЕН</option>"+
                       "<option value='3'>ФГН</option>"+
                       "<option value='4'>ФПвН</option>"+
                       "<option  selected  value='5'>ФПрН</option>"+
                       "<option value='6'>ФСНСТ</option>";
                   break;
               case "ФСНСТ":
                   facultyOptions +="<option value='1'>ФІ</option>"+
                       "<option value='2'>ФЕН</option>"+
                       "<option value='3'>ФГН</option>"+
                       "<option value='4'>ФПвН</option>"+
                       "<option value='5'>ФПрН</option>"+
                       "<option  selected value='6'>ФСНСТ</option>";
                   break;
           }
           facultyOptions+="</select>";

            editSubjectDiv = "<div id='editSubject" + data.subjects[counter].id + "' class='collapse' style='overflow: hidden'>" +
                "<div class='row'>" +
                "<div class='col-sm-6'>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5 mt-4' for='titleEdit"+counter+"'>Назва *</label>" +
                "<input type='text' name='titleEdit"+counter+"' class='form-control ml-5 mt-4' id='titleEdit' value='" + data.subjects[counter].title + "'>" +
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='courseEdit'>Курс *</label>" +
             courseOptions+
                // "<input type='number' name='courseCreate' class='form-control courseAdd' id='courseCreate'>"+
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='facultyEdit'>Факультет *</label>" +
                 facultyOptions+
                //  "<input type='text' name='facultyCreate' class='form-control facultyAdd' id='facultyCreate'>"+
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-4' for='yearEdit'>Рік викладання *</label>" +
                "<input value='" + data.subjects[counter].year + "' type='number' name='yearEdit"+counter+"' class='form-control ' id='yearEdit'>" +
                "</div>" +
                "<div class='form-inline mb-2'>" +
                "<label class='ml-5 mr-5' for='semesterEdit'>Семестр *</label>" +
                semesterOptions+
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
                "<div class='col-sm-8 '>" +
                "<select id='editTeacher"+counter+0+"' name='editTeacher"+counter+0+"' class='custom-select facultyEdit mt-2' required>"+
                teachersEdit0+
                "</select>"+
                "</div>"+
                "<div class='col-sm-4'>" +
                "<a><button  onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+0+")' class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-5'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+1+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+1+")' class='btn  makeEpRev text-white mr-1 mt-3 mb-2'>Додати викладача</button>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "</div>" +
                "<div id='addTeacherEdit"+data.subjects[counter].id+1+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-8'>" +
                "<select name='editTeacher"+counter+1+"' id='editTeacher"+counter+1+"' class='custom-select facultyEdit mt-2' required>"+
                 teachersEdit1+

               "</select>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "<a><button   onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+1+")' class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-5'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+2+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+2+")' class='btn  makeEpRev text-white mr-1 mt-3 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+2+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-8'>" +
                 "<select name='editTeacher"+counter+2+"' id='editTeacher"+counter+2+"' class='custom-select facultyEdit mt-2' required>"+
                teachersEdit2+
                "</select>"+
                "</div>"+
                "<div class='col-sm-4'>" +
                "<a><button  onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+2+")'  class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-5'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+3+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+3+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+3+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-8'>" +
                "<select name='editTeacher"+counter+3+"' id='editTeacher"+counter+3+"' class='custom-select facultyEdit mt-2' required>"+
                teachersEdit3+
                "</select>"+
                "</div>"+
                "<div class='col-sm-4'>" +
                "<a><button  onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+3+")'  class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "<div class='row'>"+
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-5'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+4+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+4+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+4+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-8'>" +
                "<select name='editTeacher"+counter+4+"' id='editTeacher"+counter+4+"' class='custom-select facultyEdit mt-2' required>"+
                teachersEdit4+
                "</select>"+
                "</div>"+
                "<div class='col-sm-4'>" +
                "<a><button  onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+4+")'   class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "<div class='row'>"+
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-5'>"+
                "<div id='buttonAddTeacher"+data.subjects[counter].id+5+"'>"+
                "<button onclick='addTeacherEdit("+data.subjects[counter].id+5+")' class='btn makeEpRev text-white  mt-3 mr-1 mb-2'>Додати викладача</button>"+
                "</div>"+
                "</div>"+
                "<div class='col-sm-3'></div>"+
                "</div>"+
                "<div id='addTeacherEdit"+data.subjects[counter].id+5+"' style='display: none'>"+
                "<div class='row'>"+
                "<div class='col-sm-8'>" +
                "<select name='editTeacher"+counter+5+"' id='editTeacher"+counter+5+"' class='custom-select facultyEdit mt-2' required>"+
                teachersEdit5+
                "</select>"+
                "</div>"+
                "<div class='col-sm-4'>" +
                "<a><button  onclick='cancelAddTeacherEdit("+data.subjects[counter].id+","+5+")'   class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='row'>" +
                "<div class='col-sm-4'></div>"+
                "<div class='col-sm-4'>" +
                "<button onclick='editSubject("+data.subjects[counter].id+","+counter+","+data.subjects[counter].teachers.length+")' class='btn btn-block bg-dark text-white  mt-3 mb-2'>Оновити</button>"+
                "</div>"+
                "<div class='col-sm-4'></div>"+
                "</div>"+
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
                    +data.subjects[counter].teachers[0].last_name+" "+(data.subjects[counter].teachers[0].first_name[0].toUpperCase()
                        +".") +" "+(data.subjects[counter].teachers[0].patronymic[0].toUpperCase()+".")
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
                    "<span class='text-white subjectRevSNP'><small>"+data.subjects[counter].teachers[0].last_name+" "+(data.subjects[counter].teachers[0].first_name[0].toUpperCase()
                        +".") +" "+(data.subjects[counter].teachers[0].patronymic[0].toUpperCase()+".")
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
            tooltipTeachers="";
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