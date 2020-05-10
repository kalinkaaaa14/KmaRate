$('#entrButton').on('click',function () {
    alert('f');
    $.ajax({
        type: 'post',
        url: '/entr',
        data: {password: 'a', nickname: 'a'},

    });
});