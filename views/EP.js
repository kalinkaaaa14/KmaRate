
$(document).ready(function () {
    let allBranches="";
    let allUniversities="";
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
            title: document.getElementsByName('nameEp')[0].value,
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
        allBranches+="<select  name='chooseBranch' class='custom-select mb-2' required>";
        while(dataL<data.branches.length) {
            allBranches += "<option value='" + data.branches[dataL].id + "'>" + data.branches[dataL].id + " " + data.branches[dataL].title + "</option>";
        dataL++;
        }
        allBranches+="</select>";

        dataL=0;
        allUniversities+="<select name='chooseUniversity' class='custom-select mb-2' required>";
        while(dataL<data.universities_titles.length) {
            allUniversities += "<option value='" + data.universities_titles[dataL].title + "'>" + data.universities_titles[dataL].title + "</option>";
            dataL++;
        }
        allUniversities+="</select>";

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
            "<h5 for='nameEp'>Назва університету</h5>"+
            "<input name='nameEp' value='' type='text' class='form-control' id='nameEp'>"+
            "</div>"+

            "<div class='form-group'>"+
            "<h5 for='branch'>Спеціальність</h5>"
        +allBranches+
            "</div>"+

            "<div class='form-group'>"+
            "<h5>Університет</h5>"+
            allUniversities+
            "</div>"+
            "<button id='searchEPButton' type='button' class='btn searchBS text-white btn-block mt-4'>Пошук</button>"+
            "</form>";

    return res;
    }

    function showEp(data) {
        let res="";
        res+=  "<h5 class='mb-1 allSubjPage'>Всі програми обміну</h5>";
        let counter = 0;
        let tooltipBranches="";
        while (counter < data.exchange_programs.length) {
            let quantityTeach="";
            if(data.exchange_programs[counter].branches.length>1){
                for(q=1;q<data.exchange_programs[counter].branches.length;q++){
                    tooltipBranches+=data.exchange_programs[counter].branches[q].id+" "+data.exchange_programs[counter].branches[q].title+", ";
                }
                quantityTeach=" +"+(data.exchange_programs[counter].branches.length-1);
               // console.log(quantityTeach);
            }
if(!data.exchange_programs[counter].isAdmin) {
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
}
            tooltipTeachers="";
            counter++;
        }
        return res;
    }
});