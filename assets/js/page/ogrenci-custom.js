$(document).ready(function(){

    let il_post    = null;
    let ilce_post  = null;
    let institu_no = '';
    let class_id   = '';
    let branch     = '';

    $.secili_il = function (element) {
        let il_no = $(element).val();
        $('#ilceler').empty();
        $('#kurumlar').empty();
        $('#ilceler').append("<option selected disabled>İlçe Seçiniz</option>");

        il_post = $.il_post(il_no)
    };

    $.il_post = function (il_no) {
        return $.post("ilce_getir",{il_no: il_no}, function (response) {
            let ilceler = JSON.parse(response);
            ilceler.forEach(function (ilce) {
                $('#ilceler').append(`
                    <option value="${ilce.id}">${ilce.ilce_adi}</option>
                `);
            })
        });
    };

    $.secili_ilce = function(element) {
        let ilce_id = $(element).val();
        $('#kurumlar').empty();

        ilce_post = $.ilce_post(ilce_id);
    };

    $.ilce_post = function(ilce_id) {
        return $.post("kurum_getir",{ilce_id: ilce_id}, function (response) {

            let kurumlar = JSON.parse(response);
            kurumlar.forEach(function (kurum) {
                $('#kurumlar').append(`
                    <option value="${kurum.kurum_no}">${kurum.kurum_adi}</option>
                `);
            })
        });
    };

    $.updateStudent = function (id) {
        window.location.href = "update_form/" + id;
    };

    $.deleteStudent = function(id){
        swal({
            title: 'Emin misiniz?',
            text: "Bu işlemi geri alamayacaksınız!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post(  "delete", {delete_student: id}, function (response) {
                    console.log(response);
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

    $('#inputGroupFile04').change(function() {
        let $el = $(this), files = $el[0].files, label = files[0].name;

        $el.next('.custom-file-label').html(label);
    });

    $('#remove-students').click(function () {
        institu_no = $('#del-kurum-no').val();
        class_id   = $('#del-sinif').val();
        branch     = $('#del-sube').val();
        if(institu_no !== '' &&  class_id !== '' && branch !== '') {
            $.post("bayi_kontrol", {kurum_no: institu_no, sinif: class_id, sube: branch}, function (response) {
                let result = JSON.parse(response);
                if(result.status === 'success') {
                    $.alertDeleteStudent(result.institution_name.kurum_adi, result.count_institution, 'sube');
                }else {
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Böyle bir kurum bulunamdı.",
                        position: "topCenter"
                    });
                }
            });

        } else if(institu_no !== '' &&  class_id !== '' && branch === '') {
            $.post("bayi_kontrol", {kurum_no: institu_no, sinif: class_id}, function (response) {
                let result = JSON.parse(response);
                if(result.status === 'success') {
                    $.alertDeleteStudent(result.institution_name.kurum_adi, result.count_institution, 'sinif');
                }else {
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Böyle bir kurum bulunamdı.",
                        position: "topCenter"
                    });
                }
            });

        }else if(institu_no !== '' &&  class_id === '' && branch === '') {
            $.post("bayi_kontrol", {kurum_no: institu_no}, function (response) {
                let result = JSON.parse(response);
                if(result.status === 'success') {
                    $.alertDeleteStudent(result.institution_name.kurum_adi, result.count_institution, 'kurum');
                }else {
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Böyle bir kurum bulunamdı.",
                        position: "topCenter"
                    });
                }
            });
        }else {
            iziToast.error({
                title: "İşlem Başarısız",
                message: "En az bir kurum numarası girilmelidir.",
                position: "topCenter"
            });
        }
    });

    $.alertDeleteStudent = function(kurum_adi, toplam_ogrenci, status){
        swal({
            title: 'Emin misiniz?',
            text: kurum_adi + " adlı kurumdan " + toplam_ogrenci + ' adet öğrenci silinecektir' ,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                if(status === 'kurum'){
                    $.post("delete_student", {kurum_no: institu_no}, function (response) {
                        let result = JSON.parse(response);
                        if(result.status === 'success') {
                            iziToast.success({
                                title: "İşlem Başarılı",
                                message: "Silme işlemi başarıyla gerçekleşti",
                                position: "topCenter"
                            });
                            $('#modal-bulk-remove').modal('hide');
                            $('#button-refresh').trigger('click');
                        } else {
                            iziToast.error({
                                title: "İşlem Başarısız",
                                message: "Silme işlemi sırasında bir hata oluştu.",
                                position: "topCenter"
                            });
                        }
                    })
                }else if(status === 'sinif'){
                    $.post("delete_student", {kurum_no: institu_no, sinif: class_id}, function (response) {
                        let result = JSON.parse(response);
                        if(result.status === 'success') {
                            iziToast.success({
                                title: "İşlem Başarılı",
                                message: "Silme işlemi başarıyla gerçekleşti",
                                position: "topCenter"
                            });
                            $('#modal-bulk-remove').modal('hide');
                            $('#button-refresh').trigger('click');
                        } else {
                            iziToast.error({
                                title: "İşlem Başarısız",
                                message: "Silme işlemi sırasında bir hata oluştu.",
                                position: "topCenter"
                            });
                        }
                    })
                }else if(status === 'sube'){
                    $.post(  "delete_student", {kurum_no: institu_no, sinif: class_id, sube: branch}, function (response) {
                        let result = JSON.parse(response);
                        if(result.status === 'success') {
                            iziToast.success({
                                title: "İşlem Başarılı",
                                message: "Silme işlemi başarıyla gerçekleşti",
                                position: "topCenter"
                            });
                            $('#modal-bulk-remove').modal('hide');
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
            }
        });
    };

    $('#remove-all-students').click(function () {
        swal({
            title: 'Emin misiniz?',
            text: "Sistemde bulunan bütün öğrenciler silinecektir",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post(  "remove_all_student", {}, function (response) {
                    let result = JSON.parse(response);
                    if(result.status === 'success') {
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
                        $('#modal-bulk-remove').modal('hide');
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
    });

    $('.btnFrmSubmit').on('click', function () {
        var self = $(this),
            frm = $('form');
        $('input', frm).removeClass('bg-warning');
        self.cLoader();
        $('.kurumNo', frm).each(function (i) {
            $(this)
                .removeClass('bg-warning')
                .attr('cstm', $(this).val())
            ;
        });

        $.post('save_excel_data', {jsonData:JSON.stringify(frm.serializeObject())}, function(resp) {
            self.rLoader();
            if (!resp.success) {
                switch (typeof resp.custom) {
                    case 'object':
                        iziToast.error({
                            title: "İşlem Başarısız",
                            message: resp.msg.join('<br>'),
                            position: "topCenter"
                        });
                        $.each(resp.custom, function (i, item) {
                            $('input[cstm="'+item+'"]', frm).addClass('bg-danger');
                        });
                    break;
                    default :
                    iziToast.error({
                        title: "UYARI",
                        message: "Excel import gerçekleştirilirken bir hata oluştu <br>"+resp.msg.join('<br>'),
                        position: "topCenter",
                        timeout: false
                    });
                }
            }
            else {
                let m = '';

                if (resp.kayitli_ogrenciler===null) {

                   Swal.fire({
                       // icon: 'warning',
                       title: 'İşlem başarılı',
                       html: m,
                       confirmButtonText: 'Öğrenci listesine git'
                   }).then((result) => {
                       location.href = '/ogrenciler/listele';
                   });
                   return;
                }
               if (resp.kayitli_ogrenciler.length) {
                  $.each(resp.kayitli_ogrenciler, function (i,item) {
                       $('[_v="'+item+'"]').addClass('bg-warning');
                  });
                  m += '<p>&middot; Kurumda kayıtlı öğrenciler üzerinde işlem yapmaya çalışıyorsunuz. Öğrenci nolar :</p>';
                  m += resp.kayitli_ogrenciler.join('<br>');
                  m += '<hr>';
               }


                $('.tbl-xls-rows tbody .ogrNo:not(.bg-warning)').closest('tr').remove();

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

});
