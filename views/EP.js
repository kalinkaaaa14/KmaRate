
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
        for(k=0; k<data.universities_titles.length;k++){
            data.universities_titles[k].title=  data.universities_titles[k].title[0].toUpperCase()+ data.universities_titles[k].title.slice(1);
        }
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

    }


    function showFiltersEp(data) {

        let res="";

    res+="<form class='formFiltersEP'>"+
            "<br>"+
            "<h4 class='text-center mt-1'>Фільтр</h4>"+
            "<div class='form-group'>"+
            "<h5 for='nameEp'>Назва</h5>"+
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
});