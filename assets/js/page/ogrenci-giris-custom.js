$(document).ready(function(){

    let il_post    = null;
    let ilce_post  = null;

    $.secili_il = function (element) {
        $('#ilceler').closest('.form-group').slideDown();
        let il_no = $(element).val();
        $('#ilceler').empty();
        $('#kurumlar').empty().closest('.form-group').slideUp();
        $('#ilceler').append('<option value="">İlçe Seçiniz</option>');

        il_post = $.il_post(il_no);

		$('.kurum-ad').val('');
		$('.hid-kurum-ad').attr('disabled', 'disabled');
		$('.div-okul-adi').fadeOut();
    };

    $.il_post = function (il_no) {
        return $.post("/ogrenci_giris/ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);
            ilceler.forEach(function (ilce) {
                $('#ilceler').append(`
                    <option value="${ilce.id}">${ilce.ilce_adi}</option>
                `);
            })
        });
    };

    $.secili_ilce = function(element) {
        $('#kurumlar').closest('.form-group').slideDown();
        let ilce_id = $(element).val();
        $('#kurumlar').empty();

        ilce_post = $.ilce_post(ilce_id);
		$('.kurum-ad').val('');
		$('.hid-kurum-ad').attr('disabled', 'disabled');
		$('.div-okul-adi').fadeOut();
    };

    $.ilce_post = function(ilce_id) {
        return $.post("/ogrenci_giris/kurum_getir",{ilce_id: ilce_id}, function (response) {
            let kurumlar = JSON.parse(response);
			$('#kurumlar').append('<option value="">Kurum Seçiniz</option>');
            kurumlar.forEach(function (kurum) {
                $('#kurumlar').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_adi}</option>
                `);
            });
           //$('#kurumlar').append('<option class="text-danger bg-light" value="listede-yok">OKULUM LİSTEDE YOK</option>');
        });
    };

    $.secili_il_2 = function (element) {
        $('#ilceler_2').closest('.form-group').slideDown();
        let il_no = $(element).val();
        $('#ilceler_2').empty();
        $('#kurumlar_2').empty().closest('.form-group').slideUp();
        $('#ilceler_2').append('<option value="">İlçe Seçiniz</option>');

        il_post = $.il_post_2(il_no);

     $('.kurum-ad_2').val('');
     $('.hid-kurum-ad_2').attr('disabled', 'disabled');
     $('.div-okul-adi_2').fadeOut();
    };

    $.il_post_2 = function (il_no) {
        return $.post("/ogrenci_giris/ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);
            ilceler.forEach(function (ilce) {
                $('#ilceler_2').append(`
                    <option value="${ilce.id}">${ilce.ilce_adi}</option>
                `);
            })
        });
    };

    $.secili_ilce_2 = function(element) {
        $('#kurumlar_2').closest('.form-group').slideDown();
        let ilce_id = $(element).val();
        $('#kurumlar_2').empty();

        ilce_post = $.ilce_post_2(ilce_id);
     $('.kurum-ad_2').val('');
     $('.hid-kurum-ad_2').attr('disabled', 'disabled');
     $('.div-okul-adi_2').fadeOut();
    };

    $.ilce_post_2 = function(ilce_id) {
        return $.post("/ogrenci_giris/kurum_getir",{ilce_id: ilce_id}, function (response) {
            let kurumlar = JSON.parse(response);
        $('#kurumlar_2').append('<option value="">Kurum Seçiniz</option>');
            kurumlar.forEach(function (kurum) {
                $('#kurumlar_2').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_adi}</option>
                `);
            });

        });
    };


    // cookie gore alanları otomatik doldurma
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

    // cookie gore alanları otomatik doldurma

    $('.i-sube').keyup(function(){
        this.value = this.value.toUpperCase();
    });

    $(".phone").mask("0(999) 999 99 99");

    $('.frmGiris').on('submit', function () {
        if ($('.phone').val().length < 16) {
            iziToast.error({
                title: "",
                message: "CEP TELEFON NUMARANIZI EKSİKSİZ GİRMELİSİNİZ",
                position: "topCenter",
                timeout: 3000
            });
            return false;
        }
    });

	/*
    $("#modal-custom").iziModal({
        group: 'grupo1',
        history: false,
        overlayClose: false,
        width: 600,
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        transitionIn: 'bounceInDown',
        transitionOut: 'bounceOutDown',
        navigateCaption: true,
        navigateArrows: "false",
        onOpening: function() {
            setTimeout(function () {
                $('#kurum-yok').click();
            }, 0);
            console.log('onOpening');
        },
        onOpened: function() {
            console.log('onOpened');
        },
        onClosed: function() {
            console.log('onClosed');
        }
    });
    $(document).on('click', '.trigger-custom', function (event) {
        event.preventDefault();
        $('#modal-custom').iziModal('open');
    });
	*/


    $("#modal-custom").on('click', 'header a', function(event) {
        event.preventDefault();
        var $this = $(this);
        var index = $this.index();
        $this.addClass('active').siblings('a').removeClass('active');
        var $sections = $this.closest('div').find('.sections');
        var $currentSection = $this.closest("div").find("section").eq(index);
        //var $nextSection = $this.closest("div").find("section").eq(index).siblings('section');
        $sections.css('height', $currentSection.innerHeight());
        function changeHeight(){
            $this.closest("div").find("section").eq(index).fadeIn().siblings('section').fadeOut(100);
        }
        if( $currentSection.innerHeight() > $sections.innerHeight() ){
            changeHeight();
        } else {
            setTimeout(function() {
                changeHeight();
            }, 150);
        }
        if( $this.index() === 0 ){
            $("#modal-custom .iziModal-content .icon-close").css('background', '#ddd');
        } else {
            $("#modal-custom .iziModal-content .icon-close").attr('style', '');
        }
    });

    $('.frmKurumYok').on('submit',function(event) {
        let self = $(this);
        $('.submit', self).cLoader();
        $.post('/contact/send', self.serialize(), function (resp) {
            toastr['success']('Yeni kurum öneriniz tarafımıza ulaştırıldı.');
            $('#modal-custom').iziModal('close');
            $('.submit', self).rLoader();
        });
        return false;
    });

    $('.frmKurumVarAdYanlis').on('submit',function(event) {
        let self = $(this);
        $('.submit', self).cLoader();
        $.post('/contact/send', self.serialize(), function (resp) {
            toastr['success']('Kayıt değişikliği öneriniz tarafımıza ulaştırıldı.');
            $('#modal-custom').iziModal('close');
            $('.submit', self).rLoader();
        });
        return false;
    });


	// listede-yok-formu-acar
    /*$('#kurumlar').on('change', function (e) {
        if ($(this).val() == 'listede-yok') {
            $(this).find('option[value="'+$(this).val()+'"]').remove();
            $('#modal-custom').iziModal('open');
        }
    });*/


    $('#kurumlar').on('change', function (e) {
        if ($(this).val() == 'listede-yok') {
            $('.div-okul-adi').fadeIn();
        }
		else
			$('.div-okul-adi').fadeOut();
    });


	$('.kurum-ad').on('change', function() {
		if (!$(this).val()) {
			$('.hid-kurum-ad').attr('disabled', 'disabled');
			return;
		}
		$('.hid-kurum-ad').removeAttr('disabled');
	});

});
