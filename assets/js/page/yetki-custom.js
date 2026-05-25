var _kryDataGrid = new KryDataGrid({
    id: "#datagrid",
    url: "dataGridList",
    maxRow: 10,
    cols:[
        {name:"#id", column:"id"},
        {name:"Kullanıcı Adı", column: "yetki_adi"},
        {name:"", renderer:function(_id){
                return '<div class="d-flex flex-row"><button id="'+_id+'" class="btn btn-float btn-sm btn-info ml-2" onclick="$.updateYetki('+_id+')" type="button" data-toggle="tooltip" data-placement="top" title="Formul Düzenle"><i class="material-icons">edit</i></button>'+
                    '<button id="'+_id+'" class="btn btn-float btn-sm btn-danger ml-2"  onclick="$.deleteYetki('+_id+')" type="button" data-toggle="tooltip" data-placement="top" title="Formul Sil"><i class="material-icons">delete_forever</i></button></div>';
            }}
    ],
    orderBy: "id",
    orderType: "ASC",
});
$(document).ready(function(){

    $.updateYetki = function(id) {
        window.location.href = "update_form/" + id;
    };

});
