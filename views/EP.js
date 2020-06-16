let branchId=0;
let array=[];
function createNewProgram(){
    document.getElementById("makeOwnProgram").style.display="block";
    document.getElementById("chooseProgramFromSelect").style.display="none";
    document.getElementById("buttonCreateNew").style.display="none";
}
function createNewUni(){
    document.getElementById("makeOwnUni").style.display="block";
    document.getElementById("chooseUniFromSelect").style.display="none";
    document.getElementById("buttonCreateNewUni").style.display="none";
}
function saveNewEP(){
    let u="";
    if( document.getElementById("makeOwnUni").style.display==="block"){
        u=document.getElementsByName("uniCreate")[0].value;
    }else{
        u=document.getElementsByName("chooseProgramAddUni")[0].value;
    }
    let t="";
    if(document.getElementById("makeOwnProgram").style.display ==="block"){
        t=document.getElementsByName("programCreate")[0].value;
    }else{
        t=document.getElementsByName("chooseProgramAddProgram")[0].value;
    }

    var res={
        title:t,
        university:u
    }
   // console.log(res);
    if(res.title==="" || res.university ===""){
        return alert('Поля, позначені *, повинні бути заповнені.');
    }
    // $.ajax({
    //     url: 'ep/new/exchange-program',
    //     type: 'POST',
    //     success: function (data, textStatus, xhr) {
    //         console.log(data);
    //
    //     },
    //
    //     error: function (xhr, textStatus, errorThrown) {
    //         console.log('Error in Operation');
    //     }
    // });

}

function  addMoreBranch(){
    ++teacherId;
    let parent = document.getElementById('branchesParent');
    let s="<select  name='branchAdd"+branchId+"' class='custom-select mb-2' required>";
    for(i=0;i<array.length;i++){
        s+="<option value='" + array[i].id + "'>" + array[i].id + " " + array[i].title + "</option>";
        }
    }
    s+="</select>";
let b = "<div class='row'>"+
    "<div class='col-sm-8'>" +
    s+
    "</div>"+
    "<div class='col-sm-4'>" +
    "<a><button  onclick='hide("+branchId+")' class='btn btn-lg rounded-circle  ml-3 deleteTeacher' type='button'><i class='fa fa-times' aria-hidden='true'></i> </button></a>"+
    "</div>"+
    "</div>";


parent.innerHTML+=b;


    //parent.appendChild(b);

}

