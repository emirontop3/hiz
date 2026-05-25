$(document).ready(function(){

    $.kontrolLetters = function (element, exam, lesson_id) {
        let emptyInput = 0;
        let countInput = 0;

        $('.' + exam).each( function () {
            countInput++;
            if($(this).val() === "") {
                $(this).focus();
                emptyInput++;
            }else {

            }
        });

        for(let i = 1; i <= countInput/2; i++) {
            $('.altders' + i + '-' + lesson_id).val($('#altders'+ i + '-' + lesson_id).val());
        }



        $.formValidateControl(element, emptyInput);

    };

    $.formValidateControl = function (element, emptyInput) {
        if(parseInt(emptyInput) > 0 ){
            alert("Lütfen Boş Alan Bırakmayınız")
        }else {
            $(element).parent('div').next().children().attr("disabled", false);
        }
    };

    $.sendServer = function (form) {
        event.preventDefault();

        $.post(  "/excel_import/save", $("form#" + form).serialize(), function (response) {
            // console.log(response);

            let result = JSON.parse(response).result;

            if(result === "success"){
                $("#" + form).hide('slow', function(){ this.remove(); });

                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Başarılı bir şekilde sınav soruları eklendi.",
                    position: "topCenter"
                });
            }else {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Ekleme işlemi sırasında bir hata oluştu.",
                    position: "topCenter"
                });
            }

            if($('.control-cards').length == 2) {
                $.domControl();
            }

        });



    };

    $.domControl = function () {
        let domInterval = setInterval(function () {
            if($('.control-cards').is('div') === false){
                clearInterval(domInterval);
                $('.success-exam-save').removeClass("d-none");
            }
            console.log($('.card').is('div'));
        }, 1500);
    }

    $('#inputGroupFile04').change(function() {
        let $el = $(this), files = $el[0].files, label = files[0].name;

        $el.next('.custom-file-label').html(label);
    });


});
