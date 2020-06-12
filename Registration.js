$('#registration').submit(function () {
    if (document.getElementsByName('password')[0].value === document.getElementsByName('password2')[0].value) {
        $.post(
            '/reg',

            $("#registration").serialize(),

            function (msg) {

                if (typeof msg.redirect == 'string') {
                    window.location = msg.redirect;

                } else {
                    alert(msg.message);
                }
            }
        );
        return false;
    } else {
        alert("Incorrect data");
    }
});


