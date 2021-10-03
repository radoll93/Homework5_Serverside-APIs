//input city -> submit, api

var searchbtn = $('.btn');
var formEl = $('.form-control')
var bodycontainerEl = $('.body-container')


searchbtn.on("click", function citySubmit (event) {
    event.preventDefault();  

    var city = formEl.val();

    if(city) {
        weather(city);
        formEl.text = "";
    }

    console.log(city);
})

function weather(city) {

    var apikey = "39aadcf6aa3fa19cfd9358b380b3f26c";
    var URL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apikey;


    fetch(URL)
    .then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            displayWeather(data)
        });

    });
}

function displayWeather(data) {
    console.log(data.clouds);
    console.log(data.main);
    console.log(data.name);
    console.log(data.main[1]);
    console.log(data.wind);



    var today = moment().format("MM/DD/YYYY");
    var displayCity = document.createElement('h2');
    displayCity.textContent = data.name + " (" + today+ ")";

    var displayTemp = document.createElement('p');
    displayTemp.textContent = "Temp: " + data.main.temp ;

    var displayHumidity = document.createElement('p');
    displayHumidity.textContent = "Humidity: " +data.main.humidity +"%";


    bodycontainerEl.append(displayCity);
    bodycontainerEl.append(displayTemp);
    bodycontainerEl.append(displayHumidity);

}
