$(document).ready(function(){

    $('#save-btn-fmt').click(function () {
        if(document.getElementById("inputGroupFile04").value){
			$(this).addClass("d-none");
			$('.spiner').removeClass("d-none");
		}
		else {
			//$('.spiner').removeClass("d-none");
			alert ("Lütfen dosya yükleyiniz");
		}
    });

});