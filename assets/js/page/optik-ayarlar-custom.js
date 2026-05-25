$(document).ready(function () {

    $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#exam_packet').empty();
        $('#exam_group').empty();
        $('#exam').empty();
        $('#exam_packet').append("<option selected disabled>Sınav Paketi Seçiniz</option>");

        paket_post = $.paket_post(donem_id)
    };

    $.paket_post = function(donem_id) {
        return $.post("paket_getir", {donem_id: donem_id}, function (response) {
            let paketler = JSON.parse(response);
            paketler.forEach(function (paket) {
                $('#exam_packet').append(`
                    <option value="${paket.id}">${paket.paket_adi}</option>
              `)
            })
        })
    };

    $.secili_paket = function(element) {
        let paket_id = $(element).val();
        $('#exam_group').empty();
        $('#exam').empty();
        $('#exam_group').append("<option selected disabled>Sınav Grubu Seçiniz</option>");

        grup_post = $.grup_post(paket_id);
    };

    $.grup_post = function(paket_id) {
        return $.post("grup_getir", {paket_id: paket_id}, function (response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function (grup) {
                $('#exam_group').append(`
                    <option value="${grup.id}">${grup.grup_adi}</option>
              `)
            })
        });
    };

    $.secili_grup = function(element) {
        let grup_id = $(element).val();
        $('#exam').empty();
        $('#exam').append("<option selected disabled>Sınav Seçiniz</option>");

        sinav_post = $.sinav_post(grup_id);
    };

    $.sinav_post = function(grup_id) {
        return $.post("sinav_getir",{grup_id: grup_id}, function (response) {
            let sinavlar = JSON.parse(response);

            sinavlar.forEach(function (sinav) {
                $('#exam').append(`
                    <option value="${sinav.id}">${sinav.sinav_adi}</option>
                `);
            })
        });
    };

    $.secili_sinav= function(element) {
        let sinav_id  = $(element).val();
        let sinav_adi = $(element).children("option:selected").text();

        $.post("sinav_bilgilerini_getir", {sinav_id: sinav_id}, function (response) {
            let sinav = JSON.parse(response);
            $('.listele').empty();

            $.each(sinav, function (index, value) {
                $('.listele').append(`
                    <div class="list-group" id="accordionOne">
                        <div class="expansion-panel list-group-item">
                            <a aria-controls="${$.convertTOSEO(index)}" aria-expanded="false" class="expansion-panel-toggler collapsed" data-toggle="collapse" href="#${$.convertTOSEO(index)}" id="headingOne">
                            ${index}
                                <div class="expansion-panel-icon ml-3 text-black-secondary">
                                    <i class="collapsed-show material-icons">keyboard_arrow_down</i>
                                    <i class="collapsed-hide material-icons">keyboard_arrow_up</i>
                                </div>
                            </a>
                            <div aria-labelledby="headingOne" class="collapse" data-parent="#accordionOne" id="${$.convertTOSEO(index)}">
                                <div class="expansion-panel-body">
                                    <ul class="list-group" id="${$.convertTOSEO(index)}">
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                value.forEach(function (val) {
                    $('#' + $.convertTOSEO(index)).append(`
                         <li class="list-group-item d-flex justify-content-between align-items-center">
                             ${val.il_adi} - ${val.ilce_adi} - ${val.kurum_adi} - ${val.sinif}-${val.sube}
                             <span class="badge badge-primary badge-pill">${val.sayisi}</span>
                         </li>
                    `);
                })
            });
        });



    };

    $.removeExam = function (element, sinav_id) {
        $(element).parent('div').parent('div').empty();
        $.post("sinav_sil", {sinav_id: sinav_id, durum: 0}, function (update) {
            $("#add-exam").attr("disabled", false);
            $('#secilmis-sinav').empty();
            $('#secilmis-sinav').append(`
                <div class="alert alert-warning align-content-center" role="alert">
                    <p class="text-dark text-center m-auto"><b> seçili bir sınav bulunmamaktadır.</b></p>
                </div>
            `);
        })
    };

    $.add_exam = function () {
        let sinav_id  = $("#exam").val();
        let sinav_adi = $("#exam").children("option:selected").text();

        if (sinav_id === null || sinav_adi === "Seçiniz"){
            iziToast.error({
                title: "İşlem Başarısız",
                message: "Lütfen Önce Bir Sınav Seçiniz!!",
                position: "center"
            });
        }else {
            $("#add-exam").attr("disabled", true);

            $.post("sinav_kontrol", {sinav_id: sinav_id}, function (response) {
                let sinav = JSON.parse(response);

                if(sinav.status === "fail") {
                    $.post("sinav_ekle", {sinav_id: sinav_id}, function (result) {
                        let sonuc = JSON.parse(result);
                        if(sonuc.status === "success"){
                            $('#secilmis-sinav').empty();
                            $('#secilmis-sinav').append(`
                            <p class="mt-3 text-center card-text text-danger"><b>Dikkat!! Mevcut Sınavı Silmeden yeni sınav ekleyemezsiniz</b></p>
                            <div class="row">
                                <div class="col-sm-2">
                                    <button type="button" title="Sil" onclick="$.removeExam(this, '${sinav_id}')" class="btn btn-float bg-danger text-white btn-sm float-right">
                                        <i class="material-icons">clear</i>
                                    </button>
                                </div>
                                <div class="col-sm-7 mt-auto">
                                    <p class="card-title">Aktif Sinav Adı: ${sinav_adi}</p>
                                </div>
                            </div>    
                        `);
                        }else {
                            iziToast.error({
                                title: "İşlem Başarısız",
                                message: "Sınav Ekleme sırasında bir hata oluştu",
                                position: "center"
                            });
                        }
                    });
                }else {
                    if(sinav.durum === "0"){
                        $.post("sinav_guncelle", {sinav_id: sinav_id, durum: 1}, function (update) {
                            $('#secilmis-sinav').empty();
                            $('#secilmis-sinav').append(`
                            <p class="mt-3 text-center card-text text-danger"><b>Dikkat!! Mevcut Sınavı Silmeden yeni sınav ekleyemezsiniz</b></p>
                            <div class="row">
                                <div class="col-sm-2">
                                    <button type="button" title="Sil" onclick="$.removeExam(this, '${sinav_id}')" class="btn btn-float bg-danger text-white btn-sm float-right">
                                        <i class="material-icons">clear</i>
                                    </button>
                                </div>
                                <div class="col-sm-7 mt-auto">
                                    <p class="card-title">Aktif Sinav Adı: ${sinav_adi}</p>
                                </div>
                            </div>    
                        `);
                        });
                    }else {
                        iziToast.error({
                            title: "İşlem Başarısız",
                            message: "Sınav Eklemeden Önce mevcut sınavı siliniz",
                            position: "center"
                        });
                    }
                }
            });
        }

    }

    $.convertTOSEO = function (text) {
        let turkce  = ["ç", "Ç", "ğ", "Ğ", "ü", "Ü", "ö", "Ö", "ı", "İ", "ş", "Ş", ".", ",", "!", "'", "\"", " ", "?","*","_", "|", "=", "(", ")", "@"];
        let convert = ["c", "c", "g", "g", "u", "u", "o", "o", "i", "i", "s", "s", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        let i;
        for(i=0; i<turkce.length; i++){
            text = text.replace(turkce[i], convert[i])
        }
        return text.toLowerCase();
    }

});