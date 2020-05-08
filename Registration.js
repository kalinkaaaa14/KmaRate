$(document).ready(function(){
    $(#registration).submit(function () {
     $.ajax({
            type: "post",
            url: "/reg"
     });
        return false;
    });
});