$(document).ready(function () {
    let allBranches="";
    let allProgramsAddProgram="";
    let allProgramsAddUni="";

    let allUniversities="";
    let allPrograms="";

    getUniBranches();
  //  getInfo();

    function getUniBranches() {
        $.ajax({
            url: '/ep/data',
            type: 'GET',
            success: function (data, textStatus, xhr) {
                   console.log(data);
                formatFilters(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }


    function getInfo() {
        console.log("i'm here");
        var ep = {
            title: document.getElementsByName('chooseProgram')[0].value,
            branch_id: document.getElementsByName("chooseBranch")[0].value,
            university_title: document.getElementsByName("chooseUniversity")[0].value
        };

        //console.log(ep);

        $.ajax({
            url: '/ep/filter',
            type: 'GET',
            data: ep,
            success: function (data, textStatus, xhr) {
                console.log(data);
                formatData(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }

    function formatFilters(data) {
        for(i=0; i<data.branches.length;i++){
            data.branches[i].title=data.branches[i].title[0].toUpperCase()+data.branches[i].title.slice(1);
        }
       /* for(k=0; k<data.universities_titles.length;k++){
            data.universities_titles[k].title=  data.universities_titles[k].title[0].toUpperCase()+ data.universities_titles[k].title.slice(1);
        }*/
        let dataL = 0;

        allBranches+="<select  name='chooseBranch' class='custom-select mb-2' required>"+ "<option selected value=''></option>";

        while(dataL<data.branches.length) {
            allProgramsAddB+="<option value='" + data.branches[dataL].id + "'>" + data.branches[dataL].id + " " + data.branches[dataL].title + "</option>";
            allBranches += "<option value='" + data.branches[dataL].id + "'>" + data.branches[dataL].id + " " + data.branches[dataL].title + "</option>";
        dataL++;
        }
        for(i=0;i<data.branches.length;i++){
            array[i]=data.branches[i];
        }

      //  allProgramsAddBranches+=allProgramsAddB;

        allBranches+="</select>";

        dataL=0;

        allUniversities+="<select name='chooseUniversity' class='custom-select mb-2' required>"+
            "<option selected value=''></option>";
        allProgramsAddUni+="<select name='chooseProgramAddUni' class='custom-select mb-2 ml-5' required>";

        while(dataL<data.universities_titles.length) {
            allProgramsAddUni+="<option value='" + data.universities_titles[dataL].title + "'>" + data.universities_titles[dataL].title + "</option>";
            allUniversities += "<option value='" + data.universities_titles[dataL].title + "'>" + data.universities_titles[dataL].title + "</option>";
            dataL++;
        }
        allProgramsAddUni+="</select>";
        allUniversities+="</select>";

        dataL=0;
        allPrograms+="<select name='chooseProgram' class='custom-select mb-2' required>"+ "<option selected value=''></option>";
        allProgramsAddProgram+="<select name='chooseProgramAddProgram' class='custom-select mb-1' required>";

        while(dataL<data.programs_titles.length) {
            allProgramsAddProgram+= "<option value='" + data.programs_titles[dataL].title + "'>" + data.programs_titles[dataL].title + "</option>";
            allPrograms+= "<option value='" + data.programs_titles[dataL].title + "'>" + data.programs_titles[dataL].title + "</option>";
            dataL++;
        }

        allProgramsAddProgram+="</select>";
        allPrograms+="</select>";

            $('#filtersEp').html(showFiltersEp(data));

            getInfo();
            $('#searchEPButton').click(getInfo);
    }

    function formatData(data){
        for(l=0;l<data.exchange_programs.length;l++) {
            for (i = 0; i < data.exchange_programs[l].branches.length; i++) {
                data.exchange_programs[l].branches[i].title = data.exchange_programs[l].branches[i].title[0].toUpperCase() + data.exchange_programs[l].branches[i].title.slice(1);
            }
        }

        $('#epFromServer').html(showEp(data));

    }


    function showFiltersEp(data) {

        let res="";

    res+="<form class='formFiltersEP'>"+
            "<br>"+
            "<h4 class='text-center mt-1'>Фільтр</h4>"+
            "<div class='form-group'>"+
            "<h5 for='nameEp'>Назва програми обміну</h5>"+
            allPrograms+
            "</div>"+

            "<div class='form-group'>"+
            "<h5 for='branch'>Спеціальність</h5>"
        +allBranches+
            "</div>"+

            "<div class='form-group'>"+
            "<h5>Університет</h5>"+
            allUniversities+
            "</div>"+
            "<button id='searchEPButton' type='button' class='btn searchBS text-white btn-block ml-4 mt-4'>Пошук</button>"+
            "</form>";

    return res;
    }

    function showEp(data) {
        let res="";
        let addEP="";
        let addEPDiv="";
        let editEP="";
        let editEPDiv="";
        let allProgramsAddInput="<div id='makeOwnProgram' style='display: none'>" + "<input type='text'  name='programCreate' class='form-control ' id='programCreate'>"+"</div>";
        let allProgramsAddInputUni="<div id='makeOwnUni' style='display: none'>" + "<input type='text'  name='uniCreate' class='form-control ' id='uniCreate'>"+"</div>";

        res+=  "<h5 class='mb-1 allSubjPage'>Всі програми обміну</h5>";
        let counter = 0;
        let tooltipBranches="";

        if(data.isAdmin){
            addEP="<button data-toggle='collapse' data-target='#addEP' class='btn btn-block text-white makeEpRev mb-3'>Додати програму обміну</button>";
            addEPDiv="<div id='addEP' class='collapse' style='overflow: hidden'>" +
                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='titleCreate'>Назва програми *</label>"+
                "<div id='chooseProgramFromSelect'>" +
                allProgramsAddProgram+
                "</div>"+
                allProgramsAddInput+
                "<div id='buttonCreateNew'>" +
                "<button onclick='createNewProgram()' class='btn ml-3 mb-1 makeEpRev text-white'>Створити нову</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+

                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<div class='form-inline mb-2'>"+
                "<label class='ml-5 mr-5' for='titleCreate'>Університет *</label>"+
                "<div id='chooseUniFromSelect'>" +
                allProgramsAddUni+
                "</div>"+
                allProgramsAddInputUni+
                "<div id='buttonCreateNewUni'>" +
                "<button onclick='createNewUni()' class='btn ml-3 mb-1 makeEpRev text-white'>Створити новий</button>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+

                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<button onclick='addMoreBranch()' class='btn btn-block makeEpRev text-white'>Додати спеціальність</button>"+
                "</div>"+
                "</div>"+



                "<div class='row'>" +
                "<div class='col-sm-3'></div>"+
                "<div class='col-sm-7'>" +
                "<button onclick='saveNewEP()' class='btn btn-block makeEpRev text-white'>Підтвердити</button>"+
                "</div>"+
                "</div>"+
                "</div>";

        }
        res+=addEP;
        res+=addEPDiv;
        while (counter < data.exchange_programs.length) {
            let quantityTeach="";
            if(data.exchange_programs[counter].branches.length>1){
                for(q=1;q<data.exchange_programs[counter].branches.length;q++){
                    tooltipBranches+=data.exchange_programs[counter].branches[q].id+" "+data.exchange_programs[counter].branches[q].title+"; ";
                }
                quantityTeach=" +"+(data.exchange_programs[counter].branches.length-1);
               // console.log(quantityTeach);
            }


                res += "<div class='container-fluid rounded epFilters'>" +
        "<div class='row'>" +
        "<div class='col-sm-4 firstPart'>" +
        "<span class='text-white epTitle'><small>" + data.exchange_programs[counter].title + "</small></span>" +
        "<br>" +
        "<span class='text-white epFiltersCourse'><small></small></span>"
        + "<br>" + "<h3 class='text-white  mt-3' >"
        + data.exchange_programs[counter].university + "</h3>"
        + "<br><br>" +
        "<span class='text-white subjectRevSNP'><small>" + data.exchange_programs[counter].branches[0].id + " " + data.exchange_programs[counter].branches[0].title
        + "</small><a href='#' class='text-white quantityTeach' data-toggle='tooltip' data-html='true' title='" + tooltipBranches + "'>" + quantityTeach + "</a></span>"
        + "</div>"
        + "<div class='col-sm-3 my-auto'>" +
        "<h5 class='mt-3 '>Середній рейтинг</h5>" +
        "<span class='quantityEPreview'><small>" + data.exchange_programs[counter].reviews_amount + " відгук(-ів)</small></span>" +
        "</div>" + "<div class='col-sm-2 my-auto'>" + "<div>" +
        "<button data-toggle='modal' data-target='#details' type='button' class='btn btn-lg'>" + data.exchange_programs[counter].average_grade +
        "</button>" + "</div>" + "</div>" +
        "<div class='col-sm-3  my-auto'>" +
        "<a href='/ep/" + data.exchange_programs[counter].id + "' class='btn text-white showAllEPReviews'>Усі відгуки</a>" +
        `<button onclick="window.location='/ep/${data.exchange_programs[counter].id}/createReview'" class='btn text-white makeEpRev'>Залишити відгук</button>` +
        "</div>" +
        "</div>" +
        "</div>" + "<br>";

            tooltipTeachers="";
            counter++;
        }
        return res;
    }
});