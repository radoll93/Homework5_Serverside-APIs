//inpu city -> submit, api

var searchbtn = $('.btn');
var formEl = $('.form-control');
var bodycontainer = $('.body-container')
var searchlist = $('.search-list')

var searchcontainer = document.querySelector('.search-container');

var apikey = "39aadcf6aa3fa19cfd9358b380b3f26c";
var cities = [];





searchbtn.on("click", function citySubmit (event) {
    event.preventDefault();  

    var city = formEl.val();

    if(bodycontainer[0].children.length > 0) {

        $('.today-weather').remove();
        $('.forecast-weather').remove();
        $(".forecast_title").remove()

        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
 
        weather(city);
        formEl.val('');

    } else{


        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));

        weather(city);
        formEl.val('');

     }


})


//search to local & make btn

function makelist () {
    var ulEl = document.createElement('ul');

    var savecities = JSON.parse(localStorage.getItem("cities")); 
    if(savecities !== null) {
        cities = savecities;
    }


    searchcontainer.append(ulEl);


    for (var i=0; i<cities.length; i++){

        var citieslist = savecities[i];
        var citieslistBtn = document.createElement('button');
        citieslistBtn.classList = 'city-btn btn btn-outline-secondary col my-1 bg-dark text-white';
        citieslistBtn.innerText = citieslist;

        ulEl.append(citieslistBtn);
        
    }

}

makelist();



var citybtn = $('.city-btn');

citybtn.on("click", function cityClick (event) {
    event.preventDefault();  

    var city = $(this)[0].innerText;

    if(bodycontainer[0].children.length > 0) {
        $('.today-weather').remove();
        $('.forecast-weather').remove();
        $(".forecast_title").remove()


        weather(city);
        formEl.val('');

    } else {
        weather(city);
        formEl.val('');

    }



})


//today's weather API & display 

function weather(city) {

    var URL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apikey;


    fetch(URL)
    .then(function (response) {
        response.json().then(function (data) {

            displayWeather(data);
            displayforecast(data);
        });

    });
}

function displayWeather(data) {

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    var UVURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat+ "&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid=" +apikey;

    var todaydiv = document.createElement('div');
    todaydiv.classList = 'today-weather border border-dark p-1';

    bodycontainer.append(todaydiv);

    fetch(UVURL)
    .then(function (response) {
        response.json().then(function (data) {
            var todayUV = document.createElement('p');
            var uvindex = document.createElement('span');
            todayUV.innerHTML = "UV Index: ";
            uvindex.innerHTML = data.current.uvi;
            todaydiv.append(todayUV);
            todayUV.append(uvindex);

            if(data.current.uvi <= 2) {
                uvindex.setAttribute('style', 'background-color:green')
            } else if ((data.current.uvi>2)&&(data.current.uvi<=5)) {
                uvindex.setAttribute('style', 'background-color:yellow')
            } else if ((data.current.uvi>5)&&(data.current.uvi<=7)) {
                uvindex.setAttribute('style', 'background-color:orange')
            } else if ((data.current.uvi>7)&&(data.current.uvi<=10)) {
                uvindex.setAttribute('style', 'background-color:red')
            }

        })
    })



    
    var today = moment().format("MM/DD/YYYY");
    var displayCity = document.createElement('h2');
    displayCity.textContent = data.name + " (" + today+ ")";

    var displayOverall = document.createElement('p');
    displayOverall.textContent = "Overall: " + data.weather[0].main;

    var displayTemp = document.createElement('p');
    displayTemp.textContent = "Temp: " + data.main.temp +"ºF";

    var displayHumidity = document.createElement('p');
    displayHumidity.textContent = "Humidity: " +data.main.humidity +"%";

    var displayWind = document.createElement('p');
    displayWind.textContent = "Wind: " + data.wind.speed +" MPH";



    todaydiv.append(displayCity);
    todaydiv.append(displayOverall)
    todaydiv.append(displayTemp)
    todaydiv.append(displayHumidity)
    todaydiv.append(displayWind);

}



//weather forecast API & display



function displayforecast (data) {

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat+ "&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid=" +apikey;


    var forecasttitle = document.createElement('h3');
    forecasttitle.classList = "forecast_title"
    forecasttitle.innerText = "5-Day Forecast:"
    bodycontainer.append(forecasttitle);


    var forecastdiv = document.createElement('div');
    forecastdiv.classList = "forecast-weather";
    bodycontainer.append(forecastdiv);

    fetch(forecastURL)
    .then(function (response) {
        response.json().then(function (data) {
            for(var i=1; i<= 5; i++){
                
                var datediv = document.createElement('div');
                datediv.classList = 'bg-dark m-2 text-light w-25';
                forecastdiv.appendChild(datediv);


                var arraydate = data.daily[i].dt;
                var forecastdate = moment(arraydate, 'X');
            
                var datedisplay = document.createElement('h4');
                datedisplay.textContent = forecastdate.format('MM/DD/YYYY');

                var displayIcon = document.createElement('img');
                displayIcon.src = ("http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+".png");

                var forecastTemp = document.createElement('p');
                forecastTemp.textContent = 'Temp: ' + data.daily[i].temp.day + 'ºF' 
                
                var forecastWind = document.createElement('p');
                forecastWind.textContent = 'Wind: ' + data.daily[i].wind_speed + ' MPH' 
                
                var forecastHum = document.createElement('p');
                forecastHum.textContent = 'Humidity: ' + data.daily[i].humidity + '%';
                
                datediv.append(datedisplay);
                datediv.append(displayIcon);
                datediv.append(forecastTemp);
                datediv.append(forecastWind);
                datediv.append(forecastHum);
            
            }
        
        })
    })





  }

   



