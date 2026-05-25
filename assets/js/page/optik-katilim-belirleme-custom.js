$(document).ready(function () {
   $("#belirlenmis_katilimlar").treeMultiselect({

      showSectionOnSelected: false,
      freeze: true,
      hideSidePanel: true

   });
    $("#ogrenciler").treeMultiselect({

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

        // Disables selection/deselection of options; aka display-only Tıklama devre dışı
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

    $('#setup').click(function () {
        $(this).addClass("d-none");
        $('.spiner').removeClass("d-none");
        setTimeout(function(){
            $('#setup').removeClass("d-none");
            $('.spiner').addClass("d-none");
        }, 6000);
    });


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
               var sinav_id = $(id).attr("data-sinav");
               var ogr_id = $(id).attr("data-ogr");

                $.post(  "delete_student", {sinav_id: sinav_id,ogr_id: ogr_id}, function (response) {
                    console.log(response);
                    if(response === "success") {
                        iziToast.success({
                           title: "İşlem Başarılı",
                           message: "Silme işlemi başarıyla gerçekleşti",
                           position: "topCenter"
                        });
                        $('.item_'+sinav_id+'_'+ogr_id).remove();
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
