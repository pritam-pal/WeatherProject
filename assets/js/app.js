const searchButton = document.querySelector('.search-icon');
const locketButton = document.querySelector('.locate-icon');
var ctx = document.getElementById('myChart').getContext('2d');

// Adding chart of 7 Days

function charts (ctx, daysTemps, days) {
    Chart.defaults.global.defaultFontColor = '#fff';
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: days,
            datasets: [{
                label: '7 Days Temperature',

                backgroundColor: 'rgb(3, 211, 252)',
                borderColor: 'rgb(3, 211, 252)',
                data: daysTemps
            }]
        },
    
        // Configuration options go here
        options: {}
    });
}


let long;
let lat;
let icon;
const sectionWeatherOverview = document.querySelector('.section-weatherOverview');
const timezoneLocation = document.querySelector('.timezone');
const currentDate = document.querySelector('.current-date');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');
const feelLike = document.querySelector('.feel-like');
const temperatureDegree = document.querySelector('.temperature--degree');
const temperatureIcon = document.querySelector('.icon');
const temperatureSummery = document.querySelector('.summery');

// selecting section weather details

const humiditySpan = document.querySelector('.humidity-span');
const dewpointSpan = document.querySelector('.dewpoint-span');
const pressureSpan = document.querySelector('.pressure-span');
const UVSpan = document.querySelector('.UV-span');
const visibilitySpan = document.querySelector('.visibility-span');


// Auto update feature

// window.addEventListener('load', () => {
//     // calling navigetion function
//     navigationLocation();
// })

function callAPI(lat, long) {
    const apiAuto = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=5d37623a89351f827b03cc030bf40e80`;
    getData(apiAuto);
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// Implementing Search feature

function getLocation(){
    const cityName = document.querySelector('.input-location').value;
    const apiMan = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=5d37623a89351f827b03cc030bf40e80`;
    return fetch(apiMan)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let lon = data.coord.lon;
                let lat = data.coord.lat;
                const location = [lat, lon];
                return location;
            })
}

// adding listeners
document.addEventListener('keypress', e => {
    if(e.key==='Enter') {
        getLocation().then(response => {
            setTimeout(() => {
                callAPI(response[0], response[1]);
            }, 800);

        })
    }
})
searchButton.addEventListener('click', ()=> {
    getLocation().then(response => {
        setTimeout(() => {
            callAPI(response[0], response[1]);
        }, 2000);

    })
})
// implemonting locate button
locketButton.addEventListener('click', () => {
    setTimeout(() => {
        navigationLocation ();
    }, 2500);

})

// Getting current date and time

function getCurrentDate() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    switch(month) {
        case 1: {
            return `${'January'} ${day},`;
        }
        case 2: {
            return `${'February'} ${day},`;
        }
        case 3: {
            return `${'March'} ${day},`;
        }
        case 4: {
            return `${'April'} ${day},`;
        }
        case 5: {
            return `${'May'} ${day},`;
        }
        case 6: {
            return `${'June'} ${day},`;
        }
        case 7: {
            return `${'July'} ${day},`;
        }
        case 8: {
            return `${'August'} ${day},`;
        }
        case 9: {
            return `${'September'} ${day},`;
        }
        case 10: {
            return `${'October'} ${day},`;
        }
        case 11: {
            return `${'November'} ${day},`;
        }
        case 12: {
            return `${'December'} ${day},`;
        }
    }
}
// Getting current time from device
function getCurrentTime() {
    const currentTime = new Date();
    let hour = Number(currentTime.getHours());
    let minutes = Number(currentTime.getMinutes());

    if(hour < 10) { hour = `0${hour}`; }
    if (minutes < 10) { minutes = `0${minutes}`; }

    if(hour == 0) {
        return `12:${minutes} AM`;
    } else if(hour < 12) {
        return `${hour}:${minutes} AM`;
    } else {
        return `${Math.floor(hour-12)}:${minutes} PM`;
    }
}


// ////////////////////////////////////////////////////////////////////////////////////////////////
// Getting data from API


