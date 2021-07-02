var formEL = $("form");
var currentWeatherEL = $("#currentWeather");
var forecastWeatherEL = $("#forecastWeather")
var cityNameEL = $("#cityName");
var currentTempEL = $("#currentTemp");
var currentWindEL = $("#currentWind");
var currentHumidityEL = $("#currentHumidity");
var currentUVEL = $("#currentUV");

var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?";

var apiKey = "b0bf97a062cca5b9556fa45886894621";
var urlParameters;

function handleSumit (event) {

    event.preventDefault();

    var cityName = $(event.target).find('input[id="city"]').val();

    urlParameters = cityName + "&appid=" + apiKey + "&units=metric";

    getCurrentWeather(urlParameters);

};


function getCurrentWeather(urlParameters) {
    fetch(currentWeatherURL + urlParameters).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            currentWeatherEL.css("display", "block");
            currentWeatherEL.text("Wooahhh settle down, that city is no good");
            console.log("no good");
        }
    }).then(function (data) {
        addCurrentWeather(data);
    });
};

function addCurrentWeather(data) {

    console.log(data);

    var currentDate = moment();

    currentWeatherEL.css("display", "block");

    cityNameEL.text(data.name + " - " + currentDate.format("DD/MM/YYYY"));
    currentTempEL.text(data.main.temp + '\u2103');
    currentWindEL.text(data.wind.speed + " km/h");
    currentHumidityEL.text(data.main.humidity);

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    urlParameters = "lat="+ lat +"&lon="+ lon +"&appid=" + apiKey + "&units=metric"; 

    getForeCast(urlParameters);

}

function getForeCast(urlParameters) {
    fetch(forecastURL + urlParameters).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            //error handling here
        }
    }).then(function (data) {
        console.log(data);
        addForeCast(data);
    });
};

function addForeCast(data) {

    var dailyData = data.daily;
     
    forecastWeatherEL.append('<div class="row outerCardRow">');

    var outerCardRow = $('.outerCardRow');

    for(i=0; i < 5; i++) {

        outerCardRow.append('<div class="col"><div class="card"><div id='+ i +' class="card-body">');

        var currentCardEL = $('#' + i);

        var currentDate = moment(dailyData[i].dt, 'X');

        var heading = '<h5>' + currentDate.format("DD/MM/YYYY") + '</h5>'
        var temp = '<p>Temp: '+ dailyData[i].temp.day + '\u2103</p>'
        var wind = '<p>Wind: '+ dailyData[i].wind_speed +' km/h</p>'
        var humidity = '<p>Humidity: '+ dailyData[i].humidity +'%</p>'

        currentCardEL.append(heading);
        currentCardEL.append(temp);
        currentCardEL.append(wind);
        currentCardEL.append(humidity);

        dayCount = 0

    };



};

formEL.on("submit", handleSumit);
