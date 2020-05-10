$('#registration').submit(function () {
    alert("fdffd");
    $.post(
        'http://92.249.117.82:4321/reg',
        $("#registration").serialize(),

        function (msg) {
console.log(msg.body);
            if (typeof msg.redirect == 'string') {

            }
        }
    );
    return false;
});

