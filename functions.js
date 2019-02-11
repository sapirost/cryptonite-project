const arrCoins = [];
const arrChosen = [];
var counter = 0;
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

    $(".nav-item").on({
        mouseenter: function () {
            $(this).children(".coin").addClass("animate");
        },
        mouseleave: function () {
            $(this).removeClass("animate");
        },
    });

    $("#searchBTN").on("click", () => {
        var value = $("#searchCoin").val().trim().toLowerCase();
        if (value != "") {
            var arrByID = arrCoins.filter(function (item) {
                return value == item.symbol;
            });
            $(".container-content").empty();
            if (arrByID.length > 0) {
                for (var index = 0; index < arrByID.length; index++) {
                    appendCoin(arrByID[index]);
                }
            }
            else {
                $(".container-content").html(`<div class=error><i class="fas fa-exclamation-triangle"></i><p>Not Found</p></div>`);
            }
        }
    });

    $("#save").on("click", () => {
        $(".modal-coins input").each(function(){
            let mark = $(this).prop("checked");
            if (mark == false) {
            let coinID = ($(this).attr("id")).slice(7);
            $(`#switch-${coinID}`).prop('checked', mark);
              for (let i=0;i<arrChosen.length;i++) {
                if (arrChosen[i] == coinID) {
                    arrChosen.splice(i, 1);
                    break;
                }
              }
            }
        });
    });
});

function showCoins() {
    $.ajax({
        type: "GET",
        url: 'https://api.coingecko.com/api/v3/coins/list',
        success: function (results) {
            $(".container-content").empty();
            arrCoins.splice(0, arrCoins.length);
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
            $(".container-content").append(
                `<div class="card" id="card-design"><label class="switch"><input type="checkbox"  id='switch-${coin.id}' onclick='chosen(this.id)'>
              <span class="slider round"></span></label>
              <img class="card-img-top" src=${results.image.large} alt="Card image cap">
              <div class="card-body" id=${coin.id}><h3 class="card-title">${coin.symbol.toUpperCase()}</h5>
              <div>${coin.id}</div>
              <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#demo${coin.id}" 
              aria-expanded="false" aria-controls="demo${coin.id}" onclick='moreInfo(this.parentNode.id)'>More Info</button>
              <div id="demo${coin.id}" class="collapse info"></div></div></div>`);
              arrChosen.filter(function (item) {
                if (coin.id == item) {
                    $(`#switch-${coin.id}`).prop('checked', true);
                }
            });
        },
        error: function () {
            //in case 1 of the first 100 coins failed loading - bring another coin

        }
    });
}

/* $(".btn-info").on("click", () => {
    var id = this.parentNode.id;
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        success: function (results) {
            $(`#${id} i,#${id} i span`).remove();
            $(`#${id}`).html(`USD ${results.market_data.current_price.usd.toFixed(5)} <i class="fas fa-dollar-sign"></i><br>
            EUR ${results.market_data.current_price.eur.toFixed(5)} <i class="fas fa-euro-sign"></i><br>
            ILS ${results.market_data.current_price.ils.toFixed(5)} <i class="fas fa-shekel-sign"></i>`)
        },
        error: function (error) {
            $(`#demo${id}`).html(`<div class=error><i class="fas fa-exclamation-triangle"></i><p>Failed Loading</p></div>`);
        }
    });
}); */

function moreInfo(id) {
    var collapse = $(`#${id}`).children("button").attr('aria-expanded');
    if (collapse == "false") {
        var coin = JSON.parse(localStorage.getItem(id));
        if (coin !== null && Date.now() - coin.time < (2 * 60 * 1000)) {
            coin.time = Date.now();
            $(`#demo${id}`).html(coin.price).hide().fadeIn(1000);

        } else {
            $(`#demo${id}`).html(`<i class="fa fa-refresh fa-spin"></i><span>Loading...</span>`);
            setTimeout(() => {
                $.ajax({
                    type: "GET",
                    url: `https://api.coingecko.com/api/v3/coins/${id}`,
                    success: function (result) {
                        var coinValue = `USD ${result.market_data.current_price.usd.toFixed(5)} <i class="fas fa-dollar-sign"></i><br>
            EUR ${result.market_data.current_price.eur.toFixed(5)} <i class="fas fa-euro-sign"></i><br>
            ILS ${result.market_data.current_price.ils.toFixed(5)} <i class="fas fa-shekel-sign"></i>`;
                        $(`#demo${id}`).html(coinValue).hide().fadeIn(1000);

                        var obj = { time: Date.now(), price: coinValue }
                        localStorage.setItem(result.id, JSON.stringify(obj));

                    },
                    error: function (error) {
                        $(`#demo${id}`).html(`<div class=error><i class="fas fa-exclamation-triangle"></i><p>Failed Loading</p></div>`);
                    }
                });

            }, 1000);
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
                counter--;
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
                        return arrChosen[i] == item.id;
                    });
                    $(".modal-coins").append(`
                        <div class="col col-sm-4">
                            <div class="card">
                                <label class="switch"><input type="checkbox" id='chosen-${arrByID[0].id}' checked>
                                <span class="slider round"></span></label>
                                <h3 class="card-title">${arrByID[0].symbol}</h3>
                                <span>${arrByID[0].id}</span>
                            </div>
                        </div>`);
                }
                $('#exampleModalCenter').modal('show');
                break;
            case false:
                counter--;
                break;
        }
    }
}
