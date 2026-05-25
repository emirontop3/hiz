$(document).ready(function(){

    let secili_iller_bolge_yone = [];
    let secili_ilceler_bayi     = [];
    let secili_kurumlar         = [];
    let secili_subeler          = [];

	$('#save-btn').click(function () {
        $(this).addClass("d-none");
        $('.spiner').removeClass("d-none");
    });

    $.yetki = function (id) {
        let yetki_id = id.value;

        if(yetki_id === "1") {
            $.clean_input();
            $.yonetici();
            $.save_button_status("1");
        } else if(yetki_id === "2") {
            $.clean_input();
            $.bolge_yoneticisi();
            $.save_button_status("0");
        } else if(yetki_id === "3") {
            $.clean_input();
            $.il_mem();
            $.save_button_status("0");
        } else if(yetki_id === "4") {
            $.clean_input();
            $.ilce_mem();
            $.save_button_status("0");
        } else if(yetki_id === "5") {
            $.clean_input();
            $.bayi();
            $.save_button_status("0");
        } else if(yetki_id === "6") {
            $.clean_input();
            $.kurum();
            $.save_button_status("0");
        }else if(yetki_id === "7") {
            $.clean_input();
            $.ogretmen();
            $.save_button_status("0");
        }
    };

    $.clean_input = function() {
        $(".content").empty();
        $(".hide-check").empty();
        secili_iller_bolge_yone = [];
        secili_ilceler_bayi     = [];
        secili_kurumlar         = [];
        secili_subeler          = [];
    };

    $.save_button_status = function(status) {
        if(status === "0") {
            $("#save-btn").attr("disabled", true);
        }else {
            $("#save-btn").attr("disabled", false);
        }
    };

    // Yönetici şeçme işlemi eventleri
    $.yonetici = function () {
        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-danger" ><b>Dikkkat!! kendinizle aynı yetkilere sahip bir kullanıcı atamak üzeresiniz.</b></p>
            </div>`
        );
    };
    // Yönetici şeçme işlemi eventleri bitiş

    /***** Bölge yöneticisi şeçme işlemi eventleri  *****/
    $.bolge_yoneticisi = function () {

        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-warning" ><b>Bu yönetici için birkaç il seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-6 input-group mb-3"><select id="bolge_yonetici_il" onchange="$.bol_yon_il(this)" size="3" class="form-control">
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div><div class="col-6 iller_sira"></div></div>`
        );

        $("#bolge_yonetici_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);
            res.forEach(function (re) {
                $("#bolge_yonetici_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });

    };

    $.bol_yon_il = function(id) {
        let il_no = id.value;
        let selectedCity = $("#bolge_yonetici_il").find("option:selected").text();
        let temp = [];
        temp.push(selectedCity, il_no);


        let add_city = $.controlSameCity(temp);

        if(add_city){
            secili_iller_bolge_yone.push(add_city);
        }

        $.controlCitytArray();

        $.writeCityHtml(secili_iller_bolge_yone);

        $('.hide-check').empty();
        secili_iller_bolge_yone.forEach(function (citys, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="iller[]" value="${citys[1]}" checked="checked"/>`);
        })

    };

    $.controlSameCity = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_iller_bolge_yone, function (index, il) {
            if(il[1] === controlTemp[1] ) {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Bu il daha önce zaten eklenmiş!",
                    position: "topCenter"
                });
                controlTemp = null;
                return false;
            }
        });
        return controlTemp;
    };

    $.deleteCityBolgeYon = function(id) {
        secili_iller_bolge_yone.splice(id, 1);
        $.controlCitytArray();

        $('.hide-check').empty();
        secili_iller_bolge_yone.forEach(function (citys, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="iller[]" value="${citys[1]}" checked="checked"/>`);
        });


        $.writeCityHtml(secili_iller_bolge_yone);
    };

    $.writeCityHtml = function(citys) {
        $('.iller_sira').empty();

        setTimeout(function(){
            $.each(citys, function (index, il) {
                $('.iller_sira').append(`
                    <div class="chip fade show mr-1 mb-1" id="chipDismissible${index}">
                        ${il[0]} <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}" onclick="$.deleteCityBolgeYon(${index})" type="button"><i class="material-icons">cancel</i></button>
                    </div>`);
            });
        }, 200);
    };

    $.controlCitytArray = function() {
        if (typeof secili_iller_bolge_yone !== 'undefined' && secili_iller_bolge_yone.length > 0) {
            $.save_button_status("1");
        }else {
            $.save_button_status("0");
        }
    };

    /***** Bölge yöneticisi şeçme işlemi eventleri Bitiş  *****/

    // il milli eğitim müdürü işlemi eventleri
    $.il_mem = function() {
        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-info" ><b>İl Milli Eğitim Müdürü için sadece bir il seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-8 input-group mb-3"><select name="mem_il" id="mem_il" size="3" class="form-control" onchange="$.mem_il_secim()" required>
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div></div>`
        );

        $("#mem_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);

            res.forEach(function (re) {
                $("#mem_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });

    };

    $.mem_il_secim = function() {
        $.save_button_status("1");
    };

    // il milli eğitim müdürü işlemi eventleri bitiş

    // ilçe milli eğitim müdürü işlemi eventleri
    $.ilce_mem = function() {
        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-info" ><b>İlçe Milli Eğitim Müdürü için sadece bir ilçe seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-6 input-group mb-3"><select name="mem_il" id="ilce_mem_il" onchange="$.mem_ilce(this)" size="3" class="form-control" required>
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div><div class="col-6"><select name="mem_ilce" id="ilce_sira_mem" size="3" onchange="$.mem_ilce_secim()" class="form-control" required>
                <option disabled="disabled" selected>İlçe seçiniz</option>
            </select></div></div>`
        );

        $("#ilce_mem_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);

            res.forEach(function (re) {
                $("#ilce_mem_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });
    };

    $.mem_ilce = function(il_no) {
        $("#ilce_sira_mem").empty();

        $.post("ilce_getir" ,{il_no: il_no.value},function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#ilce_sira_mem").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });

        });

    };

    $.mem_ilce_secim = function() {
        $.save_button_status("1");
    };

    /***** ilçe milli eğitim müdürü işlemi eventleri bitiş *****/

    /***** Bayi işlemi eventleri     *****/
    $.bayi = function() {

        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-warning" ><b>Bu yönetici için birkaç ilçe seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-md-3 input-group mb-3"><select name="bayi_il" id="bayi_il" onchange="$.bayi_ilce(this)" size="3" class="form-control" required>
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div><div class="col-md-3 input-group mb-3"><select name="mem_ilce" onchange="$.bayi_ilce_secim(this)" id="ilce_sira_bayi" size="3" class="form-control" required>
                <option disabled="disabled" selected>İlçe seçiniz</option>
            </select></div><div class="row"><div class="col-md-12 bayi-secili-ilceler"></div></div></div>`
        );

        $("#bayi_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);

            res.forEach(function (re) {
                $("#bayi_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });

    };

    $.bayi_ilce = function(il_no) {

        $("#ilce_sira_bayi").empty();

        $('#ilce_sira_bayi').attr('data-il',il_no.value);

        $.post("ilce_getir", {il_no: il_no.value}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#ilce_sira_bayi").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });

            $("#ilce_sira_bayi").prepend(`<option value="0">Hepsi</option>`);
        });

    };

    $.tetikle = function(list) {
        list.forEach(function (li) {
             $('#ilce_sira_bayi').val(li).trigger("change");
        })

    };

    $.bayi_ilce_secim = function(id) {

        if(id.value === "0"){
            let optionlist = [];
            $("#ilce_sira_bayi option").each(function(){
                // Add $(this).val() to your list
                if($(this).val() !== "0"){
                    optionlist.push($(this).val())
                }
            });
            $.tetikle(optionlist);
        }else {
            let ilce_id          = id.value;
            let selectedDistrict = $(id).find("option:selected").text();
            let il_no            = $(id).attr('data-il');
            let selectedCity     = $("#bayi_il").find("option:selected").text();

            let temp = [];
            temp.push(il_no, selectedCity, ilce_id, selectedDistrict);

            let add_district = $.controlSameDistrict(temp);

            if(add_district){
                secili_ilceler_bayi.push(add_district);
            }

            $.controlDistrictArray();
            $.addDistrictHtml(secili_ilceler_bayi);



            $('.hide-check').empty();
            secili_ilceler_bayi.forEach(function (district, index) {
                $('.hide-check').append(`<input type="checkbox" style="display:none" name="ilceler[]" value="${district[0]}/${district[2]}" checked="checked"/>`);
            })
        }

    };

    $.addDistrictHtml = function(bayi) {
        // console.log(bayi);

        setTimeout(function () {
            $('.bayi-secili-ilceler').empty();
            bayi.forEach(function (ilce, index) {
                $('.bayi-secili-ilceler').append(`<div class="chip fade show mr-1 mb-1" id="chipDismissible${ilce[2]}"> ${ilce[1]} => ${ilce[3]} <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${ilce[2]}" onclick="$.deleteDistrictBayi(${index})" type="button"><i class="material-icons">cancel</i></button></div>`);
            });
        },200)
    };

    $.controlSameDistrict = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_ilceler_bayi, function (index, il) {
            if(il[2] === controlTemp[2] ) {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Bu ilçe daha önce zaten eklenmiş!",
                    position: "topCenter"
                });
                controlTemp = null;
                return false;
            }
        });
        return controlTemp;
    };

    $.deleteDistrictBayi = function(id) {
        secili_ilceler_bayi.splice(id, 1);

        $.addDistrictHtml(secili_ilceler_bayi);
        $.controlDistrictArray();

        $('.hide-check').empty();
        secili_ilceler_bayi.forEach(function (district, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="ilceler[]" value="${district[0]}/${district[2]}" checked="checked"/>`);
        })
    };

    $.controlDistrictArray = function() {
        if (typeof secili_ilceler_bayi !== 'undefined' && secili_ilceler_bayi.length > 0) {
            $.save_button_status("1");
        }else {
            $.save_button_status("0");
        }
    };

    /***** Bayi işlemi eventleri Bitiş  *****/

    /***** Kurum Yöneticisi işlemleri eventleri  *****/

    $.kurum = function() {
        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-success" ><b>Bu yönetici için tek bir ilçede birkaç kurum seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-3 input-group mb-3"><select name="kurum_il" id="kurum_il" onchange="$.kurum_ilce(this)" size="3" class="form-control" required>
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div> <div class="col-3 input-group mb-3"><select name="kurum_ilce" onchange="$.kurum_ilce_secim(this)" id="ilce_sira_kurum" size="3" class="form-control" required>
                <option disabled="disabled" selected>İlçe seçiniz</option>
            </select></div><div class="col-6 input-group mb-3"><select name="kurum_adi" onchange="$.kurum_adi_secim(this)" id="sira_kurum" size="3" class="form-control" required>
                <option disabled="disabled" selected>Kurum seçiniz</option>
            </select></div><div class="col-12 input-group mb-3 secili-kurumlar"></div></div>`
        );

        $("#kurum_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);

            res.forEach(function (re) {
                $("#kurum_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });
    };

    $.kurum_ilce = function(il_no) {
        $('.secili-kurumlar').empty();
        secili_kurumlar = [];
        $("#ilce_sira_kurum").empty();
        $("#sira_kurum").empty();
        $('#ilce_sira_kurum').attr('data-il',il_no.value);

        $.post("ilce_getir", {il_no: il_no.value}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#ilce_sira_kurum").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });
        });
    };

    $.kurum_ilce_secim = function(ilce_id) {
        $('.secili-kurumlar').empty();
        secili_kurumlar = [];
        $("#sira_kurum").empty();
        $('#sira_kurum').attr('data-ilce',ilce_id.value);

        $.post("kurum_getir", {ilce_id: ilce_id.value}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (kurum) {
                $("#sira_kurum").append(`<option value="${kurum.id}">${kurum.kurum_adi}</option>`);
            });

        });

    };

    $.kurum_adi_secim = function(kurum_id) {

        let id                  = kurum_id.value;
        let il_no               = $('#ilce_sira_kurum').attr('data-il');
        let ilce_id             = $('#sira_kurum').attr('data-ilce');
        let selectedInstitution = $("#sira_kurum").find("option:selected").text();

        let temp = [];
        temp.push(il_no, ilce_id, id, selectedInstitution);

        let add_institution = $.controlSameInstitution(temp);

        if(add_institution){
            secili_kurumlar.push(add_institution);
        }
        //console.log(secili_kurumlar);
        $.controlInstitutionArray();
        $.addInstitutionHtml(secili_kurumlar);

        $('.hide-check').empty();
        secili_kurumlar.forEach(function (kurum, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="kurumlar[]" value="${kurum[0]}/${kurum[1]}/${kurum[2]}" checked="checked"/>`);
        })

    };

    $.controlSameInstitution = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_kurumlar, function (index, kurum) {
            if(kurum[2] === controlTemp[2] ) {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Bu kurum daha önce zaten eklenmiş!",
                    position: "topCenter"
                });
                controlTemp = null;
                return false;
            }
        });
        return controlTemp;
    };

    $.addInstitutionHtml = function(kurumlar) {
        $('.secili-kurumlar').empty();

        setTimeout(function () {
            kurumlar.forEach(function (kurum, index) {
                $('.secili-kurumlar').append(`<div class="chip fade show mr-1 mb-1" id="chipDismissible${kurum[2]}"> ${kurum[3]}<button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${kurum[2]}" onclick="$.deleteKurum(${index})" type="button"><i class="material-icons">cancel</i></button></div>`);
            });
        },200);
    };

    $.deleteKurum = function(id) {
        secili_kurumlar.splice(id, 1);
        //console.log(secili_kurumlar);
        $.addInstitutionHtml(secili_kurumlar);
        $.controlInstitutionArray();

        $('.hide-check').empty();
        secili_kurumlar.forEach(function (kurum, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="kurumlar[]" value="${kurum[0]}/${kurum[1]}/${kurum[2]}" checked="checked"/>`);
        })
    };


    $.controlInstitutionArray = function() {
        if (typeof secili_kurumlar !== 'undefined' && secili_kurumlar.length > 0) {
            $.save_button_status("1");
        }else {
            $.save_button_status("0");
        }
    };


    /***** Kurum Yöneticisi işlemleri eventleri Bitiş  *****/

    /***** Öğretmen işlemleri eventleri   *****/

    $.ogretmen = function() {
        $(".content").append(
            `<div class="input-group mb-3">
                <p class="text-center text-success" ><b>Bu yönetici için bir kurum birkaç sınıf ve şube seçilebilir</b></p>
            </div>`
        );

        $(".content").append(
            `<div class="row"><div class="col-3 input-group mb-3"><select name="ogretmen_il" id="ogretmen_il" onchange="$.ogretmen_ilce(this)" size="3" class="form-control" required>
                <option disabled="disabled" selected>İl seçiniz</option>
            </select></div> <div class="col-3 input-group mb-3"><select name="ogretmen_ilce" onchange="$.ogretmen_ilce_secim(this)" id="ilce_sira_ogretmen" size="3" class="form-control" required>
                <option disabled="disabled" selected>İlçe seçiniz</option>
            </select></div> <div class="col-5 input-group mb-3"><select name="ogretmen_kurum_adi" onchange="$.ogretmen_kurum_adi_secim(this)" id="sira_kurum_ogretmen" size="3" class="form-control" required>
                <option disabled="disabled" selected>Kurum seçiniz</option>
            </select></div><div class="col-3 input-group mb-3"><select name="ogretmen_sinif" onchange="$.ogretmen_sinif_secim(this)" id="sira_sinif_ogretmen" size="3" class="form-control" required>
                <option disabled="disabled" selected>Sinif seçiniz</option>
            </select></div><div class="col-3 input-group mb-3 sube"><select name="sube" id="sube_secim" onchange="$.ogretmen_sube_secim(this)" size="3" class="form-control">
            <option disabled="disabled" selected>Sube seçiniz</option></select></div><div class="col-6 input-group mb-3 secili_subeler"></div></div>`
        );

        $("#ogretmen_il").focus();

        $.post("il_getir", {} ,function (response) {
            let res = JSON.parse(response);

            res.forEach(function (re) {
                $("#ogretmen_il").append( `<option value="${re.il_no}">${re.il_adi}</option>`);
            })
        });
    };

    $.ogretmen_ilce = function(il_no) {

        $('#ogretmen_il').attr("disabled", true);

        $("#ilce_sira_ogretmen").empty();
        $("#sira_kurum_ogretmen").empty();
        $("#sira_sinif_ogretmen").empty();
        $("#sube_secim").empty();
        $('#ilce_sira_ogretmen').attr('data-il',il_no.value);

        $.post("ilce_getir", {il_no: il_no.value}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#ilce_sira_ogretmen").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });
        });
    };

    $.ogretmen_ilce_secim = function(ilce_id) {

        $('#ilce_sira_ogretmen').attr("disabled", true);

        $("#sira_kurum_ogretmen").empty();
        $('#sira_kurum_ogretmen').attr('data-ilce',ilce_id.value);

        $.post("kurum_getir", {ilce_id: ilce_id.value}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (kurum) {
                $("#sira_kurum_ogretmen").append(`<option value="${kurum.id}">${kurum.kurum_adi}</option>`);
            });

        });

    };

    $.ogretmen_kurum_adi_secim = function(kurum_id) {

        $('#sira_kurum_ogretmen').attr("disabled", true);

        $("#sira_sinif_ogretmen").empty();
        $('#sira_sinif_ogretmen').attr('data-kurum',kurum_id.value);
        $('#sira_sinif_ogretmen').attr('data-kurum-adi',$("#sira_kurum_ogretmen").find("option:selected").text());

        for(let sinif=1; sinif<13; sinif++) {
            $("#sira_sinif_ogretmen").append(`<option value="${sinif}">${sinif}. sınıf</option>`)
        }
        $("#sira_sinif_ogretmen").append(`<option value="13">Mezun</option>`)

    };

    $.ogretmen_sinif_secim = function(sinif_id) {
        $("#sube_secim").empty();
        $('#sube_secim').attr('data-sinif',sinif_id.value);
        $.post("sube_getir", {}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (sube) {
                $("#sube_secim").append(`<option value="${sube.id}">${sube.sube_adi}</option>`);
            });

        });
    };

    $.ogretmen_sube_secim = function(sube_id) {
        let id        = sube_id.value;
        let il_no     = $('#ilce_sira_ogretmen').attr('data-il');
        let ilce_id   = $('#sira_kurum_ogretmen').attr('data-ilce');
        let kurum_id  = $('#sira_sinif_ogretmen').attr('data-kurum');
        let kurum_adi = $('#sira_sinif_ogretmen').attr('data-kurum-adi');
        let sinif     = $('#sube_secim').attr('data-sinif');
        let sube      = $("#sube_secim").find("option:selected").text();

        let temp = [];
        temp.push(il_no, ilce_id, kurum_id, kurum_adi, sinif, id, sube);

        let add_branch = $.controlSameBranch(temp);

        if(add_branch){
            secili_subeler.push(add_branch);
        }

        $.controlBranchArray();
        $.addBranchHtml(secili_subeler);

        $('.hide-check').empty();
        secili_subeler.forEach(function (sube, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="subeler[]" value="${sube[0]}/${sube[1]}/${sube[2]}/${sube[4]}/${sube[5]}" checked="checked"/>`);
        })
    };

    $.addBranchHtml = function(subeler) {
        $('.secili_subeler').empty();

        setTimeout(function () {
            subeler.forEach(function (sube, index) {
                $('.secili_subeler').append(`<div class="chip fade show mr-1 mb-1" id="chipDismissible${sube[6]}"> ${sube[3]}=> ${sube[4]}. Sinif=> ${sube[6]}<button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${sube[6]}" onclick="$.deleteSinif(${index})" type="button"><i class="material-icons">cancel</i></button></div>`);
            });
        },200);
    };

    $.controlSameBranch = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_subeler, function (index, sube) {
            if(sube[5] === controlTemp[5] && sube[3] === controlTemp[3] && sube[4] === controlTemp[4]) {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Bu şube daha önce zaten eklenmiş!",
                    position: "topCenter"
                });
                controlTemp = null;
                return false;
            }
        });
        return controlTemp;
    };

    $.deleteSinif = function(id) {
        secili_subeler.splice(id, 1);

        $.addBranchHtml(secili_subeler);
        $.controlBranchArray();

        $('.hide-check').empty();
        secili_subeler.forEach(function (sube, index) {
            $('.hide-check').append(`<input type="checkbox" style="display:none" name="subeler[]" value="${sube[0]}/${sube[1]}/${sube[2]}/${sube[4]}/${sube[5]}" checked="checked"/>`);
        })

    };

    $.controlBranchArray = function() {
        if (typeof secili_subeler !== 'undefined' && secili_subeler.length > 0) {
            $.save_button_status("1");
        }else {
            $.save_button_status("0");
        }
    };

    /***** Öğretmen işlemleri eventleri Bitiş  *****/

    $.checkStatus = function( id, condition) {
        if(condition == 1){
            $.post(  "userStatus", {user_id: id, user_condition: 0}, function (response) {
                $('#button-refresh').trigger('click');
            });
        } else {
            $.post(  "userStatus", {user_id: id, user_condition: 1}, function (response) {
                $('#button-refresh').trigger('click');
            });
        }
    };

    $.deleteUser = function(id){
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
                $.post(  "delete", {delete_user: id}, function (response) {
                    // console.log(response);
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
                });
            }
        });
    };

    $.updateUser = function (id) {
        window.location.href = "update_form/" + id;
    };

    $.accessAuth = function (id) {
        window.location.href = "access_user_count/" + id;
    };

    $.noAuth = function () {
        Swal.fire({
            type: 'error',
            title: 'Yetki Geçersiz',
            text: 'Bu kullanıcını hesabına girmek için yetkiniz yoktur!!',
            footer: 'Yetki Tanımlanması için lütfen yöneticinize başvurunuz.',
            confirmButtonText: 'Tamam',
        })
    };

});
