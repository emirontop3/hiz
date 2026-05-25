$(document).ready(function(){

    $.openReport = function(id) {
        $(".report").empty();
        $.post("get_report_form", {sinav_id: id}, function (responses) {
            let response = JSON.parse(responses);
            response.result.forEach(function (res) {
                $.addToggle(res, "report");
            });
        })
    };

    $.openAnswerKey = function(id) {
        $(".answer-keys").empty();
        $.post("get_answer_keys_form", {sinav_id: id}, function (responses) {
            let response = JSON.parse(responses);
            response.result.forEach(function (res) {
                $.addToggle(res, "answer-keys");
            });
        })
    };

    $.noReport = function(){
        Swal.fire({
            type: 'error',
            title: 'Yetki Geçersiz',
            text: 'Bu Sınav için yetkiniz yoktur!!',
            footer: 'Yetki Tanımlanması için lütfen yöneticinize başvurunuz.',
            confirmButtonText: 'Tamam',
        })
    };

    $.getPool = function(sinav_id){
        window.location.href =  window.location.origin  + "/veri_havuzu/listele_sinav/" + sinav_id;
    };

    $.addToggle = function(res, divname) {
        if(res.durum === "1"){
            $('.' + divname).append(`
                <div class="row mb-3">
                    <div class="col-6">
                        <h6 class="text-black">${res.yetki_adi} </h6>
                    </div>
                    <div class="col-3">
                        <form class="was-validated">
                            <div class="custom-control custom-switch">
                                <input class="custom-control-input" value="${res.sinav_id}/${res.id}/${res.durum}" onclick="$.toggleClick(this, '${divname}')" checked="checked" id="customSwitchValidation${divname + res.id}" required type="checkbox">
                                <span class="custom-control-track"></span>
                                <label class="custom-control-label" for="customSwitchValidation${divname + res.id}"></label>
                            </div>
                        </form>
                    </div>
                </div>
            `);
        }else{
            $('.' + divname).append(`
                <div class="row mb-3">
                    <div class="col-6">
                        <h6 class="text-black">${res.yetki_adi} </h6>
                    </div>
                    <div class="col-3">
                        <form class="was-validated">
                            <div class="custom-control custom-switch">
                                <input class="custom-control-input" value="${res.sinav_id}/${res.id}/${res.durum}" onclick="$.toggleClick(this, '${divname}')" id="customSwitchValidation${divname + res.id}" required type="checkbox">
                                <span class="custom-control-track"></span>
                                <label class="custom-control-label" for="customSwitchValidation${divname + res.id}"></label>
                            </div>
                        </form>
                    </div>
                </div>
            `);
        }
    };

    $.toggleClick = function(input, divname) {
        let post_url = null;
        if(divname === "report"){
            post_url = "examReportStatus/";
        }else {
            post_url = "examAnswerKeysStatus/"
        }

        let input_val = input.value;
        let input_id  = input.id;
        let temp = input_val.split("/");
        let exam_id   = temp[0];
        let auth_id   = temp[1];
        let status_id = temp[2];

        if(status_id === "1"){

            $.post(post_url + exam_id,{authId: auth_id, statusId: 0}, function (response) {
                let res = JSON.parse(response);
                $('#' + input_id).attr("value", exam_id + "/" + auth_id +"/" + "0");
            });

        }else if (status_id === "0"){

            $.post(post_url + exam_id,{authId: auth_id, statusId: 1}, function (response) {
                let res = JSON.parse(response);
                $('#' + input_id).attr("value", exam_id + "/" + auth_id +"/" + "1");
            });
        }

    };

    $('#reportStatusRefresh').click( function () {
        $('#button-refresh').trigger('click');
    });

    $('#answerKeysStatusRefresh').click( function () {
        $('#button-refresh').trigger('click');
    });

    $.updateExam = function(id) {
        window.location.href = "update_form/" + id;
    };

    $.updateAnswer = function(id) {
        window.location.href = "update_answer_form/" + id;
    };

    $.getReport = function(id) {
      window.location.href =  window.location.origin  + "/rapor_al/listele/" + id;
    };
    $.getAnswerKeys = function(id) {
        window.open(window.location.origin  + "/cevap_anahtarlari/cevaplar/" + id, "_blank");
      // window.location.href =  window.location.origin  + "/cevap_anahtarlari/cevaplar/" + id;
    };
    $.getKazanim = function(id) {
      window.location.href =  window.location.origin  + "/cevap_anahtarlari/kazanimlar/" + id;
    };

    $.deleteExam = function(id){
        swal({
            title: 'Emin misiniz?',
            text: "Sınav ve içindeki tüm veriler silinecektir!!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post( "delete", {delete_exam: id}, function (response) {
                    let resultStatus = JSON.parse(response).status;
                    if(resultStatus === "success") {
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

    /*******     Sinav fitreleme(arama) Bölümü      *******/

    $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#paket').empty();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#paket').append("<option selected disabled>Sınav Paketi Seçiniz</option>");

        paket_post = $.paket_post(donem_id)
    };

    $.paket_post = function(donem_id) {
        return $.post("paket_getir", {donem_id: donem_id}, function (response) {
            let paketler = JSON.parse(response);
            paketler.forEach(function (paket) {
                $('#paket').append(`
                    <option value="${paket.id}">${paket.paket_adi}</option>
              `)
            })
        })
    };

    $.secili_paket = function(element) {
        let paket_id = $(element).val();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#grup').append("<option selected disabled>Sınav Grubu Seçiniz</option>");

        grup_post = $.grup_post(paket_id);
    };

    $.grup_post = function(paket_id) {
        return $.post("get_group_for_packet", {paket_id: paket_id}, function (response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function (grup) {
                $('#grup').append(`
                    <option value="${grup.id}">${grup.grup_adi}</option>
              `)
            })
        });
    };

    $.secili_grup = function (element) {
        let paket_id = $("#paket").val();
        let grup_id  = $(element).val();

        $('#select-search').val('Grup').trigger('change');
        $('#input-search').attr("value","id/"+grup_id);
        $('#button-search').trigger('click');
    }

    $('.datagrid').on('click', '.btnStats', function () {
        let self = $(this);
        Swal.fire({
            title: '',
            type: 'success',
            onOpen: function() {
                $('.swal2-confirm').text('Sayılar getiriliyor').cLoader();
                $.post('/sinavlar_online/istatistik', {sid:self.data('id')}, function (resp) {
                    $('.swal2-title').text('Toplam Katılım: '+resp.katilim);
                    $('.swal2-content').html($('#tplSinavSayilar').html().render(resp));
                    $('.swal2-confirm').text('Tamam').rLoader();
                });
            },
            html: '',
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonText: 'Tamam',
            focusConfirm: false
        })
    })

});
