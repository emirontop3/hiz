$(document).ready(function(){

    $.removeElement = function(element) {
        $(element).parent('div').parent('div').remove();
        //let element_name = $(element).parent('div').next().children().attr("data-name");
    };

    $("#new-line").click(function () {
        $('.card-body').append(`
            <div class="row">
                <div class="p-2 col-sm-1">
                    <button type="button" title="Sil" onclick="$.removeElement(this)" class="btn btn-float bg-danger text-white btn-sm">
                        <i class="material-icons">clear</i>
                    </button>
                </div>
                <div class="p-2 col-sm-2">
                    <select name="item[]" class="custom-select mb-3">
                        <option selected disabled>Kolon Adı</option>
                        <option value="ad">Ad</option>
                        <option value="soyad">Soyad</option>
                        <option value="ad_soyad">Ad Soyad</option>
                        <option value="tc_no">Tc No</option>
                        <option value="sinif">Sınıf</option>
                        <option value="sube">Şube</option>
                        <option value="ogr_no">Öğrenci No</option>
                        <option value="kurum_kodu">Kurum Kodu</option>
                        <option value="sinav_adi">Sınav Adı</option>
                        <option value="kurum_adi">Kurum Adı</option>
                        <option value="sinav_kodu">Sınav Kodu</option>
                        <option value="oturum">Oturum</option>
                        <option value="il_adi">İl Adı</option>
                        <option value="ilce_adi">İlçe Adı</option>
                    </select>
                </div>
                <div class="p-2 col-sm-2">
                    <select name="ktip[]" class="custom-select mb-3">
                        <option selected disabled>Kodlama Tipi</option>
                        <option value="yazi">Yazı</option>
                        <option value="kodlama">Kodlama</option>
                        <option value="qr_kod">QR Kod</option>
                        <option value="yazisiz_kodlama">Yazısız Kodlama</option>
                    </select>
                </div>
                <div class="p-2 col-sm-1">
                    <input type="number" step=".001" name="x[]" class="form-control mb-3" placeholder="x" required/>
                </div>
                <div class="p-2 col-sm-1">
                    <input type="number" step=".001" name="y[]" class="form-control mb-3" placeholder="y" required/>
                </div>
                <div class="p-2 col-sm-1">
                    <select name="yon[]" class="custom-select mb-3">
                        <option selected disabled>Yön</option>
                        <option value="yatay">Yatay</option>
                        <option value="dikey">Dikey</option>
                    </select>
                </div>
                <div class="p-2 col-sm-1">
                    <select name="kstil[]" class="custom-select mb-3" onchange="$.changeStill(this)">
                        <option selected disabled>Stil</option>
                        <option value="harf">Harf</option>
                        <option value="no">Numara</option>
                    </select>
                </div>
                <div class="p-2 col-sm-2">
                    <input type="text" name="karakter[]" class="form-control mb-3" placeholder="Karakterler" required/>
                </div>
                <div class="p-2 col-sm-1">
                    <input type="number" name="karakter_sayi[]" class="form-control mb-3" placeholder="Sayısı" required/>
                </div>
            </div>
        `);
    });

    $.updateOptikForm = function (id) {
        window.location.href = "update_form/" + id;
    };

    $.deleteOptikForm = function(id){
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
                $.post(  "delete", {delete_optik_form: id}, function (response) {
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

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post(  "optikFormStatus", {optik_id: id, optik_condition: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post(  "optikFormStatus", {optik_id: id, optik_condition: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };

    $.changeStill = function (element) {
        let id = $(element).val();
        if(id === "harf"){
            $(element).parent().next().children().val("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ")
        }else if(id === "no") {
            $(element).parent().next().children().val("0123456789")
        }
    }



});
