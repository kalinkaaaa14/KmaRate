$('#registration').submit(function () {
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

