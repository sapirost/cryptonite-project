const arrCoins = [];
const arrChosen = [];
var counter = 0;
var coinList = "";
const errorMSG = `<i class="fas fa-exclamation-triangle"></i><span>Failed Loading</span>`;
const loadMSG = `<i class="fa fa-refresh fa-spin"></i><span>Loading...</span>`;

$(document).ready(function () {
    showCoins();
    $("#script2").typewriter({
        text: "it's easy to be update . . .",
        waitingTime: 2000,
        cursor: true
    });

    $(".top i").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 2000);
    });

    $(".bottom i").click(function () {
        $("html, body").animate({ scrollTop: $(document).height() }, 2000);
    });

    $('body').on('click', '.extendIcon', function () {
        if ($(this).next().css("display") == "none") {
            $(this).removeClass("fas fa-plus").addClass('fas fa-minus');
            $(this).next().slideDown("slow");
        }
        else {
            $(this).removeClass("fas fa-minus").addClass('fas fa-plus');
            $(this).next().slideUp("slow");
        }
    });

    $(".nav-link").on("click", (e) => {
        let ea = e.target.id;
        navItemStatus(ea);
        $(".container-content").html(`<div class="loadCoins">${loadMSG}</div>`);
        $.ajax({
            type: "GET",
            url: `${ea}.html`,
            success: function (results) {
                $(".container-content").html(results).hide().fadeIn(600);
                switch (ea) {
                    case 'nav-live':
                        uploadChart();
                    break;
                    case 'nav-home':
                        showCoins();
                    break;
                }
            },
            error: function (error) {
                $(".container-content").html(`<div class=error>${errorMSG}</div>`);
            }
        });
    });

    $("#searchBTN").on("click", () => {
        var value = $("#searchCoin").val().trim().toLowerCase();
        $("#searchCoin").val("");
        if (value != "") {
            var arrByID = arrCoins.filter(function (item) {
                return value == item.symbol;
            });
            var page;
            navItemStatus(page);
            $(".container-content").html(`<div class="row allCoins"></div>`);
            if (arrByID.length > 0) {
                for (var index = 0; index < arrByID.length; index++) {
                    appendCoin(arrByID[index]);
                }
            }
            else {
                $(".container-content").html(`<div class=error><i class="fas fa-exclamation-triangle"></i><span>Not Found</span></div>`);
            }
        }
    });

    $("#save").on("click", () => {
        $(".modal-coins input").each(function () {
            let mark = $(this).prop("checked");
            if (mark == false) {
                let coinID = ($(this).attr("id")).slice(7);
                $(`#switch-${coinID}`).prop('checked', mark);
                updateChosenList(coinID);
            }
        });
    });
});

function navItemStatus(item) {
    $(".nav-item").each(function () {
        $(this).removeClass("active");
    });
    if (item != undefined) {
        $(`#${item}`).parent().addClass("active");
    }
}

function showCoins() {
    $(".container-content").append(`<div class="loadCoins">${loadMSG}</div>`);
    $.ajax({
        type: "GET",
        url: 'https://api.coingecko.com/api/v3/coins/list',
        success: function (results) {
            setTimeout(() => {
                arrCoins.splice(0, arrCoins.length);
                for (var i = 0; i < 100; i++) {
                    arrCoins.push(results[i]);
                    appendCoin(results[i]);
                }
                $(".loadCoins").remove();
            }, 1000);
        },
        error: function (error) {
            $(".container-content").html(`<div class=error>${errorMSG}</div>`);
        }
    });
}

function appendCoin(coin) {
    $(".allCoins").append(
        `<div class="col mb-5 mr-5 coin-col">
            <div class="card-design">
                <div class="card-body" id=${coin.id}>
                    <div id="demo1-${coin.id}" class="collapse img">
                        <div class="content"></div>
                    </div>
                    <div class="toggleBTN">
                        <label class="switch"><input type="checkbox" id='switch-${coin.symbol.toUpperCase()}' 
                        onclick='chosen(this.id)'><span class="slider round"></span></label>
                        <h3 class="card-title">${coin.symbol.toUpperCase()}</h3>
                    </div>
                    <h5 class='second-title'>${coin.id}</h5>
                    <button type="button" class="infoBTN" data-toggle="collapse" 
                    data-target="#demo1-${coin.id},#demo2-${coin.id}" aria-expanded="false" 
                    aria-controls="demo1-${coin.id} demo2-${coin.id}" onclick='moreInfo(this.parentNode.id)'>More Info</button>
                        <div id="demo2-${coin.id}" class="collapse info">
                            <div class="content"></div>
                        </div>
                    </div>
            </div>
        </div>`).hide().fadeIn(500);
    arrChosen.filter(function (item) {
        if (coin.symbol.toUpperCase() == item) {
            $(`#switch-${coin.symbol.toUpperCase()}`).prop('checked', true);
        }
    });
}

