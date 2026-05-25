$(document).ready(function(){

    let base_url   = window.location.origin + "/rapor_al/";
    let paket_post = null;
    let grup_post = null;

    $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#paket').empty();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#paket').append("<option selected disabled>Seçiniz..</option>");

        paket_post = $.paket_post(donem_id);
    };

    $.paket_post = function(donem_id) {
        return $.post( base_url + "paket_getir", {donem_id: donem_id}, function (response) {
            let paketler = JSON.parse(response);
            paketler.forEach(function (paket) {
                $('#paket').append(`
                    <option value="${paket.id}">${paket.paket_adi}</option>
              `)
            });
        });
    };

    // Sınav değiştir modulü başlangıç
    let exam_info = $("#exam-info").val().split("/");

    $('#sinav-donemi').val(exam_info[0]).trigger('change');

    paket_post.then(function () {
        $('#paket').val(exam_info[1]).trigger('change');

        grup_post.then(function () {
            $('#grup').val(exam_info[2]).trigger('change');
        })
    });
    // Sınav değiştir modulü bitiş

    $.secili_paket = function(element) {
        let paket_id = $(element).val();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#grup').append("<option selected disabled>Seçiniz</option>");

        grup_post = $.grup_post(paket_id);
    };

    $.grup_post = function(paket_id) {
        return $.post(base_url + "grup_getir", {paket_id: paket_id}, function (response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function (grup) {
                $('#grup').append(`
                    <option value="${grup.id}">${grup.grup_adi}</option>
              `)
            })
        })
    };

    $.secili_grup = function(element) {
        let grup_id = $(element).val();
        $('#sinavlar').empty();

        $.sinav_post(grup_id);
    };

    $.sinav_post = function(grup_id) {
        return $.post(base_url + "sinav_getir",{grup_id: grup_id}, function (response) {
            let sinavlar = JSON.parse(response);
            $('#sinavlar').append("<option selected disabled>Seçiniz</option>");
            sinavlar.forEach(function (sinav) {
                $('#sinavlar').append(`
                    <option value="${sinav.id}" ${(sinav.id === exam_info[3]) ? "selected" : ""}>${sinav.sinav_adi}</option>
                `);
            })
        });
    };

    $.secili_sinav = function(element) {
        let sinav_id = $(element).val();
        window.location.href = base_url + "listele/" + sinav_id;
    };

    $("#kurumlar").treeMultiselect({

        // Sections have checkboxes which when checked, check everything within them
        allowBatchSelection: true,

        // Selected options can be sorted by dragging
        // Requires jQuery UI
        sortable: false,

        // Adds collapsibility to sections
        collapsible: true,

        // Enables selection of all or no options
        enableSelectAll: true,

        // Only used if enableSelectAll is active
        selectAllText: 'Hepsini Seç',

        // Only used if enableSelectAll is active
        unselectAllText: 'Tüm Seçimleri Kaldır',

        // Disables selection/deselection of options; aka display-only
        freeze: false,

        // Hide the right panel showing all the selected items
        hideSidePanel: false,

        // max amount of selections
        maxSelections: 0,

        // Only sections can be checked, not individual items
        onlyBatchSelection: false,

        // Separator between sections in the select option data-section attribute
        sectionDelimiter: '/',

        // Show section name on the selected items
        showSectionOnSelected: true,

        // Activated only if collapsible is true; sections are collapsed initially
        startCollapsed: true,

        // Allows searching of options
        searchable: false,

        // Set items to be searched. Array must contain 'value', 'text', or 'description', and/or 'section'
        searchParams: ['value', 'text', 'description', 'section'],

        // Callback
        onChange: null

    });

    let kurumSecimTopluIslemCalisiyor = false;

    function kurumSecimButonDurumu($selectionContainer, disabled) {
        $selectionContainer.find('.select-all, .unselect-all')
            .css({
                'pointer-events': disabled ? 'none' : '',
                'opacity': disabled ? '0.6' : ''
            });
    }

    // Binlerce checkbox icin tek tek change tetiklemek Chrome'u kilitliyor.
    // Secimleri parcali uygula, en sonda yalnizca bir kez senkronizasyon calistir.
    function topluKurumSecimiUygula($selectionContainer, isChecked) {
        if (kurumSecimTopluIslemCalisiyor) {
            return;
        }

        kurumSecimTopluIslemCalisiyor = true;
        kurumSecimButonDurumu($selectionContainer, true);

        let itemCheckboxes = $selectionContainer.find('div.item > input[type=checkbox]').get();
        let titleCheckboxes = $selectionContainer.find('div.title > input[type=checkbox]').get();
        let allCheckboxes = titleCheckboxes.concat(itemCheckboxes);
        let batchSize = 250;
        let index = 0;

        function finishBulkSelection() {
            let $syncTarget = itemCheckboxes.length ? $(itemCheckboxes[0]) : $(titleCheckboxes[0]);

            if ($syncTarget.length) {
                $syncTarget.trigger('change');
            }

            kurumSecimTopluIslemCalisiyor = false;
            kurumSecimButonDurumu($selectionContainer, false);
        }

        function applyChunk() {
            let end = Math.min(index + batchSize, allCheckboxes.length);

            for (; index < end; index++) {
                allCheckboxes[index].checked = isChecked;
                allCheckboxes[index].indeterminate = false;
            }

            if (index < allCheckboxes.length) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(applyChunk);
                } else {
                    setTimeout(applyChunk, 0);
                }
                return;
            }

            finishBulkSelection();
        }

        applyChunk();
    }

    let $kurumTree = $("#kurumlar").next(".tree-multiselect");
    let $kurumSelectionContainer = $kurumTree.find("> .selections");

    $kurumSelectionContainer.find('.select-all').off('click').on('click', function (e) {
        e.preventDefault();
        topluKurumSecimiUygula($kurumSelectionContainer, true);
    });

    $kurumSelectionContainer.find('.unselect-all').off('click').on('click', function (e) {
        e.preventDefault();
        topluKurumSecimiUygula($kurumSelectionContainer, false);
    });

    let kurumlar;

    $('form[name=pdf-post]').submit(function(e) {

        /**
         * ilgili sınav için kurum bazlı değil de "topluca" değerlendirme yapılıyorsa, progress-bar ' ın varlığında rapor almaya izim vermiyoruz.
         * tekil bir kurum için rapor alınmak istendiğinde ise rapor-liste almaya izin veriyoruz.
         */
        if (socket_curr.sid == report_curr_sid && socket_curr.scope == -1 && $('.iziToast[id$="-toast"]').length) {
            iziToast.error({
                title: "",
                message: "Sınavın tüm kapsamı için ölçme-değerlendirme yapılmaktadır. Tamamlanmasını bekleyiniz.",
                position: "topCenter",
                timeout: 1600
            });
            return false
        }

        let rapor_tipi    = $('#rapor-tip').val();
        let renkli        = $('#renkli').is(':checked');
        let siralamali        = $('#siralamali').is(':checked');
        let siralama_tipi = $('#siralama-tip').val();
        let puan_turu     = $('#puan_turu').val();
        let limit         = $('input[type=number]#limit').val();
        let rapor_kapsam  = $('#rapor-kapsam').val();
        let cikti_tipi    = $('#cikti-tip').val();

        if(kurumlar === undefined || kurumlar.length === 0){
            alert("Lütfen kurum seçimi yapınız");
            e.preventDefault();
        }
        if(rapor_kapsam === null){
            alert("Lütfen rapor kapsamı seçiniz");
            e.preventDefault();
        }
        if((rapor_kapsam =='il-kurum-brans' ||rapor_kapsam == 'ilce-kurum-brans')&&(siralama_tipi=='puan' || siralama_tipi =='alt-ders')){
           alert("Lütfen sıralama şeklini ders net seçiniz");
         e.preventDefault();
        }

    });

    $("#kurumlar").change(function () {
        kurumlar = $(this).val();
    });

    $.rapor_tipi = function (element) {
        $('#get-report').addClass("d-none");
        $('#get-report').attr("disabled", false);
        $('#spinner').removeClass("d-none");
        let action_text = $(element).find(':selected').data('val') +"/";

        let rapor_tipi = $(element).find(':selected').data('id');
        let cikti_tipi = $(element).find(':selected').data('tipi');

        $('#rapor-kapsam').empty();
        $('#cikti-tip').empty();

        $.post(base_url + "kapsam_getir", {rapor_id: rapor_tipi}, function (response) {
            let kapsamlar = JSON.parse(response);
            kapsamlar.forEach(function (kapsam) {
                $('#get-report').removeClass("d-none");
                $('#rapor-kapsam').append(`<option value="${kapsam.value}">${kapsam.ad}</option>`);
            });
            if(cikti_tipi === "pdf") {
                $('#cikti-tip').append('<option value="pdf" selected>PDF</option>');
            }else {
                $('#cikti-tip').append(`
                        <option value="pdf" selected>PDF</option>
                        <option value="excel">Excel</option>
                     `);
            }
            $('#spinner').addClass("d-none");
        })

    };

    $.cikti_tipi = function (element) {

        let cikti_tipi = $(element).find(':selected').val();
        let rapor_tipi = $("#rapor-tip").find(':selected').data('id');

        if(cikti_tipi=='il-kurum-brans' || cikti_tipi=='ilce-kurum-brans' || cikti_tipi=='kumilatif-kurum'){
           $('#cikti-tip').empty();
           $('#cikti-tip').append('<option value="excel" selected>Excel</option>');
        }else{
           $('#get-report').addClass("d-none");
           $('#get-report').attr("disabled", false);
           $('#spinner').removeClass("d-none");
           let rapor_tipi = $("#rapor-tip").find(':selected').data('id');
           let cikti_tipi = $("#rapor-tip").find(':selected').data('tipi');
           $('#cikti-tip').empty();
           if(cikti_tipi === "pdf") {
               $('#cikti-tip').append('<option value="pdf" selected>PDF</option>');
           }else {
               $('#cikti-tip').append(`
                       <option value="pdf" selected>PDF</option>
                       <option value="excel">Excel</option>
                    `);
           }
           $('#spinner').addClass("d-none");
           $('#get-report').removeClass("d-none");

        }

    };

    $("#siralama-tip").change(function () {
        let statu = $(this).val();

            if(statu === "ders") {
                $("#puan_turu").empty();
                $.post(base_url + "ders_getir", {sinav_id: exam_info[3]}, function (response) {
                    let dersler = JSON.parse(response);
                    $.each(dersler, function (index, ders) {
                        $("#puan_turu").append(`
                            <option value="${index}|${ders.ders_id}">${ders.ders_adi}</option>
                        `);
                    })
                })

            } else if(statu === "alt-ders") {
                $("#puan_turu").empty();
                $.post(base_url + "alt_ders_getir", {sinav_id: exam_info[3]}, function (response) {
                    let dersler = JSON.parse(response);
                    $.each(dersler, function (index, ders) {
                        $("#puan_turu").append(`
                            <option value="${index}|${ders.alt_ders_id}">${ders.ders_adi}</option>
                        `);
                    })
                })

            } else if(statu === "puan") {
                $("#puan_turu").empty();
                $.post(base_url + "formul_getir", {sinav_id: exam_info[3]}, function (response) {
                    let formuller = JSON.parse(response);
                    $.each(formuller, function (index, formul) {
                        $("#puan_turu").append(`
                            <option value="${formul.formul_id}|${formul.formul_adi}">${formul.formul_adi}</option>
                        `);
                    })
                })
            }

    })

});
