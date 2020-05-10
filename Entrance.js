$('#entrance').submit(function () {
    alert('dddd');
    $.post(
        '/entr',
        $("#entrance").serialize(),

        function (msg) {
            if (typeof msg.redirect == 'string') {
                window.location = msg.redirect;
            }

        }
    );
    return false;
});