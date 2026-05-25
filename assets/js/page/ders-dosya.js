$(document).ready(function(){
    /**
     * sinav-info-set
     */
    $('.ders-dosya').on('click', function () {
        let s_info = {
            id  : $(this).attr('_sid'),
            ref : $(this).attr('_ref'),
            ders_id : $(this).attr('_ders_id')
        };
        $.cookie('s_info', JSON.stringify(s_info), { path: '/' });
        no_cache = new Date().getTime();
    });


    $('.ders-mp3').on('click', function () {
        let s_info = {
            id  : $(this).attr('_sid'),
            ref : $(this).attr('_ref'),
            ders_id : $(this).attr('_ders_id')
        };
        $.cookie('s_info', JSON.stringify(s_info), { path: '/' });
        no_cache = new Date().getTime();
    });
    /**
     * uploader
     */
    $('.ders-dosya').tinyfinder({
        type: 'img',
        create_thumb : false,
        buttons: {
            archive: false,
            download: false
        },
    });

    $('.ders-mp3').tinyfinder({
        type: 'file',
        create_thumb : false,
        buttons: {
            archive: false,
            download: false
        },
    });
});
