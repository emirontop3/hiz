$(document).ready(function(){

    let base_url = window.location.origin + "/veri_havuzu/";

    $.editFile = function (id) {
        window.location.href = base_url + "duzenle/" + id;
    };

    $.deleteRow = function(e) {
        swal({
            title: 'Emin misiniz?',
            text: "Bu veri silenecektir.Geri alamazsınız!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
               var id = $(e).attr("data-id");
               var sinav_id = $(e).attr("data-sinav");
                $.post( base_url + "delete_row", {id: id,sinav_id:sinav_id}, function (response) {
                    let resultStatus = JSON.parse(response);
                    if(resultStatus.status === "success") {
                        $('#row_'+id).remove();
                    }else{
                       if(resultStatus.type=="2"){
                          iziToast.error({
                              title: "İşlem Başarısız",
                              message: "Sıralamanın değişmemesi için silme işlemini gerçekleştiremezsiniz.Yöneticiye başvurunuz.",
                              position: "topCenter"
                          });
                       }
                    }
                })
            }
        });
    };

    $.deleteFile = function(file_id) {
        swal({
            title: 'Emin misiniz?',
            text: "Bu dosyaya ait tüm kayıtlar silinecektir!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText : 'Hayır'
        }).then(function (result) {
            if (result.value) {
                $.post( base_url + "delete", {delete_file: file_id}, function (response) {
                    let resultStatus = JSON.parse(response);
                    if(resultStatus.status === "success") {
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
                        $('#button-refresh').trigger('click');
                    } else {
                        if(resultStatus.type==="2"){
                           iziToast.error({
                               title: "İşlem Başarısız",
                               message: "Sıralamanın değişmemesi için silme işlemini gerçekleştiremezsiniz.Yöneticiye başvurunuz.",
                               position: "topCenter"
                           });
                        }else{
                           iziToast.error({
                               title: "İşlem Başarısız",
                               message: "Silme işlemi sırasında bir hata oluştu.",
                               position: "topCenter"
                           });

                        }

                    }
                })
            }
        });
    };


    $('#delete-students-data').click(function () {
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
      exam_id = $('#del-sinav-id').val();
      institu_no = $('#del-kurum-no').val();
      class_id   = $('#del-sinif').val();
      branch     = $('#del-sube').val();
         if (result.value) {
              $.post(  "/veri_havuzu/delete_student_data", {sinav_id: exam_id,kurum_no: institu_no, sinif: class_id, sube: branch}, function (response) {
                  let result = JSON.parse(response);
                  if(result.status === 'success') {
                      iziToast.success({
                          title: "İşlem Başarılı",
                          message: "Silme işlemi başarıyla gerçekleşti",
                          position: "topCenter"
                      });
                      $('#modal-b-remove').modal('hide');
                      $('#button-refresh').trigger('click');
                  }else if(result.status === 'false'){
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Sınav id alanını boş bırakmayınız.",
                        position: "topCenter"
                    });
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


 $.deleteStudent = function(student_data_id) {
     swal({
         title: 'Emin misiniz?',
         text: "Bu veri silinecektir!",
         type: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Evet, Sil!',
         cancelButtonText : 'Hayır'
     }).then(function (result) {
         if (result.value) {
             $.post( base_url + "deleteStudent", {student_data_id: student_data_id}, function (response) {
                 let resultStatus = JSON.parse(response).status;
                 if(resultStatus === "success") {
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

});
