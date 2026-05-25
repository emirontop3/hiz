$(document).ready(function(){

    let count = 0;

    $.removeElement = function(element) {

        $(element).parent('div').parent('div').remove();
        let element_name = $(element).parent('div').next().children().attr("data-name");

        $("#" + element_name).attr("disabled", false);
    };

    $.addElement = function (id) {
        if(id === 1) {
            $.buildElement( "ad_soyad");
            $("#ad_soyad").attr("disabled", true);
        }else if(id === 2) {
            $.buildElement("ogrenci_no");
            $("#ogrenci_no").attr("disabled", true);
        }else if(id === 3) {
            $.buildElement("sinif");
            $("#sinif").attr("disabled", true);
        }else if(id === 4) {
            $.buildElement("sube");
            $("#sube").attr("disabled", true);
        }else if(id === 5) {
            $.buildElement("kurum_no");
            $("#kurum_no").attr("disabled", true);
        }else if(id === 6) {
            $.buildElement("tc_no");
            $("#tc_no").attr("disabled", true);
        }else if(id === 7) {
            $.buildElement("il_no");
            $("#il_no").attr("disabled", true);
        }else if(id === 8) {
            $.buildElement("ilce_no");
            $("#ilce_no").attr("disabled", true);
        }else if(id === 9) {
            $.buildElement("cinsiyet");
            $("#cinsiyet").attr("disabled", true);
        }else if(id === 10) {
            $.buildElement("oturum");
            $("#oturum").attr("disabled", true);
        }else if(id === 11) {
            $.buildElement("kitapcik");
            $("#kitapcik").attr("disabled", true);
        }else if(id === 12) {
            $.buildElement("telefon");
            $("#telefon").attr("disabled", true);
        }else if(id === 13) {
            $.buildElement("bolum_alan");
            $("#bolum_alan").attr("disabled", true);
        }else if(id === 14) {
            count++;
            $.buildElement("ders-" + count);

        }else if(id === 15) {
            $.buildElement("dinmuaf");
            $("#dinmuaf").attr("disabled", true);
        }
    };

    $.buildElement = function (inputValue) {

        $('.input-content').append(`
            <div class="row mb-2 input-group">
                <div class="col-2">
                    <button type="button" title="Sil" onclick="$.removeElement(this)" class="btn btn-float bg-danger text-white btn-sm"><i class="material-icons">clear</i></button>
                </div>
                <div class="col-6">
                    <input type="text" value="${inputValue}" data-name="${inputValue}" name="variable[]" class="form-control mb-3" placeholder="Değişken" required/>
                </div>
                <div class="col-2">
                    <input type="number" name="start[]" class="form-control mb-3" placeholder="Başlangıç" required/>
                </div>
                <div class="col-2">
                    <input type="number" name="size[]" class="form-control mb-3" placeholder="Uzunluk" required/>
                </div>
            </div>
        `);
    };

    $.updateOptik = function (id, yetki) {
        if(yetki == 1){
            window.location.href = "update_form/" + id;
        }else {
            $.post("control_yetki", {optik_id: id}, function (response) {
                if(response === "success") {
                    window.location.href = "update_form/" + id;
                }else {
                    Swal.fire({
                        type: 'error',
                        title: 'Yetki Geçersiz',
                        text: 'Bu optiği düzenlemeniz için yetkiniz yoktur!!',
                        confirmButtonText: 'Tamam',
                    })
                }
            });
        }
    };

    $.deleteOptik = function(id, yetki){

        if(yetki == 1){
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
                    $.post(  "delete", {delete_optik: id}, function (response) {
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
        }else {
            $.post("control_yetki", {optik_id: id}, function (response) {
                if(response === "success") {
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
                            $.post(  "delete", {delete_optik: id}, function (response) {
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
                }else {
                    Swal.fire({
                        type: 'error',
                        title: 'Yetki Geçersiz',
                        text: 'Bu optiği silmeniz için yetkiniz yoktur!!',
                        confirmButtonText: 'Tamam',
                    })
                }
            });
        }
    };

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post(  "optikStatus", {optik_id: id, optik_condition: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post(  "optikStatus", {optik_id: id, optik_condition: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };
});
