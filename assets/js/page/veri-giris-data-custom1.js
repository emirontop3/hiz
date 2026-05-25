$(document).ready(function(){

	$('#veri_grisi_btn').click(function () {
		location.href = '/veri_giris/new_form';
	});

	$('#veri_raporal_btn').click(function () {
		window.location = window.location.origin + '/sinavlar/listele';
	});

	$('#veri_kaydet_btn').show().click(function () {

		let tbody = $('#vtable > tbody');
		let liste = [];
		let dosya = [];

		tbody.children("tr").each(function() {
			id = $(this).attr('id');
			if(typeof id !== 'undefined'){

				liste.push({ ad_soyad : $('#'+id+"-a").val(),
					ogr_no : $('#'+id+"-b").val(),
					sinif : $('#'+id+"-c").val(),
					sube : $('#'+id+"-d").val(),
					kitapcik : $('#'+id+"-j").val(),
					kurum_no : $('#'+id+"-e").val(),
					ilce_id : $('#'+id+"-f").val(),
					il_no : $('#'+id+"-g").val(),
					tc_no : $('#'+id+"-h").val(),
					oturum : $('#'+id+"-i").val(),
					telefon : $('#'+id+"-k").val(),
					cinsiyet : $('#'+id+"-l").val(),
					bolum_alan : $('#'+id+"-m").val(),
					dinmuaf : $('#'+id+"-n").val(),
					ders : $('#'+id+"-o").val(),
					dosya_id : $('#'+id+"-p").val()
				});

			}
		});

		let l = $('.dosya_bilgileri').length;
		// zaten o selector ile tek nesne var dongu acmak ne alaka :)
		for (let i = 0; i < l; i++) {
			dosya.push($('.dosya_bilgileri').eq(i).val());
		}

		if (liste.length > 1250) {
			localStorage.setItem('curr_kurum', JSON.stringify(JSON.parse(dosya[0])[0].kurum));
			iziToast.error({
				title: "",
				message: "Tek seferde yüklenebilecek öge sayısı limiti :<b><u>1250</u></b><br>Seçtiğiniz .txt sayısını azaltınız",
				position: "topCenter",
				timeout: false,
				onClosing: function() {
					history.back();
				}
			});
			return;
		}
		localStorage.removeItem('curr_kurum');

		$(this).addClass("d-none");
		$('.spiner').removeClass("d-none");

		$.post("verileri_kaydet", {liste: JSON.stringify(liste), dosya:dosya}, function (response) {

			let result = JSON.parse(response);
			if(result.status === true) {
				$('.spiner').addClass("d-none");
				$('#veri_grisi_btn').removeClass("d-none");
				$('#veri_raporal_btn').removeClass("d-none");
				Swal.fire({
					title: 'Yüklemeniz başarıyla gerçekleşti',
					text: "( veri girişi ekranına yönlendirileceksiniz )",
					type: 'success',
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Tamam'
				}).then((result) => {
					location.href = '/veri_giris/new_form';
				});
			} else {
				iziToast.error({
					title: "İşlem Başarısız",
					message: "Veri yükleme işlemi sırasında bir hata oluştu.",
					position: "Center"
				});
			}
		});
	});

	$.changethis = function(element) {
		let veri = $(element).val();
		let id = $(element).attr('id')

		if (id.indexOf("-") >= 0){

			let items = id.split("-");
			if(items.length==2){
				let	type = items[1];

				switch(type) {
					case "a":
					{
						if(veri.trim()=="")
							$(element).addClass("bg-danger");
						else
							$(element).removeClass("bg-danger");
					}
						break;
					case "b":
					{
						if(veri.trim()=="" || veri.trim()==0)
							$(element).addClass("bg-danger");
						else
							$(element).removeClass("bg-danger");
					}
						break;
					case "c":
					{
						if(veri.trim()=="" )
							$(element).addClass("bg-danger");
						else
							$(element).removeClass("bg-danger");
					}
						break;
					case "d":
					{
						if(veri.trim()=="" || $.isNumeric(veri))
							$(element).addClass("bg-danger");
						else
							$(element).removeClass("bg-danger");
					}
						break;
					case "j":
					{
						$(element).removeClass("bg-danger");
						if(veri.trim()=="")
							$(element).addClass("bg-warning");
						else
							$(element).removeClass("bg-warning");
					}
						break;
					default:
					// code block
				}
			}
		}
	};


});