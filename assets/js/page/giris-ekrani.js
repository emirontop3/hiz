/*$(document).ready(function() {

    $('.btnOgrenci').on('click', function (e) {
        let self = $(this),
            handle_url = '';
        Swal.fire({
            title: 'Hoş Geldiniz',
            text: "Yapmak İstediğiniz İşlemi Seçiniz",
            type: 'question',
            allowOutsideClick: () => !Swal.isLoading(),
            // allowEscapeKey: false,
            // allowEnterKey: false,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#F9982D',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'SINAVA GİR',
            cancelButtonText: 'SONUCA BAK',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                $('.swal2-confirm').cLoader();
                $.post(`/ogrenci_sinav/login_pre_check`, {}, function (resp) {
                    $('.swal2-confirm').rLoader();
                    switch (resp.status) {
                        case 1 :
                            //location.href = '/ogrenci_sinav/online_sinav';
							location.href = '/giris';
                            return;
                        break;
                        case -1 :
                            Swal.fire({
                                position: 'center',
                                width: 600,
                                type: 'info',
                                text : resp.message,
                                title: 'Bilgilendirme',
                                showConfirmButton: true,
                                timeout: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                confirmButtonText: 'Tamam'
                            });
                            break;
                        default :
							location.href = '/giris';
                            return;
							break;
                            $('.swal2-title').html('Bilgilerinizi giriniz');
                            $('.swal2-question').hide();
                            $('.swal2-success').show();
                            $('.swal2-cancel, .swal2-confirm').remove();
                            $('.swal2-content').html($('#tplGirisForm').html().render(resp));
                            $('.combo-sehir option[value!=""]').remove();
                            $.each(resp.cities, function (i, item) {
                                $('.combo-sehir').append('<option value="'+item.il_no+'">'+item.il_adi+'</option>');
                            });
                            $('#ac-kurum').tinycomplete({
                                minlen: 3,
                                requesturl: function () {
                                    return "/ogrenci_sinav_auth/kurum_ara/"+$('.combo-sehir').val();
                                },
                                tpl: {
                                    item: '<li class="tc-item" data-hidden-val="{kurum_no}"><i>{ilce_adi}</i> -:- {kurum_adi}</li>'
                                }
                            });

                            $('.combo-sehir').on('change', function () {
                                if ($(this).val()) {
                                    $('#ac-kurum').attr('placeholder','Kurum aramak için kelime giriniz...')
                                        .removeAttr('readonly');
                                    $('.combo-sehir option[value=""]').remove();
                                    $('#ac-kurum').val('');
                                    $('#kurum_no').val('');
                                }
                            });
                            $('.frmSignIn').on('submit', function () {
                                let self = $(this);
                                $('.btnSubmit').cLoader();
                                $.post('/ogrenci_sinav_auth/signin', self.serialize(), function (resp) {
                                    $('.btnSubmit').rLoader();
                                    if (!resp.success) {
                                        iziToast.destroy();
                                        iziToast.error({
                                            title: "Uyarı",
                                            message: resp.msg.join('<br>'),
                                            position: "bottomCenter"
                                        });
                                        return false;
                                    }
                                    console.log(resp);
                                    switch (resp.kod) {
                                        case 1:
                                            location.href = '/online/sinav.php?id='+resp.id;
                                        break;
                                        // case 2:
                                            // location.href = '/ogrenci_sinav?sid='+resp.sid;
                                        // break;
                                        case 3:
                                            location.href = '/ogrenci_sinav/aktif_sinavlar/'+$('.combo-sinif').val();
                                        break;
                                    }
                                });
                                return false;
                            });
                        break;
                    }
                });
                return false;
            },
        }).then((result) => {
            if (result.dismiss == 'cancel') {
                self.cLoader();
                console.log('nanay');
                location.href = '/ogrenci_giris';
            }
        })
    });


});*/