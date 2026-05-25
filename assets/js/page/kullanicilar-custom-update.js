let secili_yayinevleri = [];
let secili_ilceler_bayi     = [];

$.save_button_status = function(status) {
    if(status === "0") {
        $("#save-btn").attr("disabled", true);
    }else {
        $("#save-btn").attr("disabled", false);
    }
};

// Yayınevi şeçme işlemi
$.yayinevi = function(e) {
    let id   = e.value;
    let text = $("#yayinevi").find("option:selected").text();
    let temp = [];
    temp.push(text, id);

    let add_publisher = $.controlSamePublisher(temp);

    if(add_publisher){
        secili_yayinevleri.push(add_publisher);
    }

    $.controlPublisherArray();

    $.writePublisherHtml(secili_yayinevleri);

    $('.hide-publisher').empty();
    secili_yayinevleri.forEach(function (publish, index) {
        $('.hide-publisher').append(`<input type="checkbox" style="display:none" name="yayinevleri[]" value="${publish[1]}" checked="checked"/>`);
    })
};

$.controlSamePublisher = function(temp) {
    let controlTemp = [];
    controlTemp = temp;

    $.each(secili_yayinevleri, function (index, yayinevi) {
        if(yayinevi[1] === controlTemp[1] ) {
            alert("Bu yayınevi daha önce eklenmiştir!");
            controlTemp = null;
            return false;
        }
    });
    return controlTemp;
};


$.deletePublisher = function(id) {
    secili_yayinevleri.splice(id, 1);
    $.controlPublisherArray();

    $('.hide-publisher').empty();
    secili_yayinevleri.forEach(function (publish, index) {
        $('.hide-publisher').append(`<input type="checkbox" style="display:none" name="yayinevleri[]" value="${publish[1]}" checked="checked"/>`);
    });


    $.writePublisherHtml(secili_yayinevleri);
};


$.writePublisherHtml = function(publishers) {
    $('.choose-publichers').empty();

    console.log(publishers)

    setTimeout(function(){
        $.each(publishers, function (index, publish) {
            $('.choose-publichers').append(`
                <div class="chip fade show mr-1 mb-1" id="chipDismissible${index}">
                    ${publish[0]} <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}" onclick="$.deletePublisher(${index})" type="button"><i class="material-icons">cancel</i></button>
                </div>`);
        });
    }, 200);
};

$.controlPublisherArray = function() {
    if (typeof secili_yayinevleri !== 'undefined' && secili_yayinevleri.length > 0) {
        $.save_button_status("1");
    }else {
        $.save_button_status("0");
    }
};




let yetki = $('#yetki').attr('value');
console.log(yetki);

