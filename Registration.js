$('#registration').submit(function () {
    alert("fdffd");
    $.post(
        '/reg',
        $("#registration").serialize(),

        function (msg) {

            if (typeof msg.redirect == 'string') {
                window.location = msg.redirect;
            }

        }
    );
    return false;
});

