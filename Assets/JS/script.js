var formEL = $("form");
var currentWeatherEL = $("#currentWeather");
var cityNameEL = $("#cityName");
var currentTempEL = $("#currentTemp");
var currentWindEL = $("#currentWind");
var currentHumidityEL = $("#currentHumidity");
var currentUVEL = $("#currentUV");

var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="

var apiKey = "b0bf97a062cca5b9556fa45886894621";
var urlParameters;


formEL.on("submit", handleSumit);

function handleSumit (event) {

    event.preventDefault();

    var cityName = $(event.target).find('input[id="city"]').val();

    urlParameters = cityName + "&appid=" + apiKey + "&units=metric";

    getCurrentWeather(urlParameters);
    getForeCast(urlParameters);

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
        console.log(data);
        addCurrentWeather(data);
    });
};

function addCurrentWeather(data) {

    var currentDate = moment();

    currentWeatherEL.css("display", "block");

    cityNameEL.text(data.name + " - " + currentDate.format("dddd, MMMM Do YYYY"));
    currentTempEL.text(data.main.temp);
    currentWindEL.text(data.wind.speed + " km/h");
    currentHumidityEL.text(data.main.humidity);
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
    });
};

