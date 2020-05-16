$(document).ready(function () {
    $('#searchSButton').click(function () {
        var subject = {
                    title: document.getElementsByName('title')[0].value,
                    teacher: document.getElementsByName("teacher")[0].value,
                    year: document.getElementsByName("year")[0].value,
                    courses: Array.from(document.querySelectorAll('input.subjectCourse:checked')).map(cb => cb.value),
                    semesters:  Array.from(document.querySelectorAll('input.semestersSubject:checked')).map(cb => cb.value),
                    faculties: Array.from(document.querySelectorAll('input.facultiesSubject:checked')).map(cb => cb.value)
        };

        $.ajax({
            url: '/subj/filter',
            type: 'GET',
            data: subject,

            success: function (data, textStatus, xhr) {
                console.log(data);
            },

            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    });
});