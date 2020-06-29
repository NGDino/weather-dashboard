var currentWeatherEl = document.querySelector("#current-Weather");
var searchHistoryEl = document.querySelector("#search-history");
var fiveDayEl = document.querySelector("#five-day")

var getCurrentWeather = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ffa287a41d8fa9185d665601ec3150eb"
    fetch(apiUrl)
        .then(function(response) {  
      
        if(response.ok){
        response.json().then(function(data){
        //displayRepos(data, city)
     var lat = data.coord.lat;
     var lon= data.coord.lon

     console.log(lat);
     console.log(lon);

     var getAllWeather = function(){
        //console.log("function called")
        var urlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&%20exclude=&appid=ffa287a41d8fa9185d665601ec3150eb"
        fetch(urlTwo).then(function(responseTwo){
        if(responseTwo.ok){
            responseTwo.json().then(function(info){
                console.log(info)
                displayCurrent();
                displayFiveDay();


                var kelvinTemp = info.current.temp;
                let tempInF = (kelvinTemp - 273.15) * (9/5) + 32; 
                let currentTemp = Math.round(tempInF)
                console.log(currentTemp)

                var windSpeed = info.current.windspeed
                console.log(windSpeed)

                var currentHumidity = info.current.humidity;
                console.log(currentHumidity)

                var uvIndex = info.current.uvi
                console.log(uvIndex)

                
                
            })
        }
        })
    }
 
    
     
    getAllWeather();
   });
}else{
    alert("Error: " + response.statusText)
 }
 
  })

}       
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city")

var formSubmitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    

    console.log(city)

    if (city) {
        getCurrentWeather(city);
       // getForecast(city);
        cityInputEl.value = "";
        cityHistory();
      } else {
        alert("Please enter a valid city");
      }
        //console.log(event);
        
}

cityFormEl.addEventListener("submit", formSubmitHandler);


//display current weather
var displayCurrent = function(){
    console.log(currentWeatherEl)

}

//display 5 day
var displayFiveDay = function(daily, searchTerm){
   // console.log(fiveDayEl)
   fiveDayEl.textContent = "";
   fiveSearchTerm = searchTerm;

//    for(var i=1; i < 5; i++){
//     var temperature = daily[i].temp.day;
//     console.log=temperature
//    }
   
}

//display history
var cityHistory = function(){
    console.log(searchHistoryEl)
}