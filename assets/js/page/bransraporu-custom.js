let sinavlar = [];

function add(e) {
    const id     = $(e).attr('id');
    let sinavadi = $($($(e).parents()[1]).children()[1]).html();
    let tarih    = $($($(e).parents()[1]).children()[2]).html();
    let tur      = $($($(e).parents()[1]).children()[3]).html();
    let flag     = true;
    sinavlar.forEach(element => { if (element[0] == id) { flag = false; } });
    Notiflix.Notify.success('Sınav eklendi',{
             position:'right-bottom',
        distance:'40px',
        clickToClose:true,
        fontAwesomeClassName:'fas fa-check-circle'
        
    });
    if (flag == true) { sinavlar.push([id, sinavadi, tarih, tur]); $("#sData").append(` <tr> <th scope="row">${id}</th> <td>${sinavadi}</td> <td>${tarih}</td> <td>${tur}</td> <td><button onclick="removeItem(${id})" style="padding:3px; " class="btn btn-sm btn-info">Kaldır</button></td> </tr>`); }
    $("#sendBtn").removeClass('disabled');
}

function removeItem(id){
    $("#sData").empty();
    sinavlar_ = [];
    sinavlar.forEach(sinav => { if(sinav[0] != id){ sinavlar_.push(sinav); } });
    sinavlar = sinavlar_;
    sinavlar_ = null;
    sinavlar.forEach(element => { $("#sData").append(` <tr> <th scope="row">${element[0]}</th> <td>${element[1]}</td> <td>${element[2]}</td> <td>${element[3]}</td> <td><button onclick="removeItem(${element[0]})" style="padding:3px; " class="btn btn-sm btn-info">Kaldır</button></td> </tr>`); });
    if(sinavlar.length > 0){ $("#sendBtn").removeClass('disabled'); }else{ $("#sendBtn").addClass('disabled'); }
       Notiflix.Notify.warning('Sınav kaldırıldı',{
        position:'right-bottom',
        distance:'40px',
        clickToClose:true,
        fontAwesomeClassName:'fas fa-check-circle'
        
    });
}


function raporal(){
   if(sinavlar.length > 0){
    sinavIDS = [];
    sinavlar.forEach(element => { sinavIDS.push(element[0]); });


    $.redirect('/karsilastirmali/get_brans_raporu' ,{sinavIDS}, "POST");
   
   }
}