function getData(apiAuto ) {
    fetch(apiAuto)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let daystemp = [];
            let days = [];
            // Getting data from API
            const {timezone} = data;

            const {temp, feels_like, dew_point, clouds, humidity, pressure, uvi, sunrise, sunset, visibility} = data.current;
            const { wind_speed} = data.current.weather;
            const {min, max} = data.daily[0].temp;
            
            for (let i =0; i < data.daily.length; i++) {
                daystemp.push(Math.round((data.daily[i].temp.day)-273.15));
                let dayObj = new Date(data.daily[i].dt*1000);
                let month = dayObj.getMonth() + 1;
                let year = dayObj.getFullYear();
                let date = dayObj.getDate();
                days.push(`${date}/${month}/${year}`);
            }
            // calling charts js
            charts(ctx, daystemp, days)
            console.log(data);
            console.log(daystemp, days);
            // if(data.temp == undefined) alert('Error! 429 😣\nToo many request to the server 😥\nPlease try after 3600s later. 😄');

            // Adding text content to the DOM
            document.querySelector('.max-deg').innerHTML = '&deg;';
            document.querySelector('.max-short').textContent = 'C';
            document.querySelector('.min-deg').innerHTML = '&deg;';
            document.querySelector('.min-short').textContent = 'C';
            document.querySelector('.temperature-deg').innerHTML = '&deg;';
            document.querySelector('.temperature--short').textContent = 'C';
            document.querySelector('.feel-deg').innerHTML = '&deg;';
            document.querySelector('.feel-like-short').textContent = 'C';
            document.querySelector('.dew-short').textContent = 'C';
            document.querySelector('.dew--deg').innerHTML = '&deg;';

            // Assign data to DOM
            timezoneLocation.textContent = timezone;
            temperatureDegree.textContent = Math.round(temp-273.15);
            feelLike.textContent = `Feels Like: ${Math.round(feels_like-273.15)}`;
            minTemp.textContent = `Night ${Math.round(min - 273.15)}`;
            maxTemp.textContent = `Day ${Math.round(max - 273.15)}`;
            humiditySpan.textContent = `${humidity}%`;
            dewpointSpan.textContent = Math.round(dew_point-273.15);
            pressureSpan.textContent = `${pressure} mBar`;
            UVSpan.textContent = uvi;
            visibilitySpan.textContent = `${visibility/1000} KM`;

            // Directly assign data to DOM or Variable 
            temperatureSummery.textContent = data.current.weather[0].description;
            icon = data.current.weather[0].icon;
            temperatureIcon.src = `../assets/css/icons/${icon}.png`;

            // switching icon and background according to the weather;
            function backgroundSwitcher(icon) {
                if(window.outerWidth > 430){
                    sectionWeatherOverview.style.backgroundImage = `linear-gradient( rgba(0,0,0,.3), rgba(0,0,0,.3)), url(/assets/css/img/${icon}.jpg)`;
                    sectionWeatherOverview.style.color = '#eee';
                    console.log(window.outerWidth)
                    console.log(icon)
                } else {
                    sectionWeatherOverview.style.backgroundImage = `url(/assets/css/svg/${icon}.svg)`;
                    sectionWeatherOverview.style.color = '#eee';
                }
            }
            switch (icon) {

                case '01d': {
                    backgroundSwitcher(icon);
                }
                case '01n': {
                    backgroundSwitcher(icon);
                }
                case '02d': {
                    backgroundSwitcher(icon);
                }
                case '02n': {
                    backgroundSwitcher(icon);
                }
                case '03d': {
                    backgroundSwitcher(icon);
                }
                case '03n': {
                    backgroundSwitcher(icon);
                }
                case '04d': {
                    backgroundSwitcher(icon);
                }
                case '04n': {
                    backgroundSwitcher(icon);
                }
                case '09d': {
                    backgroundSwitcher(icon);
                }
                case '09n': {
                    backgroundSwitcher(icon);
                }
                case '10d': {
                    backgroundSwitcher(icon);
                }
                case '10n': {
                    backgroundSwitcher(icon);
                }
                case '11d': {
                    backgroundSwitcher(icon);
                }
                case '11n': {
                    backgroundSwitcher(icon);
                }
                case '13d': {
                    backgroundSwitcher(icon);
                }
                case '13n': {
                    backgroundSwitcher(icon);
                }
                case '50d': {
                    backgroundSwitcher(icon);
                }
                case '50n': {
                    backgroundSwitcher(icon);
                }
            }
        });

     // Placing current date and time
    currentDate.textContent = `${getCurrentDate()} ${getCurrentTime()}`;
}

function navigationLocation () {
    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            callAPI(lat, long);
            const proxy = 'https://cors-anywhere.herokuapp.com/';
        })
    }
}

