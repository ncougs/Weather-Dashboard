var formEL = $("form");
var searchBlockEL = $("#searchBlock")
var previousSearchesEl = $("#previousSearches")
var displayWeather = $('#displayWeather')
var currentWeatherEL = $("#currentWeather");
var forecastWeatherEL = $("#forecastWeather")

var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?";

var apiKey = "b0bf97a062cca5b9556fa45886894621";
var urlParameters;

function handleSumit (event) {

    event.preventDefault();

    displayWeather.removeClass("removeBlock");
    displayWeather.addClass("displayBlock");
    previousSearchesEl.removeClass("removeBlock");
    previousSearchesEl.addClass("displayBlock");
    searchBlockEL.addClass("col-lg-3");
    searchBlockEL.removeClass("d-flex flex-column");
    $('#city').css("width", "100%");

    var cityName;

    if (String(event.target).includes('Form')) {
        cityName = $(event.target).find('input[id="city"]').val();

        $('#city').val("");
    }
    else if (String(event.target).includes('Button')) {
        cityName = $(event.target).html();
    };

    urlParameters = cityName + "&appid=" + apiKey + "&units=metric";

    removeContents();

    getCurrentWeather(urlParameters);

};

function getCurrentWeather(urlParameters) {
    fetch(currentWeatherURL + urlParameters).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            handleError();
        }
    }).then(function (data) {
        addCurrentWeather(data);
    });

};

function addCurrentWeather(data) {

    var currentDate = moment();

    var heading = '<h5>' + data.name + " - " + currentDate.format("DD/MM/YYYY") + '</h5>'
    var temp = '<p>Temp: '+ data.main.temp + '\u2103</p>'
    var wind = '<p>Wind: '+ data.wind.speed +' km/h</p>'
    var humidity = '<p>Humidity: '+ data.main.humidity +'%</p>'
    var image = '<img alt="Weather icon" class="img-fluid" src="https://openweathermap.org/img/wn/'+ data.weather[0].icon +'.png"></img>'


    currentWeatherEL.append('<h3 class="fw-bold">Current Weather:</h3>');
    currentWeatherEL.append(heading);
    currentWeatherEL.append(image);
    currentWeatherEL.append(temp);
    currentWeatherEL.append(wind);
    currentWeatherEL.append(humidity);

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    urlParameters = "lat="+ lat +"&lon="+ lon +"&appid=" + apiKey + "&units=metric"; 

    getForeCast(urlParameters);

    addPreviousSearchButton(data.name);

}

function getForeCast(urlParameters) {
    fetch(forecastURL + urlParameters).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            handleError();
        }
    }).then(function (data) {
        addForeCast(data);
    });
};

function addForeCast(data) {

    var dailyData = data.daily;

    forecastWeatherEL.append('<h3 class="fw-bold">5 Day Forecast:</h3>');
     
    forecastWeatherEL.append('<div class="row outerCardRow">');

    var outerCardRow = $('.outerCardRow');

    for(i=0; i < 6; i++) {

        if(i != 0) {
            outerCardRow.append('<div class="col"><div class="card"><div id='+ i +' class="card-body">');

            var currentCardEL = $('#' + i);
    
            var currentDate = moment(dailyData[i].dt, 'X');
    
            var heading = '<h5>' + currentDate.format("DD/MM/YYYY") + '</h5>'
            var image = '<img alt="Weather icon" class="img-fluid" src="https://openweathermap.org/img/wn/'+ dailyData[i].weather[0].icon +'.png"></img>'
            var temp = '<p>Temp: '+ dailyData[i].temp.day + '\u2103</p>'
            var wind = '<p>Wind: '+ dailyData[i].wind_speed +' km/h</p>'
            var humidity = '<p>Humidity: '+ dailyData[i].humidity +'%</p>'
    
            currentCardEL.append(heading);
            currentCardEL.append(image);
            currentCardEL.append(temp);
            currentCardEL.append(wind);
            currentCardEL.append(humidity);   
        }

       
        if (i==0) {

            var uvi = dailyData[i].uvi

            var uvEL = document.createElement("p");
            uvEL = $(uvEL);

            if (Number(uvi) <= 2) {
                uvEL.css("background", "green");
            }
            else if (Number(uvi) > 2 && Number(uvi) <= 5) {
                uvEL.css("background", "yellow");
            }
            else if (Number(uvi) > 5 && Number(uvi) <= 7) {
                uvEL.css("background", "orange");
            }
            else if (Number(uvi) > 7 && Number(uvi) <= 10) {
                uvEL.css("background", "red");
            }
            else if (Number(uvi) > 10) {
                uvEL.css("background", "purple");
            }; 

            uvEL.text("UV Index: "+ uvi);
            uvEL.addClass("uvi");
            
            currentWeatherEL.append(uvEL);

            
        };
 
    };



};

function removeContents() {

    if (currentWeatherEL.children().length > 0) {
        currentWeatherEL.children().remove();
    };

    if (forecastWeatherEL.children().length > 0) {
        forecastWeatherEL.children().remove();
    };

};

function addPreviousSearchButton(searchName) {

    var resultsArray = [];

    prevousResultsOut = localStorage.getItem("previousResults");

    if (prevousResultsOut == null) {
        resultsArray.push(searchName);
        localStorage.setItem("previousResults", JSON.stringify(resultsArray));
    }
    else {
        resultsArray = JSON.parse(prevousResultsOut);
        resultsArray.push(searchName);
        localStorage.setItem("previousResults", JSON.stringify(resultsArray));
    };

    var previousMatch = false

    var previousResults = previousSearchesEl.children();

     for (i=0; i < previousResults.length; i++ ) {

        if(searchName == $(previousResults[i]).html()){

            previousMatch = true;

            break;

        };
    }; 

    if (previousMatch) {
        return;
    }
    else {
        var newButtonEL = document.createElement("button");

        newButtonEL = $(newButtonEL);
        newButtonEL.attr("type", "button");
        newButtonEL.addClass("btn btn-secondary w-100 my-1");
        newButtonEL.text(searchName);

        previousSearchesEl.append(newButtonEL);




        urlParameters = searchName + "&appid=" + apiKey + "&units=metric";

        newButtonEL.on("click", handleSumit);
    };

};

function handleError () {
    alert("Woops, Something went wrong with the search! Try again.. (check city name)")
};

function loadPreviousSearches () {

    var resultsArray = [];

    var prevousResultsOut = localStorage.getItem("previousResults");

    if (prevousResultsOut == null) {
        return;
    }
    else {
        resultsArray = JSON.parse(prevousResultsOut);
    };

    if (resultsArray.length > 0) {

        var uniqueResults = [];
        $.each(resultsArray, function(i, el){
            if($.inArray(el, uniqueResults) === -1) uniqueResults.push(el);
        });

        uniqueResults.forEach(result => {

            var newButtonEL = document.createElement("button");

            newButtonEL = $(newButtonEL);
            newButtonEL.attr("type", "button");
            newButtonEL.addClass("btn btn-secondary w-100 my-1");
            newButtonEL.text(result);
    
            previousSearchesEl.append(newButtonEL);
              
            newButtonEL.on("click", handleSumit);
            
        });
    };

}


formEL.on("submit", handleSumit);
loadPreviousSearches();