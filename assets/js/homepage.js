var currentWeatherEl = document.querySelector("#current-Weather");
var searchHistoryEl = document.querySelector("#search-history");
var fiveDayEl = document.querySelector("#five-day")
var historyCounter = localStorage.length

function displayCurrentWeather(info, cityName) {
    console.log('func disp weather called')

    var temp = info.current.temp;
    //originally calculated temperature Didn't know I could get it in imperial
    // let tempInF = (kelvinTemp - 273.15) * (9 / 5) + 32;
    // let currentTemp = Math.round(tempInF)
    // console.log(temp)

    var windSpeed =info.current.wind_speed
    //originally calculated imperial conversions.  
    // var meterWindSpeed = info.current.wind_speed
    // let windMph = meterWindSpeed * 2.237
    // let windSpeed = Math.round(windMph)
    // console.log(windSpeed)

    var currentHumidity = info.current.humidity;
    // console.log(currentHumidity)

    var uvIndex = info.current.uvi
    // console.log(uvIndex)

    // console.log('from display func', cityName)

    //create the div to be appended
    var currentWeatherDiv = document.createElement('div');
    currentWeatherDiv.classList.add('text-container');

    // add the inner html
    currentWeatherDiv.innerHTML = `
    <h3 class="card-title">${cityName}</h3>
    <p class="card-text">Temperature: ${temp}</p>
    <p class="card-text">Humidity: ${currentHumidity}% </p>
    <p class="card-text">Wind Speed: ${windSpeed} MPH </p>
    <p class="card-text">UV Index: ${uvIndex} </p>
    `
    var currentContainer = document.querySelector("#current-weather")

    currentContainer.appendChild(currentWeatherDiv)
}

function displayForecast(info) {
    var daily = info.daily

    // var firstHumidity = daily[0].humidity
    // console.log(firstHumidity)
   

    for (i = 1; i < 6; i++) {
        var humidity = daily[i].humidity;

        var temp = daily[i].temp.day
        var dailyWeather = daily[i].weather
        // console.log(dailyWeather)
        let ikon= dailyWeather[0].icon
        var dateUnix= daily[i].dt

        //formula to get date out of unix time
        

        const timeMillis = dateUnix * 1000;

        const dateObject = new Date(timeMillis)

        const humanDateFormat = dateObject.toLocaleString() 

        // console.log(humanDateFormat)

        let splitDate= humanDateFormat.split(',')
        // console.log(splitDate)
        let finalDate = splitDate[0]
        // console.log(finalDate)

        console.log('humidity=', humidity, 'temp =', temp, 'icon', ikon, 'date', finalDate)

            var forcastDiv = document.createElement('div');
            forcastDiv.classList.add('col', 'card', 'bg-light');

            // add the inner html
            forcastDiv.innerHTML = `
            <div class="card-body text-center">
                            <p class="card-text font-weight-bold">${finalDate} </p>
                            <img src="http://openweathermap.org/img/wn/${ikon}@2x.png" alt="alternatetext">
                            <p class="card-text ">Temp: ${temp} F </p>
                            <p class="card-text ">Humidity: ${humidity}% </p>
                        </div>
            `
            var forcastContainer = document.querySelector("#forcast-cards")

            forcastContainer.appendChild(forcastDiv)



    }
}

//api call to get all info using lat and lon
function getAllWeather(lat, lon, cityName) {
    //console.log("function called")
    var urlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&%20exclude=&appid=ffa287a41d8fa9185d665601ec3150eb"
    fetch(urlTwo).then(function (responseTwo) {
        if (responseTwo.ok) {
            responseTwo.json().then(function (info) {
                console.log(info)

                // var daily = info.daily


                displayCurrentWeather(info, cityName)
                displayForecast(info)
            })
        }
    })
}
//api call for current weather
function getCurrentWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ffa287a41d8fa9185d665601ec3150eb"
    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data)
                    //displayRepos(data, city)

                    localStorage.setItem(historyCounter, city)
                    historyCounter++


                    var cityName = data.name
                    var lat = data.coord.lat;
                    var lon = data.coord.lon

                    // console.log('cityName', cityName)

                    // console.log(lat);
                    // console.log(lon);





                    getAllWeather(lat, lon, cityName);
                });
            } else {
                alert("Error: " + response.statusText)
            }

        })

}
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city")


// takes in city input 
function formSubmitHandler(event) {
    event.preventDefault();

    //gets rid of spaces
    var city = cityInputEl.value.trim();


    // console.log(city)
    // if city gets a result then 
    if (city) {
        getCurrentWeather(city);

        cityInputEl.value = "";
        // if no city returned get an error message
    } else {
        alert("Please enter a valid city");
    }


}
//listen for submit button
cityFormEl.addEventListener("submit", formSubmitHandler);