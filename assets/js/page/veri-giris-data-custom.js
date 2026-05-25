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

		var hata = 0;
		var yildizhata = 0;
		// var nohata = 0;
		var kritikhata = 0;
		var yildizliSatirlar = [];
		var kritikSatirlar = [];
		// var hataliNolar = [];

		function search(nameKey, myArray){
			for (var i=0; i < myArray.length; i++) {
				if (myArray[i].ad_soyad.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
				else if (myArray[i].ogr_no.indexOf(nameKey) >= 0) {
					if(myArray[i].tc_no.indexOf(nameKey) >= 0){
						kritikhata++;
						kritikSatirlar.push(i+1);
					} else if(myArray[i].tc_no == null || myArray[i].tc_no == "" || myArray[i].tc_no == "           " || myArray[i].tc_no == 0){
						kritikhata++;
						kritikSatirlar.push(i+1);
					}
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
				else if (myArray[i].sinif.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].sube.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].kitapcik.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].kurum_no.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].ilce_id.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].il_no.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
				else if (myArray[i].tc_no.indexOf(nameKey) >= 0) {
					if(myArray[i].ogr_no == null || myArray[i].ogr_no == ""){
						kritikhata++;
						kritikSatirlar.push(i+1);
					}
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
				else if (myArray[i].oturum.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].telefon.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].cinsiyet.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].bolum_alan.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].dinmuaf.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].ders.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
			}
		}

		liste.forEach(function (resp, key) {
			if(resp['ogr_no'] == null || resp['ogr_no'] == ""){
				if(resp['tc_no'] == null || resp['tc_no'] == "" || resp['tc_no'] == "           " || resp['tc_no'] == 0){
					kritikhata++;
					kritikSatirlar.push(key+1);
				}
			}
		});

		var resultObject = search("*", liste);

		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var unique = yildizliSatirlar.filter(onlyUnique);
		var uniqueKritik = kritikSatirlar.filter(onlyUnique);

		if(kritikhata > 0){
			Swal.fire({
				title: 'Yükleme tamamlanamadı. \n\n Kritik verilerde hata mevcut, verinizi kontrol edin.',
				text: 'Kritik veri hataları Öğrenci Numarası/TC No da yaşanmaktadır. \n\n Hatalı Satırlar:'+uniqueKritik,
				type: 'error',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Tamam'
			});
			return;
		}

		// for (var i=0; i < liste.length; i++) {
		// 	for (var idx=0; idx < i; idx++) {
		// 		if (liste[idx].ogr_no === liste[i].ogr_no && liste[idx].ad_soyad !==  liste[i].ad_soyad && liste[idx].ogr_no != 0) {
		// 			nohata++;
		// 			hataliNolar.push(liste[idx].ogr_no);
		// 		}
		// 	}
		// }
		//
		// if(nohata > 0){
		// 	Swal.fire({
		// 		title: 'Yükleme tamamlanamadı. \n\n Aynı öğrenci numaralarına sahip öğrenciler mevcut.',
		// 		text: 'Hatalı Numaralar:'+hataliNolar,
		// 		type: 'error',
		// 		confirmButtonColor: '#3085d6',
		// 		confirmButtonText: 'Tamam'
		// 	});
		// 	return;
		// }


		if(hata > 0){
			Swal.fire({
				title: 'Yükleme tamamlanamadı. \n\n Veri içerisinde hatalar mevcut, kırmızılı alanları kontrol edin.',
				type: 'error',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Tamam'
			});
			return;
		}


		if(yildizhata > 0){
			swal({
				title: 'Verinizin içerisinde * bulunmakta!',
				text: "* içeren veriler sonuçlarınızın doğru yansımamasına sebep olur, işleme devam etmek istiyor musunuz? \n\n Hatalı Satırlar:"+yildizliSatirlar,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				confirmButtonText: 'Yine de Verileri Yükle!',
				cancelButtonText : 'İptal'
			}).then(function (result) {
				if (result.value) {
					$(this).addClass("d-none");
					$('.spiner').removeClass("d-none");

					$.post("verileri_kaydet", {liste: JSON.stringify(liste), dosya:dosya, hata: 1}, function (response) {

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
				} else {
					return;
				}
			});
		} else {

			$(this).addClass("d-none");
			$('.spiner').removeClass("d-none");

			$.post("verileri_kaydet", {liste: JSON.stringify(liste), dosya: dosya, hata: 0}, function (response) {

				let result = JSON.parse(response);
				if (result.status === true) {
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
		}
	});
	$('#veri_kaydet_btn_toplu').show().click(function () {

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
					dosya_id : $('#'+id+"-p").val(),
					sinav_id : $('#'+id+"-s").val()
				});
				// console.log("buradda");



			}
		});
		// console.log(liste);
		// return;

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

		var hata = 0;
		var yildizhata = 0;
		// var nohata = 0;
		var kritikhata = 0;
		var yildizliSatirlar = [];
		var kritikSatirlar = [];
		// var hataliNolar = [];

		function search(nameKey, myArray){
			for (var i=0; i < myArray.length; i++) {
				if (myArray[i].ad_soyad.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].ogr_no.indexOf(nameKey) >= 0) {
					if(myArray[i].tc_no.indexOf(nameKey) >= 0){
						kritikhata++;
						kritikSatirlar.push(i+1);
					} else if(myArray[i].tc_no == null || myArray[i].tc_no == "" || myArray[i].tc_no == "           " || myArray[i].tc_no == 0){
						kritikhata++;
						kritikSatirlar.push(i+1);
					}
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].sinif.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].sube.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].kitapcik.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].kurum_no.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].ilce_id.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].il_no.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
				// else if (myArray[i].tc_no.indexOf(nameKey) >= 0) {
				// 	if(myArray[i].ogr_no == null || myArray[i].ogr_no == ""){
				// 		kritikhata++;
				// 		kritikSatirlar.push(i+1);
				// 	}
				// 	yildizliSatirlar.push(i+1);
				// 	yildizhata++;
				// }
				else if (myArray[i].oturum.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].telefon.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].cinsiyet.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].bolum_alan.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].dinmuaf.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				} else if (myArray[i].ders.indexOf(nameKey) >= 0) {
					yildizliSatirlar.push(i+1);
					yildizhata++;
				}
			}
		}

		liste.forEach(function (resp, key) {
			if(resp['ogr_no'] == null || resp['ogr_no'] == ""){
				if(resp['tc_no'] == null || resp['tc_no'] == "" || resp['tc_no'] == "           " || resp['tc_no'] == 0){
					kritikhata++;
					kritikSatirlar.push(key+1);
				}
			}
		});

		var resultObject = search("*", liste);

		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var unique = yildizliSatirlar.filter(onlyUnique);
		var uniqueKritik = kritikSatirlar.filter(onlyUnique);

		if(kritikhata > 0){
			Swal.fire({
				title: 'Yükleme tamamlanamadı. \n\n Kritik verilerde hata mevcut, verinizi kontrol edin.',
				text: 'Kritik veri hataları Öğrenci Numarası/TC No da yaşanmaktadır. \n\n Hatalı Satırlar:'+uniqueKritik,
				type: 'error',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Tamam'
			});
			return;
		}

		// for (var i=0; i < liste.length; i++) {
		// 	for (var idx=0; idx < i; idx++) {
		// 		if (liste[idx].ogr_no === liste[i].ogr_no && liste[idx].ad_soyad !==  liste[i].ad_soyad && liste[idx].ogr_no != 0) {
		// 			nohata++;
		// 			hataliNolar.push(liste[idx].ogr_no);
		// 		}
		// 	}
		// }
		//
		// if(nohata > 0){
		// 	Swal.fire({
		// 		title: 'Yükleme tamamlanamadı. \n\n Aynı öğrenci numaralarına sahip öğrenciler mevcut.',
		// 		text: 'Hatalı Numaralar:'+hataliNolar,
		// 		type: 'error',
		// 		confirmButtonColor: '#3085d6',
		// 		confirmButtonText: 'Tamam'
		// 	});
		// 	return;
		// }


		if(hata > 0){
			Swal.fire({
				title: 'Yükleme tamamlanamadı. \n\n Veri içerisinde hatalar mevcut, kırmızılı alanları kontrol edin.',
				type: 'error',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Tamam'
			});
			return;
		}


		if(yildizhata > 0){
			swal({
				title: 'Verinizin içerisinde * bulunmakta!',
				text: "* içeren veriler sonuçlarınızın doğru yansımamasına sebep olur, işleme devam etmek istiyor musunuz? \n\n Hatalı Satırlar:"+yildizliSatirlar,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				confirmButtonText: 'Yine de Verileri Yükle!',
				cancelButtonText : 'İptal'
			}).then(function (result) {
				if (result.value) {
					$(this).addClass("d-none");
					$('.spiner').removeClass("d-none");

					$.post("verileri_kaydet_toplu", {liste: JSON.stringify(liste), dosya:dosya, hata: 1}, function (response) {

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
								location.href = '/veri_giris/new_form_toplu';
							});
						} else {
							iziToast.error({
								title: "İşlem Başarısız",
								message: "Veri yükleme işlemi sırasında bir hata oluştu.",
								position: "Center"
							});
						}
					});
				} else {
					return;
				}
			});
		} else {

			$(this).addClass("d-none");
			$('.spiner').removeClass("d-none");

			$.post("verileri_kaydet_toplu", {liste: JSON.stringify(liste), dosya: dosya, hata: 0}, function (response) {

				let result = JSON.parse(response);
				if (result.status === true) {
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
						location.href = '/veri_giris/new_form_toplu';
					});
				} else {
					iziToast.error({
						title: "İşlem Başarısız",
						message: "Veri yükleme işlemi sırasında bir hata oluştu.",
						position: "Center"
					});
				}
			});
		}
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