$(document).ready(function(){

    $('.frmSinavPlan').on('submit', function () {
        var self = $(this);
        $('.btnSubmit').cLoader();
        $.post('/kurum_sinav_plan/create', self.serialize(), function (resp) {
            $('.btnSubmit').rLoader();
            if (resp.success) {
                if ($('[name="excelfile"]').length) {
                    self.attr('action', '/sinav_katilimcilar/excelUpload/'+resp.id);
                    self[0].submit();
                }
                else {
                    let m = 'Okulunuz '+resp.sinif+'. sınıf öğrencilerine seçtiğiniz sınava girme hakkı verildi';
                    if (resp.sinif >= 11 && resp.sinif < 14)
                        m += 'Not: <br>11,12 ve mezunlar birbirilerinin sınavlarını görebilirler';
                    Swal.fire({
                        //icon: 'info',
                        title: 'İşlem Başarılı',
                        html: m,
                        confirmButtonText: 'Kapat'
                    }).then((result) => {
                        location.href = '/kurum_sinav_plan';
                    });
                }
                return;
            }
            iziToast.error({
                title: "İşlem Başarısız",
                message: resp.msg.join('<br>'),
                timeout: 3000,
                position: "topCenter"
            });
        });
        return false;
    });

    $('.frmEditSinavPlan').on('submit', function () {
        var self = $(this);
        $('.btnSubmit').cLoader();
        $.post('/kurum_sinav_plan/update', self.serialize(), function (resp) {
            $('.btnSubmit').rLoader();
            if (!resp.success) {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: resp.msg.join('<be>'),
                    position: "topCenter"
                });
                return;
            }
            if (!$('.custom-file-input').val()) {
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: 'Planınız başarıyla güncellendi..',
                    position: "topCenter",
                    onClosing: function() {
                        location.href = '/kurum_sinav_plan';
                    }
                });
                return;
            }
            self.attr('action', '/sinav_katilimcilar/excelUpload/'+resp.id);
            self[0].submit();

        });
        return false;
    });

    $('#grid-body').on('change', 'select', function () {
        var self = $(this)
            , durum = self.val();
        self.cLoader();
        $.post('/kurum_sinav_plan/set_durum', {
            id : self.closest('tr').find('td:eq(0)').text(),
            durum : durum
        }, function () {
            self.rLoader();
            if (durum == -2) {
                grid.refresh();
            }
        })
    });

    $('.ogrno').on('change', function () {
        $(this).closest('tr').attr('_ogr', $(this).val());
    });

    $('.btnFrmSubmit').on('click', function () {
        var self = $(this),
            frm = $('form');
        $('input', frm).removeClass('bg-danger')
        .css({
            'background' : 'none',
            'color' : '#000'
        });
        self.cLoader();

        $.post('/sinav_katilimcilar/save_excel_data', {
            jsonData : JSON.stringify(frm.serializeObject()),
            sid : $('.sid').val(),
            pid : $('.pid').val()
        }, function(resp) {
            self.rLoader();
            iziToast.destroy();
            if (!resp.success) {
                switch (resp.custom) {
                    case '-3':
                        let m = '';
                        $.each(resp.msg, function(i, item) {
                            m += item + ', ';
                            $('[_v="'+item+'"]').css({
                                'background-color' : getRandomColor(),
                                'color' : '#fff'
                            });
                        });
                        iziToast.destroy();
                        iziToast.error({
                            title: "Mükerrer telefonlara müdahale ediniz",
                            message: m,
                            position: "topCenter",
                            timeout: false
                        });
                    break;
                    default :
                    iziToast.error({title: "İşlem Başarısız", message: resp.msg.join('<br>'), position: "topCenter"});
                    break;
                }

            }
            else {
                let m = '';

                if (resp.olusturulan) {
                    m += '&middot; Sisteme '+resp.olusturulan+' yeni üye öğrenci hesabı eklendi<br>';
                }
                if (resp.guncellenen) {
                    m += '&middot; '+resp.guncellenen+' kayıtlı üye bilgisi güncellendi';
                }
                if (resp.katilimci_olusturulan > 0) {
                    m += '&middot; Sınava '+resp.katilimci_olusturulan+' <b>yeni katılımcı</b> eklendi';
                }
                m += '<hr>';
                if (resp.kayitli_gsmler.length) {
                    $.each(resp.kayitli_gsmler, function (i,item) {
                        $('[_v="'+item+'"]').addClass('bg-danger');
                    });
                    m += '<p>&middot; Başka bir kurumun öğrencisine dair işlem yapmaya çalıştınız. Cep nolar :</p>';
                    m += resp.kayitli_gsmler.join('<br>');
                    m += '<hr>';
                }
                if (resp.gecersiz_gsmler.length) {
                    $.each(resp.gecersiz_gsmler, function (i,item) {
                        $('[_v="'+item+'"]').addClass('bg-danger');
                    });
                    m += '&middot; Gerçersiz tel no\'lar :<br>';
                    m += resp.gecersiz_gsmler.join('<br>');
                    m += '<hr>';
                }

                $('.tbl-xls-rows tbody .telNo:not(.bg-danger)').closest('tr').remove();

                if (!resp.kayitli_gsmler.length && !resp.gecersiz_gsmler.length) {
                    /*
                    $('.alert-info').addClass('alert-success').html('<p>Tebrikler! İçe aktarım tüm ögeler için başarıyla gerçekleşti</p><p><a href="/sinav_ogrenci_havuz">Üye Öğrenci Listesine Git</a></p>');
                    if (resp.katilimci_olusturulan > 0)
                        $('.alert-info').append('<p><a href="/kurum_sinav_plan">Katılımcı Planlarına Git</a></p>')
                    */
                    Swal.fire({
                        // icon: 'warning',
                        title: 'İşlem başarılı',
                        html: m,
                        confirmButtonText: 'Üye öğrenci listesine git'
                    }).then((result) => {
                        location.href = '/sinav_ogrenci_havuz';
                    });
                    return;
                }
                /**
                 * kısmi olarak oldu ama bilgilendirilecek noktalar var bloğu.
                 */
                Swal.fire({
                    // icon: 'warning',
                    title: 'İşlem sonucu',
                    html: m,
                    confirmButtonText: 'Tamam'
                });
            }
        })
    });

    if ($('.banner').length) {
        $('.banner').tinyfinder({
            type: 'img',
            create_thumb: false,
            buttons: {
                archive: false
            }
        });
    }

    $.deleteItem = function(id){
        swal({
            title: 'Plan ve Katılımcı Verileri Silinecek',
            text: "Devam Edilsin mi?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet Sil',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post( "/kurum_sinav_plan/delete", {id: id}, function (resp) {
                    if(resp.success) {
                        $('#button-refresh').trigger('click');
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

    $('.kayitlilari-sil').on('change', function () {
        $('[name="action"]').val($(this).prop('checked') ? 'create' : 'update');
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

    $('#ac-kurum').tinycomplete({
            minlen: 3,
        requesturl: function () {
            return "/ogrenci_sinav_auth/kurum_ara/"+$('.combo-sehir').val();
        },
        tpl: {
            item: '<li class="tc-item" data-hidden-val="{kurum_no}"><i>{ilce_adi}</i> -:- {kurum_adi}</li>'
        }
    });

    /*
    $('.opsiyon').on('change', function () {
        if (!$(this).prop('checked')){
            $('.frmElDiv').fadeIn();
            $('.frmElDiv1').fadeOut();
            $('input[name="sinav_id"]').attr('disabled','disabled');
            $('select[name="sinav_id"]').attr('required','required');
            $('#class').removeAttr('required');
        }
        else {
            $('.frmElDiv').fadeOut();
            $('.frmElDiv1').fadeIn();
            $('input[name="sinav_id"]').removeAttr('disabled');
            $('select[name="sinav_id"]').removeAttr('required');
            $('#class').attr('required','required');
        }
    });
    */

    /**
     * @todo: degeri degistirilmesine ragmen value attributu neden degismiyor acep :)
     * kacamak bir cozum uretildi
     */
    $('.telNo').on('change', function () {
        $(this).attr('_v', $(this).val());
    });

});
