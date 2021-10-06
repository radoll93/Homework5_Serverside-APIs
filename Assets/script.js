//input city -> submit, api

var searchbtn = $('.btn');
var formEl = $('.form-control');
var searchlist = $('.search-list')
var todaydiv = $('.today-weather');
var searchcontainer = document.querySelector('.search-container');
var forecastdiv = document.querySelector('.forecast-weather');
var apikey = "39aadcf6aa3fa19cfd9358b380b3f26c";
var cities = [];



searchbtn.on("click", function citySubmit (event) {
    event.preventDefault();  

    var city = formEl.val();

    if(city) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));

        weather(city);
        formEl.val('');
    }

})


//search to local & make list

function makelist () {
    var ulEl = document.createElement('ul');
    var searchlist = document.createElement('li');

    searchlist.innerHTML = JSON.parse(localStorage.getItem("cities"));

    searchcontainer.append(ulEl);
    ulEl.append(searchlist);
    console.log(searchlist);

}

makelist();

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

            console.log(data);
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


    todaydiv.addClass('border border-dark p-1');
    todaydiv.append(displayCity).append(displayOverall).append(displayTemp).append(displayHumidity).append(displayWind);

}



//weather forecast API & display

var title = $('.title');


function displayforecast (data) {

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat+ "&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid=" +apikey;

    fetch(forecastURL)
    .then(function (response) {
        response.json().then(function (data) {
            for(var i=1; i<= 5; i++){
                
                var datediv = document.createElement('div');
                datediv.classList = 'col-2 bg-dark m-2 text-light';
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


    var forecasttitle = document.createElement('h3');
    forecasttitle.textContent = "5-Day Forecast:"

    title.append(forecasttitle);

  }

   

 
     




