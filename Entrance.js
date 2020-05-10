$('#entrance').submit(function () {
    alert('dddd');
    $.post(
        'http://92.249.117.82:4321/entr',
        $("#entrance").serialize(),

        function (msg) {
            alert(msg.message);
            console.log(msg.body);
            if (typeof msg.redirect == 'string') {
                window.location = msg.redirect;
            }

        }
    );
    return false;
});

