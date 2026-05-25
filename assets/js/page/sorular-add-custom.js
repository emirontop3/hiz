$(document).ready(function(){

    let url_path = window.location.pathname.split('/');
    let sinav_id = url_path[url_path.length-1];
    let base_url = window.location.origin + "/sinavlar";
    let save_url = window.location.origin + "/sinavlar/save_questions";
    let sub_lessons = [];
    let kazanimlar = [];
    let alt_dersler  = [];
    let lesson_id, branch, branch_id, cevaplar;

    $.post(base_url + '/get_all_lessons', {}, function (response) {
        sub_lessons = JSON.parse(response);
    });

    $.chosenLesson = function (ders_id) {
        lesson_id = $(ders_id).val();
        $(ders_id).attr("disabled", true);

        $('#branch-a').removeClass("d-none");
        $('#branches').removeClass("d-none");

        $.post(base_url + '/tum_kazanimlar', {ders_id: lesson_id}, function (response) {
            kazanimlar = JSON.parse(response);
        });

    };

    $('#generate-question').click(function () {

        $(this).attr("disabled", true);
        $("#generate-branch").attr("disabled", false);
        cevaplar =  $('#answers').val().toUpperCase().split("");

        $('#content-question').append(
            `<div class="col-6">
                <div class="card mb-3 ml-3 mt-3">
                    <div class="card-body">
                        <h6 class="card-title mt-2 question text-black text-center"> Sorular <span>A Kitapçığı</span></h6>
                        <form method="post" id="1" onchange="$.akitap()">
                            <div class="form-row text-center">
                                <div class="col-md-3 mb-1">
                                    <label for="validationServerUsername"><b>Cevap</b></label>
                                </div>
                                <div class="col-md-3 mb-1 ml-1">
                                    <label for="validationServer01">Alt Ders</label>
                                </div>
                                <div class="col-md-4 mb-1 ml-2">
                                    <label for="validationServer02">Kazanım</label>
                                </div>
                            </div>
                            <input type="hidden" name="toplam_soru" value="${cevaplar.length}">
                            <div id="question-list">
                      
                            </div>
                            <div class="row justify-content-between">
                                <div class="col-3">
                                    <button type="button" onclick="$.deleteLetters(this)" class="btn btn-danger btn-sm">Sil</button>
                                </div>
                                <div class="col-2">
                                    <button type="button" onclick="$.branchAControl(this,'1')" class="btn btn-success btn-sm">Kontrol</button>
                                </div>
                                <div class="col-3">
                                    <button onclick="$.saveQuestions('1')" id="akitapcik" class="btn btn-primary btn-sm" disabled>Kaydet</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`
        );


        $.each(cevaplar, function (index, value) {
            $.addQuestion(index, value);
        });
    });

    $.addQuestion = function (index, value) {

        $('#question-list').append(
            `<div class="form-row justify-content-around">
                <div class="col-md-3 mb-3">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend3">${index + 1}</span>
                        </div>
                        <input class="form-control form-control-sm" name="cevap${index + 1}" placeholder="Cevap" value="${value}" type="text">
                    </div>
                </div>
                <input type="hidden" name="exam_data${index + 1}" value="${sinav_id}/${lesson_id}/1">
                <div class="col-md-3 mb-3">
                    <select name="altders${index + 1}" id="altders${index + 1}" class="form-control form-control-sm alt-ders">
                        
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <select name="kazanim${index + 1}" id="kazanim${index + 1}" class="form-control form-control-sm kazanim">
                        
                    </select>
                </div>
            </div>`
        );
        $('.alt-ders').empty();
        sub_lessons.forEach( function (element) {
            $('.alt-ders').append(
                `<option value="${element.id}" ${element.id === "1" ? "selected": ""}>${element.ders_adi}</option>`
            );
        });
        $('.kazanim').empty();
        $('.kazanim').append(
            `<option selected disabled>Seçiniz</option>`
        );
        kazanimlar.forEach( function (kazanim) {
            $('.kazanim').append(
                `<option value="${kazanim.id}" >${kazanim.kodu}</option>`
            );
        });

    };
    // a kitapçığı bitiş

    // kitapçık Seçimi
    $("#generate-branch").click( function () {
        $('#branch-mach').removeClass("d-none");

        branch    = $('#choose-branch option:selected').text();
        branch_id = $('#choose-branch option:selected').val();
        $('.kitapcik').text(branch);

        $('#generate-question-match').removeAttr("disabled")
        $('#match').text("");

    });

    // kitapçığı oluşturma
    $('#generate-question-match').click(function () {
        $(this).attr('disabled', 'true');
        let capraz =  $('#match').val().split(',');

        $('#content-question').append(
            `<div class="col-6">
                <div class="card mb-3 mr-3 mt-3">
                    <div class="card-body">
                        <h6 class="card-title mt-2 question text-black text-center"> Sorular <span>${branch}</span></h6>
                        <form method="post" id="${branch_id}">
                            <div class="form-row text-center">
                                <div class="col-md-3 mb-1">
                                    <label for="validationServerUsername"><b>Cevap</b></label>
                                </div>
                                <div class="col-md-3 mb-1 ml-1">
                                    <label for="validationServer01">Çapraz</label>
                                </div>
                                <div class="col-md-4 mb-1 ml-2">
                                    <label for="validationServer02">Kazanım</label>
                                </div>
                            </div>
                            <input type="hidden" name="toplam_soru" value="${cevaplar.length}">
                            <div id="question-list-${branch_id}">
                      
                            </div>
                            <div class="row justify-content-between">
                                <div class="col-3">
                                    <button type="button" onclick="$.deleteLetters(this)" class="btn btn-danger btn-sm">Sil</button>
                                </div>
                                <div class="col-2">
                                    <button type="button" onclick="$.branchAControl(this, '${branch_id}')" class="btn btn-success btn-sm">Kontrol</button>
                                </div>
                                <div class="col-3">
                                    <button onclick="$.saveQuestions('${branch_id}')" class="btn btn-primary btn-sm save-kitapcik" disabled>Kaydet</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`
        );

        $.each(capraz, function (index, value) {
            $.addBranchQuestion(index, value, sub_lessons);
        });
    });

    $.akitap = function() {
        $('#akitapcik').attr('disabled', 'false');
        $('.save-kitapcik').attr('disabled', 'false');
        alt_dersler = [];
    };

    $.addBranchQuestion = function (index, value) {
        $('#question-list-' + branch_id).append(
            `<div class="form-row justify-content-around">
                <div class="col-md-3 mb-3">
                    <div class="input-group">
                        <input class="form-control form-control-sm" name="cevap${index + 1}" placeholder="Cevap" value="${cevaplar[index]}" type="text">
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="input-group">
                        <input class="form-control form-control-sm" name="capraz${index + 1}" placeholder="Çapraz" value="${value}" type="text">
                        <input type="hidden" name="altders${index + 1}" class="altders${index + 1}" value="">
                    </div>
                </div>
                <input type="hidden" name="exam_data${index + 1}" value="${sinav_id}/${lesson_id}/${branch_id}">
                <div class="col-md-4 mb-3">
                    <select name="kazanim/${branch_id}/${index + 1}" id="kazanim/${branch_id}/${index + 1}" class="form-control form-control-sm kazanim-${branch_id}">
                            
                    </select>
                </div>
            </div>`
        );

        $('.kazanim-'+ branch_id).empty();
        $('.kazanim-'+ branch_id).append(
            `<option selected disabled>Seçiniz</option>`
        );
        kazanimlar.forEach( function (kazanim) {
            $('.kazanim-'+ branch_id).append(
                `<option value="${kazanim.id}" >${kazanim.kodu}</option>`
            );
        });
    };

    $.branchAControl = function (element, id) {

        $.post(base_url + '/control_exam_lesson', {ders_id: lesson_id, sinav_id: sinav_id, kitapcik_turu: id}, function (response) {
            let result_lesson = JSON.parse(response);
            if(result_lesson === "false"){
                $.formValidateControl(element);
            }else{
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Bu derse ait sorular zaten eklenmiş. Dersi silip tekrar deneyiniz",
                    position: "topCenter"
                });
            }
        });


        if(id === "1"){
            alt_dersler = [];
            let soru_say = cevaplar.length;
            for(let i=1; i<=soru_say; i++){
                alt_dersler.push($('#altders' + i).val());
            }

        }else {
            $.each(alt_dersler, function (index, value) {
                $('.altders' + (index + 1)).val(value)
            });
        }
        console.log(alt_dersler);
    };

    $.formValidateControl = function (element) {
        // if(parseInt(emptyInput) > 0 ){
        //     alert("Lütfen Boş Alan Bırakmayınız")
        // }else {
            $(element).parent('div').next().children().attr("disabled", false);
        // }
    };

    $.saveQuestions = function (id) {
        event.preventDefault();

        $.post(  save_url, $("form#" + id).serialize(), function (response) {
            let result = JSON.parse(response).result;

            if(result === "success"){
                $("form#" + id).hide('slow', function(){ this.remove(); });

                iziToast.success({
                    title: "İşlem Başarılı",
                    message: "Başarılı bir şekilde sınav soruları eklendi.",
                    position: "topCenter"
                });
            }else {
                iziToast.error({
                    title: "İşlem Başarısız",
                    message: "Ekleme işlemi sırasında bir hata oluştu.",
                    position: "topCenter"
                });
            }

        });

    };
    
    $.deleteLetters = function (element) {
        $('#generate-question').removeAttr("disabled")
        $(element).parent('div').parent('div').parent('form').parent('div').parent('div').parent('div').remove();
    }

});