if(yetki === "2") {
    let secili_iller_bolge_yone = [];
    let item_bol_yon = $('#items-bol-yon').val();
    let bol_yon = item_bol_yon.split("/");
    bol_yon.splice(-1, 1);

    bol_yon.map(function (citys) {
        let temp = citys.split("|")
        secili_iller_bolge_yone.push(temp)
    });

    $.bol_yon_il = function(id) {
        let il_no = id.value;
        let selectedCity = $("#bolge_yonetici_il").find("option:selected").text();
        let temp = [];
        temp.push(selectedCity, il_no);


        let add_city = $.controlSameCity(temp);

        if(add_city){
            secili_iller_bolge_yone.push(add_city);
        }

        $.writeCityHtml(secili_iller_bolge_yone);

        $('.hide-bolge-bayi').empty();
        secili_iller_bolge_yone.forEach(function (citys, index) {
            $('.hide-bolge-bayi').append(`<input type="checkbox" style="display:none" name="iller[]" value="${citys[1]}" checked="checked"/>`);
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

        $('.hide-bolge-bayi').empty();
        secili_iller_bolge_yone.forEach(function (citys, index) {
            $('.hide-bolge-bayi').append(`<input type="checkbox" style="display:none" name="iller[]" value="${citys[1]}" checked="checked"/>`);
        });


        $.writeCityHtml(secili_iller_bolge_yone);
    };

    $.writeCityHtml = function(citys) {
        $('.choose-bol-yon').empty();

        setTimeout(function(){
            $.each(citys, function (index, il) {
                $('.choose-bol-yon').append(`
                    <div class="chip fade show mr-1 mb-1" id="chipDismissible${index}">
                        ${il[0]} <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}" onclick="$.deleteCityBolgeYon(${index})" type="button"><i class="material-icons">cancel</i></button>
                    </div>`);
            });
        }, 200);
    };

}
else if(yetki === "4") {
    let il_no   = $('.mem-ilce-id').attr("data-il");
    let ilce_id = parseInt($('.mem-ilce-id').attr("value"));

    $('.ilce-mem').append('<div class="col-3 input-group mb-3"><select size="3"  id="ilce-mem" class="form-control" name="update-ilce[]" ></select></div>');

    $.post("/kullanicilar/ilce_getir", {il_no: il_no}, function (response) {
        let res = JSON.parse(response);
        res.forEach(function (re) {
            if (parseInt(re.id) === ilce_id) {
                $("#ilce-mem").append(`<option value="${re.id}" selected>${re.ilce_adi}</option>`);
            } else {
                $("#ilce-mem").append(`<option value="${re.id}">${re.ilce_adi}</option>`);
            }
        });
    });

    $.mem_il_secim = function(e) {
        $("#ilce-mem").empty();
        let il_no = $(e).val();

        $.post("/kullanicilar/ilce_getir" ,{il_no: il_no},function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#ilce-mem").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });

        });

    };

}
else if(yetki === "5") {

    let item_bayi = $('#items-bayi').val();
    let bayiler = item_bayi.split("/");
    bayiler.splice(-1, 1);

    bayiler.map(function (distrits) {
        let temp = distrits.split("|")
        secili_ilceler_bayi.push(temp)
    });

    let il_no = parseInt($('#bayi-il-text').attr("value"));

    // $('#bayi-il').val(il_no).trigger('change');
    $.bayi_post = function(element) {
        $("#bayi-ilce").empty();
        let il_no = $(element).val();

        $.post("/kullanicilar/ilce_getir" ,{il_no: il_no},function (response) {
            let res = JSON.parse(response);

            res.forEach(function (ilce) {
                $("#bayi-ilce").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });

        });
    };

    $.bayi_ilce = function(id) {
        let ilce_id = id.value;
        let selectedCity = $("#bayi-ilce").find("option:selected").text();
        let il_no  = $( "#bayi-il" ).val();
        let il_adi = $("#bayi-il option:selected").text().trim();
        let temp = [];
        temp.push(il_no, il_adi, ilce_id, selectedCity);

        let add_district = $.controlSameDistrict(temp);

        if(add_district){
            secili_ilceler_bayi.push(add_district);
        }

        $.writeDistrictHtml(secili_ilceler_bayi);

        $('.hide-bayi').empty();
        secili_ilceler_bayi.forEach(function (district, index) {
            $('.hide-bayi').append(`<input type="checkbox" style="display:none" name="ilceler[]" value="${district[0]}/${district[2]}" checked="checked"/>`);
        })

    };


    $.controlSameDistrict = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_ilceler_bayi, function (index, ilce) {
            // console.log(ilce);
            // console.log(controlTemp);
            if(ilce[3] === controlTemp[3] && ilce[1] === controlTemp[1]) {
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

    $.writeDistrictHtml = function(districts) {
        $('.choose-bayi').empty();
        // console.log(districts);

        setTimeout(function(){
            $.each(districts, function (index, ilce) {
                $('.choose-bayi').append(`
        			<div class="chip fade show mr-1 mb-1" id="chipDismissible${index}">
        				${ilce[1]} => ${ilce[3]}
        				<button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}"
        				onclick="$.deleteDistrictBayi(${index})" type="button">
        					<i class="material-icons">cancel</i>
        				</button>
        			</div>`);
            });
        }, 200);
    };

    $.deleteDistrictBayi = function(id) {
        secili_ilceler_bayi.splice(id, 1);

        $('.hide-bayi').empty();
        secili_ilceler_bayi.forEach(function (district, index) {
            $('.hide-bayi').append(`<input type="checkbox" style="display:none" name="ilceler[]" value="${district[0]}/${district[2]}" checked="checked"/>`);
        });


        $.writeDistrictHtml(secili_ilceler_bayi);
    };



}
else if(yetki === "6") {
    let il_post = null;
    let ilce_post = null;
    let secili_kurumlar = [];
    let il_no   = $('#kurum-text').attr("value");
    let ilce_id = parseInt($('#kurum-text').attr("data-ilce"));

    let item_kurum = $('#items-kurum').val();
    let kurumlar = item_kurum.split("/");
    kurumlar.splice(-1, 1);

    kurumlar.map(function (institution) {
        let temp = institution.split("|")
        secili_kurumlar.push(temp)
    });

    $.kurum_il_post = function(element) {
        let il_no = $(element).val();
        $('#kurum-ilce').empty();
        $('#kurum').empty();


        il_post = $.il_post(il_no);
    };

    $.il_post = function(il_no) {
        return $.post("/kullanicilar/ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);

            ilceler.forEach(function (ilce) {
                $("#kurum-ilce").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });
        });
    };

    $.kurum_ilce = function(element) {
        let ilce_id = $(element).val();
        $('#kurum').empty();

        ilce_post = $.ilce_post(ilce_id);
    };

    $.ilce_post = function(ilce_id) {
        return $.post("/kullanicilar/kurum_getir",{ilce_id: ilce_id}, function (response) {
            let kurumlar = JSON.parse(response);

            kurumlar.forEach(function (kurum) {
                $("#kurum").append(`<option value="${kurum.id}">${kurum.kurum_adi}</option>`);
            });
        });
    };

    $('#kurum-il').val(il_no).trigger('change');
    il_post.then(function () {
        $('#kurum-ilce').val(ilce_id).trigger('change');
    });

    $.kurum = function(id) {
        let kurum_no  = id.value;
        let kurum_adi = $("#kurum").find("option:selected").text().trim();
        let ilce_adi  = $("#kurum-ilce").find("option:selected").text().trim();
        let ilce_id   = $("#kurum-ilce" ).val();
        let il_adi    = $("#kurum-il option:selected").text().trim();
        let il_no     = $("#kurum-il").val();
        let temp = [];
        temp.push(il_no, il_adi, ilce_id, ilce_adi, kurum_no,kurum_adi);

        let add_institu = $.controlSameInstitu(temp);

        if(add_institu){
            secili_kurumlar.push(add_institu);
        }

        $.writeInstituHtml(secili_kurumlar);

        $('.hide-kurum').empty();
        secili_kurumlar.forEach(function (institu, index) {
            $('.hide-kurum').append(`<input type="checkbox" style="display:none" name="kurumlar[]" value="${institu[0]}/${institu[2]}/${institu[4]}" checked="checked"/>`);
        })

    };

    $.controlSameInstitu = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_kurumlar, function (index, ilce) {
            if(ilce[5] === controlTemp[5] ) {
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

    $.deleteInstitu = function(id) {
        secili_kurumlar.splice(id, 1);

        $('.hide-kurum').empty();
        secili_kurumlar.forEach(function (institu, index) {
            $('.hide-kurum').append(`<input type="checkbox" style="display:none" name="kurumlar[]" value="${institu[0]}/${institu[2]}/${institu[4]}" checked="checked"/>`);
        });


        $.writeInstituHtml(secili_kurumlar);
    };

    $.writeInstituHtml = function(institu) {
        $('.choose-kurum').empty();

        setTimeout(function(){
            $.each(institu, function (index, kurum) {
                $('.choose-kurum').append(`
                    <div class="chip fade show mr-1 mb-1" id="chipDismissible${index}">
                        ${kurum[1]} => ${kurum[3]} => ${kurum[5]}
                        <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}"
                        onclick="$.deleteInstitu(${index})" type="button">
                            <i class="material-icons">cancel</i>
                        </button>
                    </div>`);
            });
        }, 200);
    };

}
else if(yetki === "7") {

    let il_post = null;
    let ilce_post = null;
    let secili_kurum_subeler = [];
    let il_no   = $('#kurum-text').attr("value");
    let ilce_id = parseInt($('#kurum-text').attr("data-ilce"));
    let kurum_no =  $("#kurum-text").data("kurum");

    let item_kurum = $('#items-kurum').val();
    let kurumlar = item_kurum.split("/");
    kurumlar.splice(-1, 1);

    kurumlar.map(function (institution) {
        let temp = institution.split("|")
        secili_kurum_subeler.push(temp)
    });
    // console.log(secili_kurum_subeler);

    $.kurum_il_post = function(element) {
        let il_no = $(element).val();
        $('#kurum-ilce').empty();
        $('#kurum').empty();


        il_post = $.il_post(il_no);
    };

    $.il_post = function(il_no) {
        return $.post("/kullanicilar/ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);

            ilceler.forEach(function (ilce) {
                $("#kurum-ilce").append(`<option value="${ilce.id}">${ilce.ilce_adi}</option>`);
            });
        });
    };

    $.kurum_ilce = function(element) {
        let ilce_id = $(element).val();
        $('#kurum').empty();

        ilce_post = $.ilce_post(ilce_id);
    };

    $.ilce_post = function(ilce_id) {
        return $.post("/kullanicilar/kurum_getir",{ilce_id: ilce_id}, function (response) {
            let kurumlar = JSON.parse(response);

            kurumlar.forEach(function (kurum) {
                $("#kurum").append(`<option value="${kurum.id}">${kurum.kurum_adi}</option>`);
            });
        });
    };

    $('#kurum-il').val(il_no).trigger('change');
    il_post.then(function () {
        $('#kurum-ilce').val(ilce_id).trigger('change');
        ilce_post.then(function () {
            $('#kurum').val(kurum_no).trigger('change');
        })
    });

    $.ogretmen_sinif_secim = function() {
        $("#sube").empty();

        $.post("/kullanicilar/sube_getir", {}, function (response) {
            let res = JSON.parse(response);

            res.forEach(function (sube) {
                $("#sube").append(`<option value="${sube.id}">${sube.sube_adi}</option>`);
            });

        });
    };

    $.ogretmen_sube_secim = function (id) {
        let sinif    = $("#sinif").val();
        if(parseInt(sinif) > 0) {
            let sube_id   = id.value;
            let sube_adi  = $("#sube").find("option:selected").text();
            let kurum_adi = $("#kurum").find("option:selected").text();
            let kurum_no  = $("#kurum").val();
            let ilce_id   = $("#kurum-ilce").val();
            let il_no     = $("#kurum-il").val();

            let temp = [];
            temp.push(il_no, ilce_id, kurum_no, kurum_adi, sinif, sube_id,sube_adi);

            let add_branch = $.controlSameBranch(temp);

            if(add_branch){
                secili_kurum_subeler.push(add_branch);
            }

            $.addBranchHtml(secili_kurum_subeler);

            $('.hide-kurum-sube').empty();
            secili_kurum_subeler.forEach(function (sube, index) {
                $('.hide-kurum-sube').append(`<input type="checkbox" style="display:none" name="subeler[]" value="${sube[0]}/${sube[1]}/${sube[2]}/${sube[4]}/${sube[5]}" checked="checked"/>`);
            });

        } else {
            iziToast.error({
                title: "İşlem Başarısız",
                message: "Lütfen Önce bir sınıf şeçiniz.",
                position: "topCenter"
            });
        }

    };

    $.controlSameBranch = function(temp) {
        let controlTemp = [];
        controlTemp = temp;

        $.each(secili_kurum_subeler, function (index, sube) {
            console.log("temp");
            console.log(controlTemp);
            console.log("sube");
            console.log(sube);
            if( sube[3] === controlTemp[3] && sube[4] === controlTemp[4] && sube[5] === controlTemp[5]) {
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

    $.addBranchHtml = function(subeler, ) {
        $('.choose-kurum-sube').empty();

        setTimeout(function () {
            subeler.forEach(function (sube, index) {
                $('.choose-kurum-sube').append(`
                        <div class="chip fade show mr-1 mb-1" id="chipDismissible${index}"> ${sube[3]} => ${sube[4]}. Sinif=> ${sube[6]}
                            <button class="close" data-index="${index}" data-dismiss="alert"  data-target="#chipDismissible${index}" onclick="$.deleteSinif(${index})" type="button">
                                <i class="material-icons">cancel</i>
                            </button>
                        </div>`);
            });
        },200);
    };

    $.deleteSinif = function(id) {
        secili_kurum_subeler.splice(id, 1);

        $.addBranchHtml(secili_kurum_subeler);

        $('.hide-kurum-sube').empty();
        secili_kurum_subeler.forEach(function (sube, index) {
            $('.hide-kurum-sube').append(`<input type="checkbox" style="display:none" name="subeler[]" value="${sube[0]}/${sube[1]}/${sube[2]}/${sube[4]}/${sube[5]}" checked="checked"/>`);
        })
    };

}

$("#yayinevi").on("change",function(){
    $.yayinevi($(this)[0]);
});

$('.deletePub').on('click', function() {
    $.deletePublisher($(this).attr('_flag'));
});

$( "#form_post" ).submit(function( event ) {

    if(yetki === '2' ){
        var div="hide-bolge-bayi";
    }else if(yetki === '5' ){
        var div="hide-bayi";
    }else if(yetki === '6' ){
        var div="hide-kurum";
    }else if(yetki === '7' ){
        var div="hide-kurum-sube";
    }



    var div_hide = $("."+div).children().length;

    if(yetki === '3' ){
        var div_hide=1;
    }else if(yetki === '4' ){
        var div_hide=1;
    }
    else if(yetki === '1' ){
        var div_hide=1;
    }
    if(div_hide==0){
        alert("Lütfen seçim yapmadan kaydetmeyiniz.");
        return false;
    }


});
