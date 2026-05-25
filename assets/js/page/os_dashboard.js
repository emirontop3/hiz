$.blockUI.defaults.css = {
    padding: 0,
    margin: 0,
    width: '30%',
    top: '40%',
    left: '35%',
    textAlign: 'center',
};

let loader = function() {
    $.blockUI({message:'<img src="/assets/os_giris/pl.gif">'});
};

$(document).ready(function() {
    $("._c").each(function() {
        var self = $(this);
        self.countdown(self.data('until'), function(event) {
            $(this).text(
                event.strftime('%D gün %Hsa %Mdk %Ssn')
            )
                .on('finish.countdown', function(event) {
                    self.parent().next().fadeIn();
                    self.parent().remove();
                });
        });
    });
    $('.btnSinav:not(.girdi)').on('click', function() {
        let self = $(this);
        var kitapcik = $("input[name='kitapcik']:checked").val();
        loader();
        $.post('/ogrenci_sinav_dashboard/basla', {sinav_id: self.data('sinavid'),kitapcik: kitapcik}, function (resp) {
            if (!resp.success) {
                $.unblockUI();
                switch (resp.code) {
                    case -2 :
                        Swal.fire({
                            icon: 'info',
                            title: 'Bilgi',
                            html: resp.msg.join('<br>'),
                            confirmButtonText: 'Tamam',
                            onClose: function() {
                                self.text('Yayından Kalktı').addClass('girdi').unbind('click');
                            }
                        });
                    break;
                    case -5 :
                        Swal.fire({
                            icon: 'info',
                            title: 'Bilgi',
                            html: resp.msg.join('<br>'),
                            confirmButtonText: 'Tamam',
                            onClose: function() {
                                location.href = '/';
                            }
                        });
                        break;
                    default :
                        Swal.fire({
                            icon: 'info',
                            title: 'Bilgi',
                            html: resp.msg.join('<br>'),
                            confirmButtonText: 'Tamam'
                        });
                        break;
                }
                return;
            }
            // console.log('basaraili redirect');
            location.href = '/online/sinav.php?id='+resp.id+'&paty='+kitapcik
        });
    });

    $('#modalAciklama').on('show.bs.modal', function (e) {
        $('.sinifa-ozel').hide();
        $('li[_sinif="'+$(e.relatedTarget).data('sinif')+'"]').show();
        if ($(e.relatedTarget).data('dosya'))
            $('._dosya').attr('href', '/tinyfinder/assets/uploads/file/'+$(e.relatedTarget).data('dosya'));
        else
            $('._dosya').closest('ul').remove();
        $('._yanlisetki span').text($(e.relatedTarget).data('yanlisetki'));
        $('._sinavad span').text($(e.relatedTarget).data('adi'));
        $('._sinavsure span').text($(e.relatedTarget).data('sure'));
    })

});
