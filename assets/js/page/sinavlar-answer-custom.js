let url_path = window.location.pathname.split('/');
let id = url_path[url_path.length-1];

var _kryDataGrid = new KryDataGrid({
    id: "#datagrid",
    url: "/sinavlar/dataGridListAnswer/" + id,
    maxRow: 10,
    cols:[
        {name:"#id", column:"id"},
        {name:"Ders", column: "ders_adi"},
        {name:"Kitapçık", column: "kitapcik"},
        {name:"Sira", column: "sira"},
        {name:"Cevap", column: "cevap"},
        {name:"Çapraz", column: "capraz"},
        {name:"", renderer:function(_id){
            return '<div class="d-flex flex-row">' +
                '<button id="'+_id+'" class="btn btn-float btn-sm btn-info ml-2" onclick="$.updateQuestion('+_id+')" data-toggle="modal" data-target="#modal-question-edit" type="button" data-toggle="tooltip" data-placement="top" title="Soru Düzenle"><i class="material-icons">edit</i></button>' +
                '</div>';
        }}
    ],
    orderBy: "id",
    orderType: "ASC",
});

$(document).ready(function(){

    $.lessonSeach = function( name) {
        $('#input-search').attr("value", name);

        $('#select-search').val('Ders').trigger('change');
        $('#button-search').trigger('click');
        $('#alt-ders').addClass("d-none");
    };
    $.subLessonSeach = function(id, adi) {
        let val = 10 + Number(id);

        $('#input-search').attr("value", Number(val));

        $('#select-search').val('Ders').trigger('change');
        $('#button-search').trigger('click');

        $('#sub-lesson').text(adi);
        $('#alt-ders').removeClass("d-none");

    };
    $.deleteLesson = function(element, ders_id) {
        let base_url = window.location.origin + "/sinavlar/delete_lesson";
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
                $.post( base_url, {delete_ders: ders_id, sinav_id: id}, function (response) {
                    let resultStatus = JSON.parse(response).status;
                    if(resultStatus === "success") {
                        iziToast.success({
                            title: "İşlem Başarılı",
                            message: "Silme işlemi başarıyla gerçekleşti",
                            position: "topCenter"
                        });
                        $('#button-refresh').trigger('click');
                        $(element).parent('div').parent('div').remove();
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

    $.updateQuestion = function (id) {
        let base_url = window.location.origin + "/sinavlar/update_question_form/" + id;

        $.post(base_url, {}, function (response) {
            let question = JSON.parse(response).question;

            $('#answer_edit').val(question.cevap);
            $('#answer_edit').attr("data-id", id);
            $('#match_edit').val(question.capraz);
            $('#kazanim_id').val(question.kazanim_id);
            $('#ac').val(question.kazanim);
        });
    };

    $('#soru-duzenle').click(function () {
        let id       = $('#answer_edit').attr("data-id");
        let base_url = window.location.origin + "/sinavlar/update_question/" + id;
        let answer   = $('#answer_edit').val();
        let match    = $('#match_edit').val();

       if( answer === "" || match === ""){
           alert("Lütfen boş alan bırakmayınız");
       }else {
            $.post(base_url,$('#institution-edit-form').serialize(), function (response) {
                $('#modal-question-edit').modal('hide');

                let status = JSON.parse(response).status;

                if(status === "success") {
                    iziToast.success({
                        title: "İşlem Başarılı",
                        message: "Güncelleme işlemi başarıyla gerçekleşti",
                        position: "topCenter"
                    });
                    $('#button-refresh').trigger('click');
                } else {
                    iziToast.error({
                        title: "İşlem Başarısız",
                        message: "Güncelleme işlemi sırasında bir hata oluştu.",
                        position: "topCenter"
                    });
                }

            })
       }
	   
    });

    $("#ac").tinycomplete({
        requesturl: "/sinavlar/search_kazanim",
        tpl: {
            item: '<li class="tc-item" data-hidden-val="{id}">' +
				'{kazanim}' +
			'</li>'
        },
    });
});