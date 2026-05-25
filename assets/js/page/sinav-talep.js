let set_ac_el = function() {
    if (!$('.comboIlce').val()) {
        $('#ac-kurum').attr('disabled', 'disabled')
        .val('İlçe seçiniz');
        return;
    }
    $('#ac-kurum').val('').removeAttr('disabled')
};

$(document).ready(function(){

    $('.comboIl').on('change', function () {
        $('.comboIlce').html('<option value="">Seçim yapınız</option>');
        set_ac_el();
        if (!$(this).val()) return;
        $.post("/sinav_talep/ilce_getir",{il_no: $(this).val()}, function (resp) {
            resp.forEach(function (item) {
                $('.comboIlce').append(`
                    <option value="${item.id}">${item.ilce_adi}</option>
                `);
            });
            if ($('.sid').val()) {
                $('.comboIlce option[value="'+row.ilce_id+'"]').prop('selected', true);
                set_ac_el();
                if (row.olmayan_kurum)
                    $('#ac-kurum').val(row.kurum_ad);
            }
        });
    });

    $('.comboIlce').on('change', function () {
        set_ac_el();
    });



    $("#ac-kurum").tinycomplete({
        requesturl: function () {
            return "/sinav_talep/kurum_getir/"+$('.comboIlce').val();
        },
        tpl: {
            item: '<li class="tc-item" data-hidden-val="{kurum_no}">' +
                '{kurum_no} -:- {kurum_adi}' +
                '</li>'
        },
    });

    $('.frmSinavTalep').on('submit', function () {
        var self = $(this);
        $('.btnSubmit').cLoader();
        $.post('create', self.serialize(), function (resp) {
            $('.btnSubmit').rLoader();
            if (resp.success) {
                iziToast.success({
                   title: "İşlem Başarılı",
                   message: "Sınav talebi başarıyla gönderildi. Teşekkürler !<br>Başvurunuz onaylandığında SMS ile bilglendirileceksiniz.",
                   position: "topCenter"
                });
                self[0].reset();
                set_ac_el();
                return;
            }
            iziToast.error({
                title: "İşlem Başarısız",
                message: "Sınav talebi gönderilirken bir hata oluştu",
                position: "topCenter"
            });
        });
        return false;
    });

    $('.frmEditSinavTalep').on('submit', function () {
        var self = $(this);
        $('.btnSubmit').cLoader();
        $.post('/sinav_talep/update', self.serialize(), function (resp) {
            $('.btnSubmit').rLoader();
            if (resp.success) {
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Kayıt başarıyla güncellendi.",
                    position: "topCenter",
                    onClosing: function() {
                        location.href = '/sinav_talep/index';
                    }
                });
                return;
            }
            iziToast.error({
                title: "İşlem Başarısız",
                position: "topCenter"
            });
        });
        return false;
    });

    $('#grid-body').on('change', 'select', function () {
        var self = $(this)
        , durum = self.val();
        self.cLoader();
        $.post('set_durum', {
                id : self.closest('tr').find('td:eq(0)').text(),
                durum : durum
            }, function () {
            self.rLoader();
            if (durum == -2) {
                grid.refresh();
            }
        })
    });

    $('.kurum-yok').on('change', function () {
        
        if ($(this).prop('checked')){
            $('.frmElDiv').fadeIn();
            $('.frmElDiv input').removeAttr('disabled');
            $('.labelKurumAd').text('Yeni Kurum Adı Giriniz');
            $('#ac-kurum')
                .attr('name', 'kurum_ad')
                .removeAttr('placeholder')
                .attr('required', 'required');
        }
        else {
            $('.frmElDiv').fadeOut();
            $('.frmElDiv input').attr('disabled','disabled');
            $('.labelKurumAd').text('Kurum');
            $('#ac-kurum')
                .attr('placeholder', 'Kurum seçimi için kelime giriniz')
                .removeAttr('name')
                .removeAttr('required');
        }


    });

    console.log(row);

    $('.tele').mask("0 (999) 9999999");

    if ($('.sid').val()) {
        $('.comboIl').change();
        $('.kurum-yok').change();
    }

});
