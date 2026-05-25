$(document).ready(function () {  $('#kodla-btn-test').click(function (e) {
      e.preventDefault();
      $("#main-form").attr('action',  "test_et");
      $('#main-form').submit();
  });

    $('#kodla-btn').click(function (e) {
        var type = $('#list_type :selected').val();
        if(type != 1 && type != 2){
            iziToast.error({
                title: "İşlem Başarısız",
                message: "Sıralama türünü seçiniz.",
                position: "topCenter"
            });
            return;
        }
        e.preventDefault();
        $("#main-form").attr('action', "create_pdf");
        $('#main-form').submit();
    });

  // $('#kodla-btn').click(function (e) {
  //     e.preventDefault();
  //     $("#main-form").attr('action', "create_pdf");
  //     $('#main-form').submit();
  // });

  $('#liste-etiket').click(function (e) {
      e.preventDefault();
      $("#main-form").attr('action',  "poset");
      $('#main-form').submit();
  });

  $('#liste-pdf').click(function (e) {
      e.preventDefault();
      $("#main-form").attr('action', "ogrenci");
      $('#main-form').submit();
  });
  $('#liste-excel').click(function (e) {
      e.preventDefault();
      $("#main-form").attr('action', "excel_katilim");
      $('#main-form').submit();
  });
  $('#save-sub-form'). click(function (e) {
      e.preventDefault();
      let space_x = $('#round-space-x').val();
      let space_y = $('#round-space-y').val();
      let value_x = $('#value-x').val();
      let value_y = $('#value-y').val();
      $.post("save", {aralik_x: space_x, aralik_y: space_y, x_degeri: value_x, y_degeri: value_y}, function (response) {
          console.log(response)
          let result = JSON.parse(response).status;
          if(result === "success") {
              $('#hid-space-x').val(space_x);
              $('#hid-space-y').val(space_y);
              $('#hid-x').val(value_x);
              $('#hid-y').val(value_y);

              iziToast.success({
                  title: "İşlem Başarılı",
                  message: "Başarılı bir şekilde Optik kodlama düzenlendi.",
                  position: "topCenter"
              });
              $('#button-refresh').trigger('click');
          } else {
              iziToast.error({
                  title: "İşlem Başarısız",
                  message: "Optik kodlama düzenleme sırasında bir hata oluştu.",
                  position: "topCenter"
              });
          }
      })
  });

  $.secili_grup = function(element) {
      let grup_id = $(element).val();
      $('#exam').empty();
      $('#exam').append("<option selected disabled>Sınav Seçiniz</option>");

      sinav_post = $.sinav_post(grup_id);
  };

  $.sinav_post = function(grup_id) {
      return $.post("sinav_getir",{grup_id: grup_id}, function (response) {
          let sinavlar = JSON.parse(response);

          sinavlar.forEach(function (sinav) {
              $('#exam').append(`
                  <option value="${sinav.id}">${sinav.sinav_adi}</option>
              `);
          })
      });
  };

  $.secili_sinav= function(element) {

      var selectElement = document.getElementById("sube_salon");
      var selectsube_salon = selectElement.value;
      // console.log(selectsube_salon);
      let sinav_id  = $(element).val();
      let sinav_adi = $(element).children("option:selected").text();

      $.post("ogrenci_getir", {sinav_id: sinav_id,sube_salon:selectsube_salon}, function (response) {
          let sinav = JSON.parse(response);

          $(".tree-multiselect").remove();
          $(".ogrenciler").empty();
          $.each(sinav, function (key, value) {


              if(selectsube_salon==1){

                  if (parseInt(value.sube_ogrenci_adet) >= 10) {
                           $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+"/"+value.sinif+" - "+value.sinif_adet+""+"' >"+value.sinif+"-"+value.sube+" - "+value.sube_ogrenci_adet+""+"</option>");
                  }
                  // if (parseInt(value.sube_ogrenci_adet) < 10) {
                  //    // continue;
                  //     $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+"/"+value.sinif+" - "+value.sinif_adet+""+"' disabled>"+value.sinif+"-"+value.sube+" - "+value.sube_ogrenci_adet+""+"</option>");
                  // } else {
                  //     $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+"/"+value.sinif+" - "+value.sinif_adet+""+"' >"+value.sinif+"-"+value.sube+" - "+value.sube_ogrenci_adet+""+"</option>");
                  // }
                  // $('#ogrenciler').change(function() {
                  //     if ($(this).find(":selected").attr('disabled')) {
                  //         alert("Bu şube 10'dan az öğrenci içerdiği için seçilemez.");
                  //
                  //         $(this).val($(this).find("option:not(:disabled)").first().val());
                  //
                  //
                  //     }
                  // });

              }
              else{
                  $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.salon+"/"+value.sube_ogrenci_adet+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+""+"' >"+value.salon+" - "+value.sube_ogrenci_adet+""+"</option>");
                  
              }

              //$('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" ("+value.ekleyen_id+")/"+value.il_adi+" ("+value.il_no+")/"+value.ilce_adi+" ("+value.id+")/"+value.kurum_adi+" ("+value.kurum_no+") ' >"+value.sinif+"-"+value.sube+"("+value.sube_ogrenci_adet+")"+"</option>");
              //  ---- $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+"/"+value.sinif+" - "+value.sinif_adet+""+"' >"+value.sinif+"-"+value.sube+" - "+value.sube_ogrenci_adet+""+"</option>");
              // $('#ogrenciler').append("<option value='"+value.kurum_no+"/"+value.sinif+"/"+value.sube+"' data-section='"+value.bayi_isim+" - "+value.ekleyen_adet+"/"+value.il_adi+" - "+value.il_adet+"/"+value.ilce_adi+" - "+value.ilce_adet+"/"+value.kurum_adi+" - "+value.kurum_adet+"/"+value.salon+" - "+value.salon_say+"/"+value.salon+"' >"+value.salon+"- "+value.salon_say+"</option>");


          });
          $("#ogrenciler").treeMultiselect('destroy');

      });



  };

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





});
