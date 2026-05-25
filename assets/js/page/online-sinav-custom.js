let sizeOfSorular;
let cevaplar = [];

$(document).ready(function() {

    $('._container-ders a.nav-link').click(function() {
        $('nav a').removeClass("alert-light");
        $(this).addClass("alert-light");
        $('#ders_adi').text($(this).text());

        ders_id = $(this).attr("ders_id");
        ders_i = $(this).attr("ders_indeks");
        $('#optik_form').empty();

        /**
         * derse verilmis cevaplar
         */
        $.post("get_cevaplar", { ders_i: ders_i }, function(resp) {
            if (typeof cevaplar[ders_i] == 'undefined') {
                cevaplar[ders_i] = [];
            }
            $.each(resp.cevaplar, function(i, item) {
                cevaplar[ders_i][item.soru_id] = item.cevap;
            });
            $('#optik_form').html('');
            for (let i in sorular[ders_id]) {
                $('#optik_form').append($('#tplSiklar').html().render({
                    ders_id: ders_id,
                    soru_no: i,
                    ders_indeks: ders_i,
                    classname: (i % 2) ? 'zebra' : ''
                }));
                if (typeof cevaplar[ders_i][i] != 'undefined') {
                    $('div[name="cevap"][soru_no="' + i + '"][cevap_id="' + cevaplar[ders_i][i] + '"]').addClass('CircleFilled');
                }
            }
            if (tip != 'lgs') {
                $('div[name="cevap"][cevap_id="5"]').removeClass('dnone');
            }
            sizeOfSorular = $('#optik_form').children().length;

            /**
             * dersin ilk sorusu
             */
            soru_getir(ders_i, 1, ders_id);
        });

    });
    $('._container-ders a.nav-link:eq(0)').click();

    $('#optik_form').on('click', '#cevap', function() {
        ders_id = $(this).attr("ders_id");
        ders_i = $(this).attr("ders_indeks");
        soru_no = $(this).attr("soru_no");
        cevap_id = $(this).attr("cevap_id");

        let postData = { "ders_indeks": ders_i, "soru": soru_no, "cevap": cevap_id, "bos": 0 };
        if ($(this).hasClass("CircleFilled")) {
            postData.bos = 1;
            cevaplar[ders_i][soru_no] = 0;
        } else {
            cevaplar[ders_i][soru_no] = cevap_id;
        }
        $(this).parent().children("#cevap").removeClass("CircleFilled");
        $(this).parent().children("#cevap").addClass("Circle");
        $('.footer [soru_no="' + soru_no + '"].btnActive').removeClass('btnActive');
        if (!$(this).hasClass("CircleFilled") && !postData.bos) {
            $(this).addClass("CircleFilled");
            $('.footer [soru_no="' + soru_no + '"][cevap_id="' + cevap_id + '"]').addClass('btnActive');
        }

        // ders_i,soru,cevap 1 2 3 4 5
        $.post("/cevap/save", postData, function(response) {
            if (!response.success) {
                iziToast.error({
                    title: "Uyarı",
                    message: response.msg.join('<br>'),
                    position: "topCenter",
                    onClosing: function() {
                        location.href = '/';
                    }
                });
                return;
            }
        });

    });

    $('#footer').on('click', '#cevap', function() {
        ders_id = $(this).attr("ders_id");
        ders_i = $(this).attr("ders_indeks");
        soru_no = $(this).attr("soru_no");
        cevap_id = $(this).attr("cevap_id");

        let postData = {
            ders_indeks: ders_i,
            soru: soru_no,
            cevap: cevap_id,
            bos: 0
        };
        if ($(this).hasClass("btnActive")) {
            postData.bos = 1;
            cevaplar[ders_i][soru_no] = 0;
        } else {
            cevaplar[ders_i][soru_no] = cevap_id;
        }
        $.post("/cevap/save", postData, function(response) {
            $('#optik_form [name="cevap"][soru_no="' + soru_no + '"]').removeClass('CircleFilled').addClass('Circle');
            $('#optik_form [name="cevap"][soru_no="' + soru_no + '"]:eq(' + (cevap_id - 1) + ')').addClass('CircleFilled');
            $('.footer button[soru_no="' + soru_no + '"].btnActive').removeClass('btnActive');
            if (!postData.bos)
                $('.footer [soru_no="' + soru_no + '"][cevap_id="' + cevap_id + '"]').addClass('btnActive');
            else
                $('#optik_form div[soru_no="' + soru_no + '"]').removeClass('CircleFilled');
        });

    });


    $('#optik_form').on('click', '#soru', function() {
        ders_id = $(this).attr("ders_id");
        soru_no = $(this).attr("soru_no");
        ders_i = $(this).attr("ders_indeks");
        soru_getir(ders_i, soru_no, ders_id);
    });

    $('#footer').on('click', '#soru', function() {
        ders_id = $(this).attr("ders_id");
        soru_no = $(this).attr("soru_no");
        ders_i = $(this).attr("ders_indeks");
        soru_getir(ders_i, soru_no, ders_id);
    });

    /**
     * soru-img-get > JS
     * @param ders_i
     * @param soru
     * @param ders_id
     */
    function soru_getir(ders_i, soru, ders_id) {
        soru = parseInt(soru);
        if (soru < 1 || sizeOfSorular < soru || typeof sid == 'undefined') {
            return;
        }
        $('#soru_numrasi_gosterim').hide();
        $('.highslide-container').html('');
        if (soru + 1 <= sizeOfSorular) {
            let obj = new Image();
            obj.src = '/tinyfinder/assets/uploads/img/sinav/' + sid + '_' + ders_id + '/' + sorular[ders_id][soru + 1] + ext;
        }
        /**
         * soru-img
         */
        $('#soru_numrasi_gosterim').show().text(soru + ". Soru");
        $('#slayt').html($('#tplSoru').html().render({
            sid: sid,
            ders_id: ders_id,
            img: sorular[ders_id][soru]
        }));
        /**
         * footer-buts
         */
        $('#footer').html($('#tplFooter').html().render({
            ders_indeks: ders_i,
            ders_id: ders_id,
            soru_onceki: soru - 1,
            soru_sonraki: soru + 1,
            soru: soru
        }));
        if (tip != 'lgs') {
            $('[cevap_id="5"]').removeClass('dnone')
        }
        if (typeof cevaplar[ders_i][soru] != "undefined") {
            $('.footer [soru_no = "' + soru + '"][cevap_id = "' + cevaplar[ders_i][soru] + '"]').addClass('btnActive');
        }

    }

    function modal_mobil_dogrulama_gir(tel)
    {
        Swal.fire({
            title: 'SMS ile gelen kodu giriniz:',
            input: 'number',
            inputPlaceholder: '6 haneli kod',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Gönder',
            showCancelButton: false,
            allowOutsideClick: () => false,
            preConfirm: (kod) => {
                $('.swal2-confirm').cLoader();
                $.post('/ogrenci_sinav_auth/mobil_dogrulama_gir', {kod:kod,tel:tel}, function(resp) {
                    if (!resp.success) {
                        $('.swal2-confirm').rLoader();
                        iziToast.destroy();
                        iziToast.error({
                            title: "Uyarı",
                            message: resp.msg.join('<br>'),
                            position: "bottomCenter"
                        });
                        return false
                    }
                    $('.btnSinavaBasla').removeClass('required-mobile-confirm').click();
                });
                return false;
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }

    function modal_mobil_dogrulama()
    {
        Swal.fire({
            title: 'Onay için cep telefonu:',
            // text: '(başında sıfır olmadan girebilirsiniz)',
            input: 'number',
            inputPlaceholder: '555*******',
            inputValue: tel || '',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Gönder',
            showCancelButton: false,
            allowOutsideClick: () => false,
            preConfirm: (tel) => {
                $('.swal2-confirm').cLoader();
                $.post('/ogrenci_sinav_auth/mobil_dogrulama_gonder', {tel:tel}, function(resp) {
                    $('.swal2-confirm').rLoader();
                    if (!resp.success && typeof resp.msg == 'object') {
                        iziToast.destroy();
                        iziToast.error({
                            title: "Uyarı",
                            message: resp.msg.join('<br>'),
                            position: "bottomCenter"
                        });
                        return false
                    }
                    modal_mobil_dogrulama_gir(tel);
                });
                return false;
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }


    $('.btnSinavaBasla').on('click', function() {
        let self = $(this);
        let done = false;
        if (self.hasClass('required-mobile-confirm')) {
            modal_mobil_dogrulama();
            return;
        }
        self.cLoader();
        $.post("/sinav_hareket/basla", function(resp) {
            if (resp.success) {
                location.href = '/ogrenci_sinav/online_sinav';
                return;
            }
            /**
             * "info" seviyesinde mesajlar
             */
            switch (resp.msg[1]) {
                case 'E002':
                    iziToast.info({
                        title: "BİLGİ",
                        message: resp.msg.join('<br>'),
                        position: "center",
                        timeout: 5000,
                        onClosing: function() {
                            location.href = '/ogrenci_sinav/online_sinav';
                        }
                    });
                    done = true;
                    break;
            }
            /**
             * errör seviyesinde mesajlar
             */
            if (done) {
                location.href = '/ogrenci_sinav/online_sinav';
                return;
            }
            self.rLoader();
            /*
            iziToast.show({
                title: "UYARI",
                message: resp.msg.join('<br>'),
                position: "center",
                timeout: 5000,
                onClosing: function () {
                    switch (resp.msg[1]) {
                        case 'E009' :
                        case 'E010' :
                            location.href = '/ogrenci_sinav/aktif_sinavlar';
                        break;
                        default :
                            location.href = '/';
                        break;
                    }
                }
            });
             */
            alert(resp.msg.join("\n"));
            switch (resp.msg[1]) {
                case 'E009':
                case 'E010':
                    location.href = '/ogrenci_sinav/aktif_sinavlar';
                    break;
                default:
                    location.href = '/ogrenci_sinav/logout';
                    break;
            }
        });
    });

    /**
     * devam eden sinav
     */
    if (typeof hareket != 'undefined') {
        switch (hareket.durum) {
            case '1':
                $('.c-ex').bigocountdown().on('expiry', function () {
                    $('.btnSinaviBitir').addClass('finito').click();
                });
                $('.btnSinaviBitir').show();
                break;
            case '2':
                $('.c-ex').html('Bu sınava katılım yaptınız.<br><a href="/ogrenci_sinav/logout" class="btn btn-danger btn-sm">Çıkış Yap</a>');
                break;
        }
    }

    let _bitir = function(obj) {
        $.post("/sinav_hareket/bitir", function(resp) {
            if (!resp.success) {
                iziToast.error({
                    title: "Uyarı",
                    message: resp.msg.join('<br>'),
                    position: "topCenter"
                });
                return;
            }
            Swal.fire({
                position: 'center',
                width: 600,
                type: 'success',
                title: 'SINAVINIZ BİTTİ ...<BR><BR>KATILIMINIZ İÇİN TEŞEKKÜR EDİYORUZ<BR><BR>TÜRKİYE GENELİ SIRALAMA VE DETAYLI SONUÇ AÇIKLANMA TARİHİ: ' + resp.sonuc_tarih + '<BR>',
                showConfirmButton: true,
                timeout: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'SINAV SONUÇLARI'
            }).then((result) => {
                window.removeEventListener('beforeunload', ayrilma_ikaz);
                location.href = '/ogrenci_sinav/sonuc';
            });
        });
    }

    $('.btnSinaviBitir').on('click', function() {
        let self = $(this),
            spec_msg = '';

        if (self.hasClass('finito')) {
            _bitir(self);
            return;
        }

        Swal.fire({
            title: 'Sınav bitirilecek..',
            text: (!spec_msg) ? "Devam edilsin mi ?" : spec_msg,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'İptal',
            confirmButtonText: 'Evet, Bitir!'
        }).then((result) => {
            if (result.value) {
                _bitir(self);
            }
        })
    });
});