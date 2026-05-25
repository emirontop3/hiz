$(document).ready(function(){

    let il_post    = null;
    let ilce_post  = null;
    let sinav_id   = null;
    let fmt_id     = null;
    let get_href   = null;

    $.secili_il = function (element) {
        let il_no = $(element).val();
        $('#ilceler').empty();
        $('#kurumlar').empty();
        $('#ilceler').append("<option selected disabled>İlçe Seçiniz</option>");

        il_post = $.il_post(il_no)
    };

    $.il_post = function (il_no) {
        return $.post("ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);
            ilceler.forEach(function (ilce) {
                $('#ilceler').append(`
                    <option value="${ilce.id}">${ilce.ilce_adi}</option>
                `);
            })
        });
    };

    $.secili_ilce = function(element) {
        let ilce_id = $(element).val();
        $('#kurumlar').empty();
        $('#kurumlar').append("<option selected disabled>Kurum Seçiniz</option>");

        ilce_post = $.ilce_post(ilce_id);
    };

    $.ilce_post = function(ilce_id) {
        return $.post("kurum_getir",{ilce_id: ilce_id}, function (response) {

            let kurumlar = JSON.parse(response);
            kurumlar.forEach(function (kurum) {
                $('#kurumlar').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_adi}</option>
                `);
            })
        });
    };

    $.secili_kurum = function() {
        $("#kurum-btn").attr("disabled", false);
    };

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
        sinav_id = $(element).val();
        $("#sinav-btn").attr("disabled", false);
    };

    $.fmt_secme = function (element) {
        fmt_id = $(element).val();
        let kurum_no = $('#kurumlar').val();
        let user_id  = $('#user').val();

        $("#read_opt").attr("disabled", false);
        get_href ="uniwebview://ScanData?SinavId=" + sinav_id +"&FmtId="  + fmt_id + "&KurumNo=" + kurum_no + "&UserId=" + user_id;
        console.log(get_href);

    };
    
    $.read_optical = function () {
        window.location.href = get_href;
    };

    $.kurumNext = function () {
        $(".kurum-icon").removeClass("d-none");
        $(".span-kurum").addClass("d-none");
        $(".kurum").addClass("d-none");
        $(".sinav").removeClass("d-none");
        $(".kurum-button").addClass("d-none");
        $(".sinav-button").removeClass("d-none");
        $(".step-sinav").addClass("active");
    };

    $.sinavNext = function () {
        $(".sinav-icon").removeClass("d-none");
        $(".span-sinav").addClass("d-none");
        $(".sinav").addClass("d-none");
        $(".fmt").removeClass("d-none");
        $(".sinav-button").addClass("d-none");
        $(".fmt-button").removeClass("d-none");
        $(".step-fmt").addClass("active");
    };

});
