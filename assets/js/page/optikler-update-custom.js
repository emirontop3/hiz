$(document).ready(function() {
    let count = 0;

    $.removeElement = function (element) {

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

});
