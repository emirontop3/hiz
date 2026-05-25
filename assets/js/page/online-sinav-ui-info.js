/**
 * aşağıdaki clientside bilgilendirmeler (veya kontroller) serverside tarafında mevcut
 * UI'ın mevzudan daha haberdar olmasını hedefliyoruz
 */

$(document).ready(function () {

    /**
     * todo: son 30 dakikaya girdiniz
     */

    /**
     * todo: sınav süresine 20 dk daha eklenmiştir   ( socket )
     */

    /**
     * devam eden başka bir sınav var mı
     */
    if ($('.btnSinavaBasla').length && !$('.btnSinavaBasla').hasClass('required-mobile-confirm')) {
        $.post('is_resume', {}, function (resp) {
            if (resp.status) {
                Swal.fire({
                    position: 'center',
                    width: 600,
                    type: 'info',
                    // title: 'Bilgi',
                    html: "Sistemde devam etmekte olan bir sınavınız var ...<br>Yönlendiriliyorsunuz ...",
                    showConfirmButton: true,
                    timer: 5000,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Tamam'
                }).then((result) => {
                    location.href = '/ogrenci_sinav/online_sinav';
                });
            }
        });
    }

});