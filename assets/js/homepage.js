var currentWeatherEl = document.querySelector("#current-Weather");
var searchHistoryEl = document.querySelector("#search-history");
var fiveDayEl = document.querySelector("#five-day")
var listGroup = document.querySelector("#cityList")


//array to be used in local storage
var prevCities = []
//pulling the array back out from its string form in local storage
var cityHistory = JSON.parse(window.localStorage.getItem('searchedCities'))

//publishes the search history to the page
function displayHistory() {
    //get rid of duplicate searches
    listGroup.innerHTML =''

    var uniqueCities = [...new Set(JSON.parse(window.localStorage.getItem('searchedCities')))]



    if (!cityHistory) {
        searchHistoryEl.innerHTML = ""
    } else {
        for (i = 0; i < uniqueCities.length; i++) {
            var searchList = document.createElement('a');
            searchList.href = "#"
            searchList.setAttribute("onclick", "searchAgain(event)");
            searchList.classList.add('list-group-item', 'list-group-item-action');

            searchList.innerHTML = `
        ${uniqueCities[i]}
        `
            listGroup.appendChild(searchList)
        }
    }
}

function searchAgain(event){
    var listItem = event.target.innerText

    city = listItem

    getCurrentWeather(city)
    
}

//clears history
function clearHistory(){
    window.localStorage.clear()
}

function searchHistory(city) {
    const words = city.split(" ")
        for(i=0; i < words.length; i++){
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        const capCity= words.join(' ')

    if (cityHistory) {
        let prevCities = cityHistory

        prevCities.push(capCity)
        localStorage.setItem('searchedCities', JSON.stringify(prevCities))
        displayHistory()


    } else {
        prevCities.push(capCity)
        localStorage.setItem('searchedCities', JSON.stringify(prevCities))
        displayHistory()

    }
}


function displayCurrentWeather(info, cityName) {

    var temp = info.current.temp;
    
    var windSpeed = info.current.wind_speed
    

    var currentHumidity = info.current.humidity;

    var uvIndex = info.current.uvi

    //make the class for the UV Index change color
    var uvClass = ''
    if (uvIndex < 4) {
        uvClass = '"bg-success"'
    } else if (uvIndex > 4 && uvIndex < 8) {
        uvClass = '"bg-warning"'
    } else if (uvIndex > 8) {
        uvClass = '"bg-danger"'
    }


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


    for (i = 1; i < 6; i++) {
        var humidity = daily[i].humidity;

        var temp = daily[i].temp.day
        var dailyWeather = daily[i].weather
        let ikon = dailyWeather[0].icon
        var dateUnix = daily[i].dt

        //formula to get date out of unix time
        const timeMillis = dateUnix * 1000;

        const dateObject = new Date(timeMillis)

        const humanDateFormat = dateObject.toLocaleString()


        let splitDate = humanDateFormat.split(',')
        let finalDate = splitDate[0]


        var forcastDiv = document.createElement('div');
        forcastDiv.classList.add('col-sm', 'card', 'bg-light');

        // add the inner html
        forcastDiv.innerHTML = `
            <div class="card-body  text-center">
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
    var urlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&%20exclude=&appid=ffa287a41d8fa9185d665601ec3150eb"
    fetch(urlTwo).then(function (responseTwo) {
        if (responseTwo.ok) {
            responseTwo.json().then(function (info) {

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