$(document).ready(function(){

    $.evaluateExam = function(id) {
        if ($('#job-toast').length) {
            iziToast.error({
                title: "",
                message: "Devam eden işlemin tamamlanmasını bekleyiniz",
                position: "topCenter",
                timeout: 800
            });
            return;
        }
        Swal.fire({
            title: 'Toplu Ölçme-Değerlendirme',
            html: "Sonuçlar baştan oluşturulacak, Devam Edilsin mi ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'İptal',
            confirmButtonText: 'Evet, değerlendir!'
        }).then((result) => {
            if (result.value) {

                if (!realtime_bildirimler) {
                    $.blockUI({message:$('.loader-with-msg')});
                }

                $.post("degerlendir", {sinav_id: id}, function (resp) {
                    let m = typeof resp == 'object' ? resp.msg.replace('\n','<br>') : resp;
                    Swal.fire({
                        //icon: 'info',
                        // title: 'İşlem tamam',
                        html: '<b style="line-height:35px">'+m+'</b>',
                        confirmButtonText: 'Tamam'
                    });
                    $.unblockUI();
                });
            }
        })
    };

    $.sortExam = function(id) {
        if ($('#job-toast').length) {
            iziToast.error({
                title: "",
                message: "Devam eden işlemin tamamlanmasını bekleyiniz",
                position: "topCenter",
                timeout: 800
            });
            return;
        }
        Swal.fire({
            title: 'Baştan sıralama işlemi yapılacak',
            text: "Devam edilsin mi ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'İptal',
            confirmButtonText: 'Evet, sırala!'
        }).then((result) => {
            if (result.value) {

                if (!realtime_bildirimler) {
                    $.blockUI({message:$('.loader-with-msg')});
                }

                $.post("sirala", {sinav_id: id}, function (resp) {
                    let m = typeof resp == 'object' ? resp.msg.replace('\n','<br>') : resp;
                    Swal.fire({
                        //icon: 'info',
                        // title: 'İşlem sonucu',
                        html: '<b style="line-height:35px">'+m+'</b>',
                        confirmButtonText: 'Tamam'
                    });
                    $.unblockUI();
                });
            }
        })
    };

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post("examStatus", {sinav_id: id, durum: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post("examStatus", {sinav_id: id, durum: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };


    $.otoStatus = function( id, condition) {
        if(condition == 1){
            $.post("examOtoStatus", {sinav_id: id, otodurum: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post("examOtoStatus", {sinav_id: id, otodurum: 1}, function (response) {
                $('#button-refresh').trigger('click');
                if(response=='false'){
                   Swal.fire({
                      icon: 'info',
                      title: 'DAHA FAZLA SINAVI OTOMATİK HALE GETİREMEZSİNİZ',                      
                      confirmButtonText: 'Tamam'
                   });
              }
            });
        }
    };

    $.masStatus = function( id, condition) {
        if(condition == 1){
            $.post("examMasStatus", {sinav_id: id, durum: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post("examMasStatus", {sinav_id: id, durum: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };

    /*******     Sinav fitreleme(arama) Bölümü      *******/
    $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#paket').empty();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#paket').append("<option selected disabled>Sınav Paketi Seçiniz</option>");

        paket_post = $.paket_post(donem_id);
    };

    $.paket_post = function(donem_id) {
        return $.post("paket_getir", {donem_id: donem_id}, function (response) {
            let paketler = JSON.parse(response);
            paketler.forEach(function (paket) {
                $('#paket').append(`<option value="${paket.id}">${paket.paket_adi}</option>`)
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

        $('#select-search').val('Tarih').trigger('change');
        $('#input-search').attr("value", paket_id + "/" + grup_id);
        $('#button-search').trigger('click');
    };

});
