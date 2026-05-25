$(document).ready(function(){

    $.openImg = function(id, url){
        $.post("get_img_url", {fmt_id: id}, function (responses) {
            let response = JSON.parse(responses).resim_url;

            $('.fmt-img').empty();
            $('.fmt-img').append(`<img src="${window.location.origin  + "/"+ response}" class="img-fluid" alt="Responsive image">`);

        })
    };

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post(  "mobilStatus", {fmt_id: id, mobil_condition: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post(  "mobilStatus", {fmt_id: id, mobil_condition: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };

    $.updateFmt = function (id) {
        $('#kagit-tipi').empty();
        $('#cihaz-tipi').empty();
        $.post("editFmt", {fmt_id: id}, function (response) {
            let isim  = JSON.parse(response).isim;
            let ctipi = JSON.parse(response).cihaz_tipi;
            let ktipi = JSON.parse(response).kagit_tipi;
            ktipi = ktipi.split(" ");


            $('#name_edit').val(isim);
            $('#fmt_id').val(id);
            $('#kagit-tipi').append(`
                <option value="A4 (dikey)" ${(ktipi[0] === "A4")? "selected" : "" }>A4 (dikey)</option>
                <option value="A5 (yatay)" ${(ktipi[0] === "A5")? "selected" : "" }>A5 (yatay)</option>
            `);

            $('#cihaz-tipi').append(`
                <option value="sekonic" ${(ctipi === "sekonic")? "selected" : "" }>Sekonic</option>
                <option value="bikom" ${(ctipi === "bikom")? "selected" : "" }>Bikom</option>
            `);
        })

    };

    $.fmt_update= function() {
        $('#modal-fmt-edit').modal('hide');
        $.post("update", {isim: $('#name_edit').val(), fmt_id: $('#fmt_id').val(), ktipi: $('#kagit-tipi').val(), cihaz_tipi: $('#cihaz-tipi').val()}, function (response) {
            if(response === "success"){
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Güncelleme işlemi başarıyla gerçekleşti",
                    position: "topCenter"
                });
                $('#button-refresh').trigger('click');
            } else {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Güncelleme işlemi sırasında bir hata oluştu.",
                    position: "topCenter"
                });
            }

        })
    };

    $.deleteFmt = function(id){
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
                $.post(  "delete", {delete_fmt: id}, function (response) {
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