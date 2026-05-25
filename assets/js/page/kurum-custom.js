$(document).ready(function(){

    let form_error_no        = true;
    let form_error_no_edit   = false;
    let form_error_name      = true;
    let form_error_name_edit = false;
    let no, name, edit_no, edit_name;

    $("#institution_no").focusout( function () {
        no = $("#institution_no").val();
        $.check_no(no, "#alertNo", "add");
    });

    $("#institution_no_edit").focusout( function () {
        edit_no = $("#institution_no_edit").val();
        $.check_no(edit_no, "#alertEditNo", "edit");
    });

    $("#institution_name").focusout( function () {
        name = $("#institution_name").val();
        $.check_name(name, "#alertName", "add");
    });

    $("#institution_name_edit").focusout( function () {
        edit_name = $("#institution_name_edit").val();
        $.check_name(edit_name, "#alertEditName", "edit");
    });

    $.check_no = function (no, alertId, type) {

        if (type === "add"){
            if(  no < 99999) {
                $(alertId).removeClass("d-none");
                form_error_no = true;
                $.check_form();
            }else{
                form_error_no = false;
                $(alertId).addClass("d-none");
                $.check_form();
            }
        }else if (type === "edit") {
            if(  no < 99999) {
                $(alertId).removeClass("d-none");
                form_error_no_edit = true;
                $.check_form_edit();
            }else{
                form_error_no_edit = false;
                $(alertId).addClass("d-none");
                $.check_form_edit();
            }
        }
    };

    $.check_name = function(name, alertId, type) {

        if (type === "add") {
            if(name === "") {
                form_error_name = true;
                $(alertId).removeClass("d-none");
                $.check_form();
            } else {
                $(alertId).addClass("d-none");
                form_error_name = false;
                $.check_form();
            }
        } else if(type === "edit") {
            if(name === "") {
                form_error_name_edit = true;
                $(alertId).removeClass("d-none");
                $.check_form_edit();
            } else {
                $(alertId).addClass("d-none");
                form_error_name_edit = false;
                $.check_form_edit();
            }
        }
    };

    $.check_form = function() {
        if(form_error_no === false && form_error_name === false && $("#input-il").val() > 0) {
            $('#kurum_ekle').attr("disabled", false);
        }else {
            $('#kurum_ekle').attr("disabled", true);
        }
    };

    $.check_form_edit = function() {
        //console.log(form_error_no_edit + " " + form_error_name_edit + " " + $("#input-il-edit").val() );
        if(form_error_no_edit === false && form_error_name_edit === false && $("#input-il-edit").val() > 0) {
            $('#kurum_duzenle').attr("disabled", false);
        }else {
            $('#kurum_duzenle').attr("disabled", true);
        }
    };

    $("#kurum_ekle").click(function() {

        if(form_error_no === false && form_error_name === false && $("#input-il").val() > 0 ) {
            $("#kurum_ekle").addClass("d-none");
            $("#kurum_iptal").addClass("d-none");
            $("#add-progress").removeClass("d-none");

            var fd = new FormData();
            var files = $('#file')[0].files;
            if(files.length > 0 ){
               fd.append('file',files[0]);
               }
               fd.append('kurum_no',no);
               fd.append('kurum_adi',name);
               fd.append('il_no',$("#input-il").val());
               fd.append('ilce_no',$("#input-ilce").val());


               $.ajax({
                 url: '/kurumlar/add',
                 type: 'post',
                 data: fd,
                 contentType: false,
                 processData: false,
                 success: function(response){
                    if(response != 0){
                       var json_response = JSON.parse(response);
                       if(json_response.status == 'already_add'){
                          iziToast.info({
                             title: "İşlem Başarısız",
                             message: "Kurum kodu kullanılıyor.",
                             position: "topCenter"
                         });
                         return;
                       }
                       iziToast.success({
                           title: "İşlem Başarılı",
                           message: "Başarılı bir şekilde kurum eklendi.",
                           position: "topCenter"
                       });
                       $('#modal-institution-add').modal('hide');
                       $("#kurum_ekle").removeClass("d-none");
                       $("#kurum_iptal").removeClass("d-none");
                       $("#add-progress").addClass("d-none");
                       setTimeout( function () {
                           $('#button-refresh').trigger('click');
                       }, 2000);
                    }else{
                       iziToast.error({
                           title: "İşlem Başarısız",
                           message: "Kurum ekleme sırasında bir hata oluştu.",
                           position: "topCenter"
                       });
                       $('#modal-institution-add').modal('hide');
                       $("#kurum_ekle").removeClass("d-none");
                       $("#kurum_iptal").removeClass("d-none");
                       $("#add-progress").addClass("d-none");
                    }
                 },
               });




        }else {
            return false;
        }
    });

    $("#kurum_duzenle").click(function () {

            var fd = new FormData();
            var files = $('#file_edit')[0].files;
            fd.append('file',files[0]);
            fd.append('kurum_no',$("#institution_no_edit").val());
            fd.append('kurum_adi',$("#institution_name_edit").val());
            fd.append('il_no',$("#input-il-edit").val());
            fd.append('ilce_id',$("#input-ilce-edit").val());

            $.ajax({
             url: 'https://hizlideneme.com/kurumlar/update/'+ $("#update_institution_id").val(),
             type: 'post',
             data: fd,
             contentType: false,
             processData: false,
             success: function(response){
                 if(response != 0){
                    iziToast.success({
                        title: "İşlem Başarılı",
                        message: "Başarılı bir şekilde kurum eklendi.",
                        position: "topCenter"
                    });
                    $('#modal-institution-edit').modal('hide');
                    $("#kurum_ekle").removeClass("d-none");
                    $("#kurum_iptal").removeClass("d-none");
                    $("#add-progress").addClass("d-none");
                    setTimeout( function () {
                        $('#button-refresh').trigger('click');
                    }, 2000);
                 }else{
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Kurum ekleme sırasında bir hata oluştu.",
                        position: "topCenter"
                    });
                     $('#modal-institution-edit').modal('hide');
                    $("#kurum_ekle").removeClass("d-none");
                    $("#kurum_iptal").removeClass("d-none");
                    $("#add-progress").addClass("d-none");
                 }
             },
            });
      /* $.post("update/" + $("#update_institution_id").val(),
            {
                kurum_no:  $("#institution_no_edit").val(),
                kurum_adi: $("#institution_name_edit").val(),
                il_no:     $("#input-il-edit").val(),
                ilce_id:   $("#input-ilce-edit").val()
            },
            function (responses) {
                let response = JSON.parse(responses);

                if(response.status === "success"){
                    iziToast.success({
                        title: "İşlem Başarılı",
                        message: "Başarılı bir şekilde kurum güncellendi.",
                        position: "topCenter"
                    });
                    $('#modal-institution-edit').modal('hide');
                    // $("#kurum_ekle").removeClass("d-none");
                    // $("#kurum_iptal").removeClass("d-none");
                    // $("#add-progress").addClass("d-none");
                    setTimeout( function () {
                        $('#button-refresh').trigger('click');
                    }, 2000);
                }
            });*/
    });

    $("#kurum_iptal_edit").click(function () {
        $("#alertEditNo").addClass("d-none");
        $("#alertEditName").addClass("d-none");
        $('#kurum_duzenle').attr("disabled", false);
        form_error_no_edit   = false;
        form_error_name_edit = false;
    });

    $.updateKurum = function (id) {
        $("#update_institution_id").remove();
        $("#institution-edit-form").append(`<input type="hidden" id="update_institution_id" value="${id}" />`);

        $.post( "update_form", {update_id: id}, function (responses) {
            let response = JSON.parse(responses);

            $('#institution_no_edit').val(response.result[0].kurum_no);
            $('#institution_name_edit').val(response.result[0].kurum_adi);

            $.autoSelectValue(response.result[0].il_no, "iller");

            $.post("ilce_getir" ,{il_no: response.result[0].il_no},function (respo) {
                let res = JSON.parse(respo);
                res.forEach(function (re) {
                    if(response.result[0].ilce_id === re.id) {
                        $("#input-ilce-edit").append( `<option value="${re.id}" selected>${re.ilce_adi}</option>`);
                    }else {
                        $("#input-ilce-edit").append( `<option value="${re.id}">${re.ilce_adi}</option>`);
                    }

                })
            });
        })

    };

    $.autoSelectValue = function(value, input_name){
        $("select[name=" + input_name + "] option:selected").removeAttr("selected");
        $("select[name=" + input_name + "] option[value='"+value+"']").attr("selected", "selected");
    };

    $.deleteKurum = function(id){
        swal({
            title: 'Emin misiniz?',
            text: "Kuruma bağlı öğrenciler silenecektir. Bu işlemi geri alamayacaksınız!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post(  "delete", {delete_id: id}, function (response) {
                    if(response === "success") {
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
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

    $.generateNumber = function () {
        $('#generateNumber').addClass('d-none');
        $('.spinner').removeClass('d-none');

        $.post(  "generate_number", {}, function (response) {
            let number = JSON.parse(response).number;
            $('#institution_no').val(number);
            $('.spinner').addClass('d-none');
            $('#generateNumber').removeClass('d-none');
            $( "#institution_no" ).focus();
        });
    }


    $.openImg = function(id, url){
        $.post("get_img_url", {id: id}, function (responses) {
            let response = JSON.parse(responses).resim;

            $('.popup-img').empty();
            $('.popup-img').append(`<img src="${"https://hizlideneme.com/uploads/kurum_resimleri/"+ response}" class="img-fluid" alt="Responsive image">`);

        })
    };

});
