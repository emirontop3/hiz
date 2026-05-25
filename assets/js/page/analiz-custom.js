$(document).ready(function() {

    /*
        let ctx = document.getElementById("chart_bar_yuzde").getContext("2d");
        let myChart = new Chart(ctx, {
            type: "horizontalBar",
            data: {
                labels: ["Türkiye", "İl", "İlçe", "Okul", "Sınıf"],
                datasets: [
                    {
                        label: "Quota Eni mensile",
                        backgroundColor: [
                            "rgba(255, 0, 153, 1)",
                            "rgba(255, 0, 153, 1)",
                            "rgba(255, 0, 153, 1)",
                            "rgba(255, 0, 153, 1)",
                            "rgba(255, 255, 153, 1)"

                        ],
                        borderColor: [
                            "rgba(255, 255, 153, 1)",
                            "rgba(255, 255, 153, 1)",
                            "rgba(255, 255, 153, 1)",
                            "rgba(255, 255, 153, 1)",
                            "rgba(255, 255, 153, 1)"

                        ],
                        borderWidth: 0.7,
                        data: [10, 11, 18, 10, 13]
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [
                        {
                            ticks:{
                                maxRotation: 90,
                                minRotation: 90,
                                display: "top"
                            },

                        }
                    ],
                    yAxes: [
                        {
                            display: false
                        }
                    ]
                },
                tooltips: {
                    enabled: true
                },
                maintainAspectRatio: true,
                responsive: true
            }
        });

        myChart.options.tooltips.enabled = true;

        Chart.plugins.register({
            id: "responsiveXlabels",
            beforeDraw: function(c) {
                var chartHeight = c.chart.height;
                var size = (chartHeight * 2.5) / 100;
                var xAxis = c.scales["x-axis-0"];
                xAxis.options.ticks.minor.fontSize = size;
                xAxis.height = 10;
                xAxis.minSize.height = 10;
                c.options.scales.xAxes[0].ticks.padding = -size * 4.5;
                xAxis.margins.bottom = size * 12.5;
            },
            afterDraw: function(c) {
                c.options.scales.xAxes[0].ticks.padding = -158;
            }
        });

    */


    let paket_post = null;
    let grup_post = null;
    let sinav_post = null;

    /*   $.secili_donem = function(element) {
        let donem_id = $(element).val();
        $('#paket').empty();
        $('#grup').empty();
        $('#paket').append("<option selected disabled>Sınav Paketi Seçiniz</option>");

        paket_post = $.paket_post(donem_id)
    };

    $.paket_post = function(donem_id) {
        return $.post("/giris/paket_getir", { donem_id: donem_id }, function(response) {
            let paketler = JSON.parse(response);
            paketler.forEach(function(paket) {
                $('#paket').append(`
                    <option value="${paket.id}">${paket.paket_adi}</option>
              `)
            })
        })
    };

    $.secili_paket = function(element) {
        let paket_id = $(element).val();
        $('#grup').empty();
        $('#sinavlar').empty();
        $('#grup').append("<option selected disabled>Sınav Grubu Seçiniz</option>");

        grup_post = $.grup_post(paket_id);
    };
*/
    $.grup_post = function(paket_id) {
        return $.post("/giris/grup_getir", { paket_id: paket_id }, function(response) {
            let gruplar = JSON.parse(response);
            gruplar.forEach(function(grup) {
                $('#grup').append(`
                    <option value="${grup.id}">${grup.grup_adi}</option>
              `)
            })
        });
    };



    $.secili_sinav_analiz = function(element) {
        let sinav_id = $(element).val();
        $.post("/giris/subeleri_getir_analiz", { sinav_id: sinav_id }, function(response) {
            let subeler = JSON.parse(response);
            $("#subeler").empty();
            subeler.forEach(function(sube) {
                $('#subeler').append(`
						<option value="${sube}">${sube}</option>
					`);
            })
        });

        $.post("/giris/sinav_dersleri_getir_analiz", { sinav_id: sinav_id }, function(response) {
            let dersler = JSON.parse(response);
            $("#dersler").empty();
            $('#dersler').append(`<option value="all">Hepsi</option>`);
            let sayi = 0;
            dersler.forEach(function(ders) {
                $('#dersler').append(`<option value="${sayi}">${ders.ders_adi}</option>`);
                sayi++;
            })
        });

    };

    $.secili_islem = function(id) {
        let islem = id;
        let ders = $('#dersler').val();
        let sinav_id = $('#sinavlar').val();
        let sube = $('#subeler').val();

        $.post("/giris/islem_analiz", { sinav_id: sinav_id, ders: ders, sube: sube, islem: islem }, function(response) {
            console.log(response);
            $("#result_div").empty();
            $("#result_div").html(response);
        });
    };

    // son eklenen sınav verisine göre alanları otomatik doldurma
    let exam_info = $("#exam-info").val().split("/");

    $('#sinav-donemi').val(exam_info[0]).trigger('change');
    paket_post.then(function() {
        $('#paket').val(exam_info[1]).trigger('change');

        grup_post.then(function() {
            $('#grup').val(exam_info[2]).trigger('change');
            sinav_post.then(function() {
                $('#sinavlar').val(exam_info[3]).trigger('change');
            })
        })
    });

    // son eklenen sınav verisine göre alanları otomatik doldurma



});