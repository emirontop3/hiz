$(document).ready(function(){

    let lessonValue     = $('#lesson_name').val();

    $("#lesson_name" ).keyup(function() {
        lessonValue = $('#lesson_name').val();
        if(lessonValue !== "") {
            $('#ders_ekle').attr("disabled", false);
        }else {
            $('#ders_ekle').attr("disabled", true);
        }

    });

    $('#ders_ekle').click( function () {
        $.post("add", {ders_adi: lessonValue}, function(responses){
            let response = JSON.parse(responses);

            if(response.status === "success"){
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Başarılı bir şekilde ders eklendi.",
                    position: "topCenter"
                });
                $('#modal-lesson-add').modal('hide');

                setTimeout( function () {
                    $('#button-refresh').trigger('click');
                }, 2000);
            } else if (response.status === "already_add") {

                        iziToast.error({
                            title: "İşlem Başarısız",
                            message: "Bu ders zaten eklenmiş.",
                            position: "topCenter"
                        });
                        $('#modal-institution-add').modal('hide');
                        $("#ders_ekle").removeClass("d-none");
                        $("#ders_iptal").removeClass("d-none");
                        $("#add-progress").addClass("d-none");

            }else {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Ders ekleme sırasında bir hata oluştu.",
                    position: "topCenter"
                });
                $('#modal-institution-add').modal('hide');
            }
        });
    });

    $.updateDers = function(id) {
        $("#update_lesson_id").remove();
        $("#lesson-edit-form").append(`<input type="hidden" id="update_lesson_id" value="${id}" />`);

        $.post( "update_form", {update_id: id}, function (responses) {
            let response = JSON.parse(responses).result;

            $('#lesson_name_edit').val(response.ders_adi);

        });

    };

    $('#ders_duzenle').click( function () {

        $.post("update/" + $('#update_lesson_id').val(), {ders_adi: $('#lesson_name_edit').val()}, function(responses){
            let response = JSON.parse(responses);

            if(response.status === "success"){
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Başarılı bir şekilde ders eklendi.",
                    position: "topCenter"
                });
                $('#modal-lesson-edit').modal('hide');

                setTimeout( function () {
                    $('#button-refresh').trigger('click');
                }, 2000);
            } else {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Ders ekleme sırasında bir hata oluştu.",
                    position: "topCenter"
                });
                $('#modal-lesson-edit').modal('hide');
            }
        });
    });

    $.deleteDers = function(id){
        swal({
            title: 'Emin misiniz?',
            text: "Bu işlemi geri alamayacaksınız!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post(  "delete", {delete_id: id}, function (response) {
                    if(response === "success") {
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
                        $('#button-refresh').trigger('click');
                    } else {
                        iziToast.error({
                            title: "İşlem Başarısız",
                            message: "Silme işlemi sırasında bir hata oluştu.",
                            position: "topCenter"
                        });
                    }
                })
            }
        });
    };

});
