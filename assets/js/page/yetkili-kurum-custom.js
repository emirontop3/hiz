$(document).ready(function () {

    let teacher_class   = [];
    let active_exam_ids = [];
    let kurum_no = $('#kurum_no').val();

    $('.auth-class').each(function () {
        teacher_class.push($(this).data("class"));
    });

    $.post("teacher_get_exam", {classes: teacher_class, kurum_no: kurum_no}, function (response) {
        let result = JSON.parse(response);
        result.forEach(function (element) {
            $('.auth-class').each(function () {
                if(Number(element.sinif) === Number($(this).data("class"))) {
                    $(this).removeClass('btn-danger');
                    $(this).addClass('btn-success');
                    $(this).attr('href', 'analiz/' + element.sinif)
                }
            });
            let temp_arr = [[ 'sinif', element.sinif], ['sinav_id', element.sinav_id]];
            active_exam_ids.push(temp_arr);
        });
        localStorage.setItem("teacher_info", JSON.stringify(active_exam_ids));
    });


});