$(document).ready(function(){

    let il_post    = null;
    let ilce_post  = null;
    let paket_post = null;
    let grup_post  = null;
    let sinav_post = null;

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

        ilce_post = $.ilce_post(ilce_id);
		if (ilce_id != '') {

		}
    };

    $.ilce_post = function(ilce_id) {
        return $.post("kurum_getir",{ilce_id: ilce_id}, function (response) {

            let kurumlar = JSON.parse(response);
            kurumlar.forEach(function (kurum) {
                $('#kurumlar').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_no} - ${kurum.kurum_adi}</option>
                `);
            })
        });
    };

	$('#inputGroupFile03').change(function() {
    var $el = $(this),
    files = $el[0].files,
    label = files[0].name;
    if (files.length > 1) {
        label = label + " ve " + String(files.length - 1) + " daha dosya"
    }
    $el.next('.custom-file-label').html(label);
	});

/*
      $('#inputGroupFile03').on('change',function(event){
          //get the file name
          var fileName = $(this).val();
          //replace the "Choose a file" label
          $(this).next('.custom-file-label').html(event.target.files[0].name);
      })
     */

	    // Kurum Numarasını Dosyadan Al //
    $("#dosyadan-al").on("change", function (e) {
        if ($('#dosyadan-al').is(':checked')) {
            $('#dosyadan-al').val('checked');
            $('#kurum-secim :input').attr("disabled", true);
        } else {
            $('#dosyadan-al').val('');
            $('#kurum-secim :input').removeAttr("disabled");
        }
    }).change();



	 // Kurum No Yaz
    $("#kurumlar").on("change", function (e) {
        $kurumno = $(this).val();
		$('#kurum_no').attr('disabled', 'disabled');
		$('#kurum-ara').val('');
    });

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

        sinav_post = $.sinav_post(grup_id);
    };

    $.sinav_post = function(grup_id) {
        return $.post("sinav_getir",{grup_id: grup_id}, function (response) {
            let sinavlar = JSON.parse(response);

            sinavlar.forEach(function (sinav) {
                $('#sinavlar').append(`
                    <option _tur="${sinav.tur_adi}" value="${sinav.id}">${sinav.sinav_adi}</option>
                `);
            });

            if (localStorage.getItem('curr_exam')) {
                $('#sinavlar option[value="'+localStorage.getItem('curr_exam').split('/')[3]+'"]').prop('selected', true);
                // localStorage.removeItem('curr_exam');
            }

            $('#sinavlar').change();
        });
    };

    $.deleteFileUpload = function(file_id) {
        swal({
            title: 'Emin misiniz?',
            text: "Bu dosyaya ait tüm kayıtlar silinecektir!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post( "delete_temp_upload_file", {delete_file: file_id}, function (response) {
                    let resultStatus = JSON.parse(response).status;
                    if(resultStatus === "success") {
                        setTimeout(function(){
                            window.location = "new_form"
                        },1000);
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
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


	/*
    $('#kurum-ara').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            $.post( "kurum_ara", {kurum_no: $(this).val()}, function (response) {
                let result = JSON.parse(response);
                if(result.status ===  "success"){
                    iziToast.success({
                        title: "İşlem Başarılı",
                        message: "Aranan Kurum Başarıyla bulundu",
                        position: "topCenter"
                    });

                    $('#il').val(result.kurum.il_no).trigger('change');

                    il_post.then(function () {
                        $('#ilceler').val(result.kurum.ilce_id).trigger('change');
                        ilce_post.then(function () {
                            $('#kurumlar').val(result.kurum.kurum_no).trigger('change');
                        });
                    });

                }else {
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Böyle Bir Kurum Bulunamadı.",
                        position: "topCenter"
                    });
                }
            });
        }
    });
	*/

	/*
    $('#veri_giris_save').click(function () {
        $(this).addClass("d-none");
        $('.spiner').removeClass("d-none");
        setTimeout(function(){
            $('#veri_giris_save').removeClass("d-none");
            $('.spiner').addClass("d-none");
        }, 6000);
    });
	*/

    $('.frmSinavVeriGiris').on('submit', function() {
        localStorage.setItem('curr_exam', $('#sinav-donemi').val()+'/'+$('#paket').val()+'/'+$('#grup').val()+'/'+$('#sinavlar').val());
        $('#veri_giris_save').attr('disabled', 'disabled');
        if ($('#kurumlar').val() || !$.trim($('#kurum-ara').val())) {
            $('#kurum_no').attr('disabled', 'disabled');
        }
    });

    $('#veri_edit_save').click(function () {
        $(this).addClass("d-none");
        $('.spiner').removeClass("d-none");
    });

    // son eklenen sınav verisine göre alanları otomatik doldurma
    let exam_info = (localStorage.getItem('curr_exam')) ? localStorage.getItem('curr_exam').split('/') : $("#exam-info").val().split("/");

    $('#sinav-donemi').val(exam_info[0]).trigger('change');
    paket_post.then(function () {
        $('#paket').val(exam_info[1]).trigger('change');

        grup_post.then(function () {
            $('#grup').val(exam_info[2]).trigger('change');
        })
    });

    // son eklenen sınav verisine göre alanları otomatik doldurma

    $('#sinavlar').on('change', function() {
        let cond = $('option:selected', $(this)).attr('_tur') == 'AYT';
        $('.frmGroupTYTSinav').toggle(cond);
        if (cond) $('#sinavlarTYT').attr('required', 'required');
        else $('#sinavlarTYT').removeAttr('required');
        if (cond && !$('#sinavlarTYT option[value!=""]').length) {
            $.post("sinav_getir_ture_gore",{tur:'TYT', grup_id:$('#grup').val()}, function (resp) {
                let sinavlar = JSON.parse(resp);
                sinavlar.forEach(function (sinav) {
                    $('#sinavlarTYT').append(`
                    <option value="${sinav.id}">${sinav.sinav_adi}</option>
                `);
				})
			});
		}
	});

    $("#kurum-ara").tinycomplete({
        requesturl: "/veri_giris/ac_kurum",
        tpl: {
            item: '<li class="tc-item" data-hidden-val="{kurum_no}">' +
				'{kurum_no} -:- {il_adi}/{ilce_adi} -:- {kurum_adi}' +
			'</li>'
        },
    });


    $('.frmSinavVeriGiris').on('click', '.tc-item', function() {
        $('#kurum_no').removeAttr('disabled');
        $('#ilceler option:gt(0), #kurumlar option').remove();
        $('#il option:eq(0), #ilceler option:eq(0)').prop('selected', true);
    });

    if (localStorage.getItem('curr_kurum')) {
        let curr_kurum = JSON.parse(localStorage.getItem('curr_kurum'));
        localStorage.removeItem('curr_kurum');
        $('#kurum-ara').val(curr_kurum.kurum_adi);
        $('#kurum_no').val(curr_kurum.kurum_no);
    }

});