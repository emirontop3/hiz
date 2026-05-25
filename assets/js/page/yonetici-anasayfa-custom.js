$(document).ready(function(){

    let paket_post = null;
    let grup_post  = null;
    let sinav_post = null;

    $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#paket').empty();
        $('#grup').empty();
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
        return $.post("grup_getir", {paket_id: paket_id}, function (response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function (grup) {
                $('#grup').append(`
                    <option value="${grup.id}">${grup.grup_adi}</option>
              `)
            })
        });
    };

    $.secili_grup = function(element) {
        let grup_id = $(element).val();
        $('#sinavlar').empty();
        $('#sinavlar').append("<option selected disabled>Sınav Seçiniz</option>");

        sinav_post = $.sinav_post(grup_id);
    };

    $.sinav_post = function(grup_id) {
        return $.post("sinav_getir",{grup_id: grup_id}, function (response) {
            let sinavlar = JSON.parse(response);

            sinavlar.forEach(function (sinav) {
                $('#sinavlar').append(`
                    <option value="${sinav.id}">${sinav.sinav_adi}</option>
                `);
            })
        });
    };

    $.secili_sinav = function(element) {
        let sinav_id  = $(element).val();
        let sinav_adi = $(element).children("option:selected").text();
        $('#exam-name').text(sinav_adi);

        let bayiAdlari    = [];
        let bayiSonuclari = [];

        $.post("best_seller", {sinav_id: sinav_id}, function (response) {
            let bayiler = JSON.parse(response);

            bayiler.forEach(function (bayi) {
                bayiAdlari.push(bayi.isim);
                bayiSonuclari.push(bayi.toplam);
            });
            showGraph("myChart", bayiAdlari, '# Bayi Veri Girişleri', bayiSonuclari, 'rgba(255,0,0,0.4)', 'rgba(255,0,0,1)');
        });

        $.post("exam_info", {sinav_id: sinav_id},function (response) {
            let exam_info = JSON.parse(response);

            $('#exam-city').text(exam_info[0].il);
            $('#exam-district').text(exam_info[0].ilce);
            $('#exam-institution').text(exam_info[0].kurum);
            $('#exam-student').text(exam_info[0].ogrenci);
        });

    };

    // son eklenen sınav verisine göre alanları otomatik doldurma
    let exam_info = $("#exam-info").val().split("/");

    $('#sinav-donemi').val(exam_info[0]).trigger('change');
    paket_post.then(function () {
        $('#paket').val(exam_info[1]).trigger('change');

        grup_post.then(function () {
            $('#grup').val(exam_info[2]).trigger('change');
            sinav_post.then(function () {
                $('#sinavlar').val(exam_info[3]).trigger('change');
            })
        })
    });

    let c = $('.counter-aktif-degerlendirme').text();
    if (parseInt(c) > 0) {
        $('.counter-aktif-degerlendirme').next().addClass('fa-spin')
    }
});

function showGraph (target, labels, mylabel, data, color, borderColor) {
    let chartdata = {
        labels: labels,
        datasets: [{
            label: mylabel,
            data: data,
            backgroundColor: color,
            borderColor: borderColor
        }]
    };

    let graphTarget = $("#" + target);
    let barGraph = new Chart(graphTarget, {
        type: 'line',
        data: chartdata,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

}