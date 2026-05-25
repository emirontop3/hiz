$(document).ready(function(){

    $.openImg = function(id, url){
        $.post("get_img_url", {popup_id: id}, function (responses) {
            let response = JSON.parse(responses).resim_url;

            $('.popup-img').empty();
            $('.popup-img').append(`<img src="${window.location.origin  + "/"+ response}" class="img-fluid" alt="Responsive image">`);

        })
    };

    $.updatePopup = function (id) {

        $.post("editPopup", {popup_id: id}, function (response) {
		   response = JSON.parse(response);
         console.log(response);
            $('#popup_id').val(id);
            $('#link_edit').val(response.link);

        })

    };

    $.popup_update= function() {

        $('#modal-popup-edit').modal('hide');
      var data = $('#popup_image')[0].serialize();
		var formData = new FormData();
      formData.append('image', data);
      console.log(formData);

       $.post("update", {formdata: formData}, function (response) {
            console.log("x");

        });
    };

    $.deletePopup = function(id){
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
                $.post(  "delete", {delete_popup: id}, function (response) {
                    let result = JSON.parse(response).status;
                    if(result === "success") {
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
