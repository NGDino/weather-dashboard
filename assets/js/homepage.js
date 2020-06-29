var currentWeatherEl = document.querySelector("#current-Weather");
var searchHistoryEl = document.querySelector("#search-history");
var fiveDayEl = document.querySelector("#five-day")

var getCurrentWeather = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ffa287a41d8fa9185d665601ec3150eb"
    fetch(apiUrl)
        .then(function(response) {

            
   let lat = response.coord.lat;
   let lon = response.coord.lon;
   let allWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&%20exclude=&appid=ffa287a41d8fa9185d665601ec3150eb"
   fetch(allWeather)
   .then(function(responsetwo){
      if(responsetwo.ok){
    responsetwo.json().then(function(data){
    //displayRepos(data, city)
     
    
    console.log(data);
   });
}else{
    alert("Error: " + response.statusText)
 }

      //any other display stuff
   })

           

          

    })
}

        
        
    


var getForecast = function(weather){
    


    //  var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&%20exclude=&appid=ffa287a41d8fa9185d665601ec3150eb"
    //  fetch(forecastUrl)
    // .then(function(response){
    //     if(response.ok){
    //         response.json().then(function(data){
    //             console.log(data)
    //         });
    //     }
    // })
}
//getForecast()

//getCurrentWeather()

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
      } else {
        alert("Please enter a valid city");
      }
        //console.log(event);
        
}

cityFormEl.addEventListener("submit", formSubmitHandler);


//display current weather



//display 5 day


//display history
