const arrCoins = [];
$(document).ready(() => {
    /* appendProgressbar(); */
    showCoins();
    $("#nav-about").on("click", () => {
        $(".container-content").empty();
        /* loading(); */
        $.ajax({
            type: "GET",
            url: "file:///C:/Users/User.DESKTOP-0403MBS/Google%20Drive/full%20stack/second%20project/about.html",

            success: function (results) {
                $(".container-content").append(results);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(document).ajaxStart(function () {
    $(".container-content").append(`<div class="loading"><i class="fa fa-refresh fa-spin"></i><h1>Loading...</h1></div>`);
});
$(document).ajaxStop(function () {
    $(".loading").remove();
});


function showCoins() {
    /* loading(); */
    $.ajax({
        type: "GET",
        url: 'https://api.coingecko.com/api/v3/coins/list',
        success: function (results) {
            $(".container-content").empty();
            for (var i = 0; i < 100; i++) {
                arrCoins.push(results[i]);
                appendCoin(results[i]);
            }
        },
        error: function (error) {
            $(".container-content").empty();
            $(".container-content").append(`<div class=error><i class="fas fa-exclamation-triangle"></i><p>Failed Loading</p></div>`);
        }
    });
}
function appendCoin(coin) {
    /* loading(); */
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coin.id}`,
        success: function (results) {
            var coinValue = `USD ${results.market_data.current_price.usd.toFixed(5)}$
            EUR ${results.market_data.current_price.eur.toFixed(5)}€
            ILS ${results.market_data.current_price.ils.toFixed(5)}₪`;
            $(".container-content").append(
                `<div class="card"><img class="card-img-top" src=${results.image.large} alt="Card image cap">
            <div class="card-body"><h5 class="card-title">${coin.symbol}</h5>
            <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#demo${coin.id}" 
            aria-expanded="false" aria-controls="collapseExample">More Info</button>
           <div id="demo${coin.id}" class="collapse">${coinValue}</div></div></div>`);
        },
        error: function (error) {
            /* $(".container-content").empty();
            $(".container-content").append(`<div class=error><i class="fas fa-exclamation-triangle fa-3x"></i><p>Failed Loading</p></div>`); */
            console.log(error);
        }
    });
}
/* function loading() {
    $(".container-content").append(`<div class="loading"><i class="fa fa-refresh fa-spin"></i><h1>Loading...</h1></div>`);
} */