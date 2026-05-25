$(document).ready(function(){

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post(  "status", {status_id: id, condition: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post(  "status", {status_id: id, condition: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };

    $.updateAnnouncement = function (id) {
        window.location.href = "update_form/" + id;
    };

    $.deleteAnnouncement = function(id){
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
                $.post(  "delete", {delete_Announcement: id}, function (response) {
                    console.log(response);
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
