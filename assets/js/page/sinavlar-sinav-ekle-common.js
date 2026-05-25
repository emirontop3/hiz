$('.frmSinav').on('submit', function () {
    let self = $(this)
    , els = $('.options_online input[disabled!="disabled"][name!=""], .options_online select[disabled!="disabled"][name!=""]');
    $('._options', self).val(JSON.stringify(elements_to_json(els)));
    $('.options_online input', self).attr('disabled', 'disabled');
    $('.btnSubmit').cLoader();
});

$('input[name="is_online"]').on('change', function () {
    // console.log('val', $(this).val());
    if ($(this).val() == 0) {
        $('.options_online').slideUp();
        $('.frmItemOnlineSinav').hide();
        $('.sinav-tarih').removeAttr('required');
        $('.sonuc-tarih').removeAttr('required');
        $('[name="kapsam"]').removeAttr('required');
        $('.frmElSinavSorulari').hide();
        return;
    }
    $('.options_online').slideDown();
    $('.frmItemOnlineSinav').show();
    $('.sinav-tarih').attr('required', 'required');
    $('.sonuc-tarih').attr('required', 'required');
    $('[name="kapsam"]').attr('required', 'required');
    $('.frmElSinavSorulari').show();
})
.each(function () {
    if ($(this).prop('checked')) {
        $(this).change(); // al amk ya
        return false;
    }
});

$('input[name="kurum"]').on('click', function () {
    if ($(this).val() != 1) {
        $('.options_online_kurum').slideUp()
        .find('input:last').removeAttr('required');
        return;
    }
    $('.options_online_kurum').slideDown()
    .find('input:last').attr('required', 'required');
});

$('select[name="kapsam"]').on('change', function () {
    if ($(this).val() == 'herkes') {
        $('.div-ref-kod').fadeIn();
    }
    else $('.div-ref-kod').fadeOut();
});

$('select[name="listede_gorunmesin"]').on('change', function () {
    return;
    /*
    if ($(this).val() == 1) {
        $('.p-sinav-link').slideDown();
    }
    else
        $('.p-sinav-link').slideUp();

    if ($('.p-sinav-link').html().indexOf('http') == -1) {
        let url = location.href.toString()
        , arr = url.split('/sinavlar/');
        $('.p-sinav-link').html(arr[0]+'/ogrenci_sinav?ref='+$('.p-sinav-link').html())
        .css({
            cursor: 'default',
            background: '#ffc'
        });
    }
    */
});