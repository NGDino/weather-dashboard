var currentWeatherEl = document.querySelector("#current-Weather");
var searchHistoryEl = document.querySelector("#search-history");
var fiveDayEl = document.querySelector("#five-day")

//array to be used in local storage
var prevCities = []
//pulling the array back out from its string form in local storage
var cityHistory = JSON.parse(window.localStorage.getItem('searchedCities'))

//publishes the search history to the page
function displayHistory() {
    //get rid of duplicate searches
    var uniqueCities = [...new Set(cityHistory)]

    var listGroup = document.querySelector("#cityList")

    if (!cityHistory) {
        console.log('local storage empty')
        searchHistoryEl.innerHTML = ""
    } else {
        for (i = 0; i < uniqueCities.length; i++) {
            var searchList = document.createElement('a');
            searchList.href = "#"
            searchList.classList.add('list-group-item', 'list-group-item-action');

            searchList.innerHTML = `
        ${uniqueCities[i]}
        `
            listGroup.appendChild(searchList)
        }
    }
}

//clears history
function clearHistory(){
    console.log('buttonworks')
    searchHistoryEl.innerHTML = ""
    window.localStorage.clear()
}

function searchHistory(city) {

    if (cityHistory) {
        let prevCities = cityHistory
        console.log("search Histroy", city)
        prevCities.push(city)
        console.log("prev cities array", prevCities)
        localStorage.setItem('searchedCities', JSON.stringify(prevCities))
    } else {
        prevCities.push(city)
        console.log("prev cities array", prevCities)
        localStorage.setItem('searchedCities', JSON.stringify(prevCities))
    }
}


function displayCurrentWeather(info, cityName) {
    var temp = info.current.temp;
    //originally calculated temperature Didn't know I could get it in imperial
    // let tempInF = (kelvinTemp - 273.15) * (9 / 5) + 32;
    // let currentTemp = Math.round(tempInF)
    // console.log(temp)

    var windSpeed = info.current.wind_speed
    //originally calculated imperial conversions.  
    // var meterWindSpeed = info.current.wind_speed
    // let windMph = meterWindSpeed * 2.237
    // let windSpeed = Math.round(windMph)
    // console.log(windSpeed)

    var currentHumidity = info.current.humidity;
    // console.log(currentHumidity)

    var uvIndex = info.current.uvi
    // console.log(uvIndex)

    //make the class for the UV Index change color
    var uvClass = ''
    if (uvIndex < 4) {
        uvClass = '"bg-success"'
    } else if (uvIndex > 4 && uvIndex < 8) {
        uvClass = '"bg-warning"'
    } else if (uvIndex > 8) {
        uvClass = '"bg-danger"'
    }

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
    <p class="card-text">UV Index: <span class=${uvClass}>  ${uvIndex}  </span> </p>
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
        let ikon = dailyWeather[0].icon
        var dateUnix = daily[i].dt

        //formula to get date out of unix time
        const timeMillis = dateUnix * 1000;

        const dateObject = new Date(timeMillis)

        const humanDateFormat = dateObject.toLocaleString()

        // console.log(humanDateFormat)

        let splitDate = humanDateFormat.split(',')
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

                    // localStorage.setItem(historyCounter, JSON.stringify(city))
                    // historyCounter++
                    searchHistory(city)

                    var cityName = data.name
                    var lat = data.coord.lat;
                    var lon = data.coord.lon

                    getAllWeather(lat, lon, cityName);
                });
            } else {
                alert("Error: " + response.statusText)
            }

        })

}
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city")
var searchBtn = document.querySelector("#search")
var clearButton = document.querySelector("#clear-button")


// takes in city input 
function formSubmitHandler(event) {
    event.preventDefault();
    const currentContainer = document.querySelector('#current-weather')
    currentContainer.innerHTML = ''

    const forcastContainer = document.querySelector("#forcast-cards")
    forcastContainer.innerHTML = ''

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

displayHistory()



//listen for submit button
cityFormEl.addEventListener("submit", formSubmitHandler);

clearButton.addEventListener("click", clearHistory)