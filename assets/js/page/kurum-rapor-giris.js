$(document).ready(function(){

    let il_post    = null;
    let ilce_post  = null;

    $.secili_il = function (element) {
        let il_no = $(element).val();
        $('#ilceler').empty();
        $('#kurumlar').empty();
        $('#ilceler').append("<option selected value=\"\">İlçe Seçiniz</option>");

        il_post = $.il_post(il_no)
    };

    $.il_post = function (il_no) {
        return $.post("/kurum_rapor_giris/ilce_getir",{il_no: il_no}, function (response) {
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

        ilce_post = $.ilce_post(ilce_id);
    };

    $.ilce_post = function(ilce_id) {
        return $.post("/kurum_rapor_giris/kurum_getir",{ilce_id: ilce_id}, function (response) {
            $('#kurumlar').append("<option selected value=\"\">Kurum Seçiniz</option>");
            let kurumlar = JSON.parse(response);
            kurumlar.forEach(function (kurum) {
                $('#kurumlar').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_adi}</option>
                `);
            })
        });
    };

    if ($("#cookie").length > 0){
        let cookie_info = $("#cookie").val().split("/");
        $('#il').val(cookie_info[0]).trigger('change');
        il_post.then(function () {
            $('#ilceler').val(cookie_info[1]).trigger('change');
            ilce_post.then(function () {
                $('#kurumlar').val(cookie_info[2]).trigger('change');
            })
        });
    }
});
