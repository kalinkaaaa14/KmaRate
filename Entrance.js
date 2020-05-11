$('#entrance').submit(function () {

    $.post(
        '/entr',
        $("#entrance").serialize(),

        function (msg) {
            if (typeof msg.redirect == 'string') {
                window.location = msg.redirect;
            } else {
                alert(msg.message);
            }

        }
    );
    return false;
});
