$(document).ready(function () {
    $('._c').bigocountdown().on('expiry', function() {
        $(this).parent().prev().text('SINAVA GİRMEK İÇİN TIKLAYIN');
        $(this).parent().remove();
    });
    setTimeout(function () {
        $('._c').parent().show();
        $('.btnSinav').fadeIn().on('click', function () {
            if ($('._c[_sid="'+$(this).data('sid')+'"]').hasClass('is-countdown')) {
                iziToast.error({
                    title: "Uyarı",
                    message: "Sınava vaktinden önce başlayamazsınız<br>E008",
                    position: "topCenter"
                });
                return;
            }
            $('form input:eq(0)').val($(this).data('sid'))
                .parent()[0].submit();
        })
    }, 1000);

    setInterval('handleBlinks()', 500);
});