$(document).ready(function(){
	
	$('#inputGroupFile04').change(function() {
    var $el = $(this),
    files = $el[0].files,
    label = files[0].name;
    if (files.length > 1) {
        label = label;
    }
    $el.next('.custom-file-label').html(label);
	});
	
	        let count_click = 1;

    $.addFormula = function () {
        count_click++;

        $.post("get_all_formula",{}, function (response) {
            let formula = JSON.parse(response);

            formula.forEach(function (formul) {
                $('.formulaother').append(`<option value="${formul.id}">${formul.formul_adi}</option>`);
            })
        });

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

    $('.frmImportExcel').on('submit', function () {
        let self = $(this)
        , els = $('.options_online input[disabled!="disabled"][name!=""], .options_online select[disabled!="disabled"][name!=""]');
        $('._options', self).val(JSON.stringify(elements_to_json(els)));
        $('.options_online input', self).attr('disabled', 'disabled');
        $('.btnSubmit').cLoader();
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


    /*$('select[name="class"]').on('change', function () {
        if ($(this).val() == 14) {
            $('.frmElFormul').hide();
            $('#top_point').val(100).attr('readonly','readonly');
            $('#exam_formul').removeAttr('required');
        }
        else {
            $('.frmElFormul').show();
            $('#top_point').val(500).removeAttr('readonly');
            $('#exam_formul').attr('required', 'required');
        }
    }).change();*/
	
});