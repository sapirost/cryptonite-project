
const arrCoins = [];
$(document).ready(() => {
    showCoins();
    $(".nav-link").on("click", (e) => {
        let ea = e.target.id;
        if (ea != 'nav-home') {
            $.ajax({
                type: "GET",
                url: `${ea}.html`,
                success: function (results) {
                    $(".container-content").html(results);
                    $(".nav-item").each(function () {
                        $(this).removeClass("active");
                    });
                    $(`#${ea}`).parent().addClass("active");
                },
            });
        }
        else {
            $(".nav-item").each(function () {
                $(this).removeClass("active");
            });
            $("#nav-home").addClass("active");
        }
    });

    $("#searchBTN").on("click", () => {
        var value = $("#searchCoin").val().trim().toLowerCase();
        if (value!="") {
        var arrByID = arrCoins.filter(function (item) {
            for (var i = 0; i < value.length; i++) {
                var boole = true;
                if (item.symbol[i] != value[i]) {
                    boole = false;
                    break;
                }
            }
            return boole;
        });
        $(".container-content").empty();
        if (arrByID.length>0) {
            for (var index=0;index<arrByID.length;index++) {
                appendCoin(arrByID[index]);
            }
        }
         else {
            $(".container-content").html(`<div class=error><i class="fas fa-exclamation-triangle"></i><p>Not Found</p></div>`);
         }
       } 
    });
});

$(document).ajaxStart(function () {
    $(".container-content").html(`<div class="loading"><i class="fa fa-refresh fa-spin"></i><h1>Loading...</h1></div>`);
});
$(document).ajaxStop(function () {
    $(".loading").remove();
});


function showCoins() {
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
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coin.id}`,
        success: function (results) {
            var coinValue = `USD ${results.market_data.current_price.usd.toFixed(5)}$
            EUR ${results.market_data.current_price.eur.toFixed(5)}€
            ILS ${results.market_data.current_price.ils.toFixed(5)}₪`;
            $(".container-content").append(
                `<div class="card"><img class="card-img-top" src=${results.image.large} alt="Card image cap">
            <div class="card-body"><h5 class="card-title">${coin.symbol.toUpperCase()}</h5>
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
