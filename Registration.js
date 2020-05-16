$('#registration').submit(function () {
console.log(1),
    $.post(

        '/reg',
        $("#registration").serialize(),

        function (msg) {
          //  console.log(msg);
            if (typeof msg.redirect == 'string') {
                 window.location = msg.redirect;
             }else{
                 alert(msg.message);
             }
        }
    );
    return false;
});