function moreInfo(id) {
    var changedDiv = $(`#${id}`).parent("div");
    changedDiv.toggleClass("bigger");
    changedDiv.parent("div").toggleClass("bigger");
    if ($(`#${id} button`).attr("aria-expanded") == "false") {
        var coin = JSON.parse(localStorage.getItem(id));
        if (coin !== null && Date.now() - coin.time < (2 * 60 * 1000)) {
            localStorage.setItem(id, JSON.stringify({ "time": Date.now(), "price": coin.price, "img": coin.img }));
            if ($(`#demo1-${id} .content`).html() == "") {
                $(`#demo2-${id} .content`).html(coin.price);
                $(`#demo1-${id} .content`).html(`<img class="card-img-top" src=${coin.img} alt="Card image cap">`);
            }
        }
        else {
            $(`#demo2-${id} .content`).html(`<div class="load">${loadMSG}</div>`);
            $.ajax({
                type: "GET",
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                success: function (results) {
                    setTimeout(() => {
                        $(`#demo1-${id} .content`).html(`<img class="card-img-top" src=${results.image.large} alt="Card image cap">`).hide().fadeIn(1000);
                        var coinValue = `USD ${results.market_data.current_price.usd.toFixed(5)} <i class="fas fa-dollar-sign sign"></i><br>
                        EUR ${results.market_data.current_price.eur.toFixed(5)} <i class="fas fa-euro-sign sign"></i><br>
                        ILS ${results.market_data.current_price.ils.toFixed(5)} <i class="fas fa-shekel-sign sign"></i>`;
                        $(`#demo2-${id} .content`).html(coinValue).hide().fadeIn(1000);
                        var obj = { time: Date.now(), price: coinValue, img: results.image.large }
                        localStorage.setItem(id, JSON.stringify(obj));
                    }, 1000);
                },
                error: function (error) {
                    $(`#demo2-${id} .content`).html(`<div class='smallError'>${errorMSG}</div>`);
                }
            });
        }
    }
}

function chosen(id) {
    var mark = $(`#${id}`).prop("checked");
    var coinID = id.slice(7);
    if (counter < 5) {
        switch (mark) {
            case true:
                counter++;
                arrChosen.push(coinID);
            break;
            case false:
                updateChosenList(coinID);
            break;
        }
    }
    else {
        switch (mark) {
            case true:
                $(`#${id}`).prop('checked', false);
                $(".modal-coins").empty();
                for (var i = 0; i < 5; i++) {
                    var arrByID = arrCoins.filter(function (item) {
                    return arrChosen[i] == item.symbol.toUpperCase();
                    });
                    $(".modal-coins").append(`
                    <div class="col col-sm-4">
                        <div class="card">
                            <label class="switch"><input type="checkbox" id='chosen-${arrByID[0].symbol.toUpperCase()}' checked>
                            <span class="slider round"></span></label>
                            <h3 class="card-title">${arrByID[0].symbol.toUpperCase()}</h3>
                            <span>${arrByID[0].id}</span>
                        </div>
                    </div>`);
                }
                $('#exampleModalCenter').modal('show');
            break;
            case false:
                updateChosenList(coinID);
            break;
        }
    }
}

function updateChosenList(id) {
    for (let i = 0; i < arrChosen.length; i++) {
        if (arrChosen[i] == id) {
            arrChosen.splice(i, 1);
            break;
        }
    }
    counter = arrChosen.length;
}

function uploadChart() {
    if (arrChosen.length == 0) {
        $(".errorMess").css("display", "block");
    }
    else {
        $(".loadChart").css("display", "block");
        var options = {
            title: {
                text: "Real Time Reports screen"
            },
            axisX: {
                title: "chart updates every 2 secs"
            },
            axisY: {
                title: "Coin Value",
                suffix: "$",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
            data: []
        };
        let time = new Date;
        for (let index = 0; index < arrChosen.length; index++) {
            coinList += `${arrChosen[index]},`;
            let yValue1 = 0;
            options.data.push({
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "0.000000$",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: arrChosen[index],
                dataPoints: []
            });
            options.data[index].dataPoints.push({
                x: time.getTime(),
                y: yValue1
            });
            options.data[index].legendText = `${arrChosen[index]} : ${yValue1}$`;
        }
        var chart = $("#chartContainer").CanvasJSChart(options);
        var myVar;
        myVar = setInterval(() => {
            if ($("#chartContainer").length == 0) {
                clearInterval(myVar);
            }
            else {
                callAPI(coinList, options);
            }
        }, 2000);
    }
}

function callAPI(coinList, options) {
    let time = new Date;
    $.ajax({
        type: "GET",
        url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinList}&tsyms=USD`,
        success: function (results) {
            $(".loadChart").css("display", "none");
            if (results.Response == "Error") {
                $(".errorMess").css("display", "block");
            }
            for (let index = 0; index < arrChosen.length; index++) {
                let yValue1 = 0;
                yValue1 = results[arrChosen[index]];
                if (yValue1 != undefined) {
                    options.data[index].dataPoints.push({
                        x: time.getTime(),
                        y: yValue1.USD
                    });
                    options.data[index].legendText = `${arrChosen[index]} : ${yValue1.USD}$`;
                    $("#chartContainer").CanvasJSChart().render();
                }
                else {
                    $(".errorMess").css("display", "block");
                    options.data[index].legendText = `${arrChosen[index]} : Not Found`;
                    $("#chartContainer").CanvasJSChart().render();
                }
            }
        },
        error: function (error) {
            $(".errorMess").css("display", "block");
        }
    });
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    }
    else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}