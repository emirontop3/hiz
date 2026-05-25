$(document).ready(function() {

    let count_click = 1;

    $.addFormula = function () {
        count_click++;
        $('.add-formul').append(
            `<div class="row input-group justify-content-around mt-3">
                <div class="input-group-prepend col-4">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Formül ${count_click}: </span>
                </div>
                <div class="col-6">
                    <select name="exam_formul[]" class="custom-select formulaother">
                        <option value="" selected disabled>Seçiniz</option>
                    </select>
                </div>
            </div>`
        );

        $.post(  window.location.origin + "/sinavlar/get_all_formula",{}, function (response) {
            let formula = JSON.parse(response);

            formula.forEach(function (formul) {
                $('.formulaother').append(`<option value="${formul.id}">${formul.formul_adi} - ${formul.notlar.slice(0,44)}</option>`);
            })
        });

    };

    $.change_packet = function(element) {
        $("#exam_group").empty()
        $.post( window.location.origin + "/sinavlar/get_group_for_packet",{paket_id: $(element).val()}, function (response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function (grup) {
                $("#exam_group").append(`<option value="${grup.id}">${grup.grup_adi}</option>`)
            })
        });
    };

    $('.frmSinavUpdate').on('submit', function () {
        var self = $(this);

        var els = $('.options_online input[disabled!="disabled"][name!=""], .options_online select[disabled!="disabled"][name!=""]');
        $('._options', self).val(JSON.stringify(elements_to_json(els)));
        $('.options_online input', self).attr('disabled', 'disabled');

        $('.btnSubmit').cLoader();
        $.post('/sinavlar_online/update/'+sinavID, self.serialize(), function (resp) {
            $('.btnSubmit').rLoader();
            if (resp.success) {
                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Sınav kaydı başarıyla güncellendi.",
                    position: "topCenter",
                    onClosing: function() {
                        location.href = '/sinavlar_online/listele';
                    }
                });
                return;
            }
            iziToast.error({
                title: "İşlem Başarısız",
                position: "topCenter",
                message: resp.msg.join('<br>')
            });
        });
        return false;
    });

    if ($('.pdf-sorular').length)
    {
        $('.pdf-sorular').tinyfinder({
            type: 'file',
            buttons: {
                archive: false,
                download: true
            }
        });
    }

});