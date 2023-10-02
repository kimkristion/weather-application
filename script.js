
const APIKey = "278f3553f0664bd192230bfbcfafa765";
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');

function fetchWeatherData(city) {
    const baseURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

    return fetch(baseURL)
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching weather data', error)
        throw error;
    });
}



function displayWeatherData(weatherdata) {
    const displayCityName = document.getElementById('cityName');
    const displayWeatherIcon = document.getElementById('weatherIcon');
    const displayTemp = document.getElementById('temp');
    const displayWind = document.getElementById('wind');
    const displayHumidity = document.getElementById('humidity');

    var weatherIconCode = weatherdata.weather[0].icon;
    var fetchWeatherIcon = `http://openweathermap.org/img/w/${weatherIconCode}.png`;



    displayCityName.textContent = weatherdata.name;
    displayWeatherIcon.src = fetchWeatherIcon
    displayTemp.textContent = weatherdata.main.temp + '°F';
    displayWind.textContent = weatherdata.wind.speed + ' MPH';
    displayHumidity.textContent = weatherdata.main.humidity + "%";
    
    // 5-Day Forecast
    const lat = weatherdata.coord.lat;
    const lon = weatherdata.coord.lon;

    const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
    fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
        const dailyForecasts3HourInterval = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));

        dailyForecasts3HourInterval.slice(0, 5).forEach((forecast, index) => {
            const temp = forecast.main.temp;
            const wind = forecast.wind.speed;
            const humidity = forecast.main.humidity;
            var weatherIconCode = forecast.weather[0].icon;
            var fetchWeatherIcon = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

        
            const grabTempId = `temp${index + 1}`;
            const grabWindId = `wind${index + 1}`;
            const grabHumidityId = `humidity${index + 1}`;
            const grabWeatherIconId = `weatherIcon${index + 1}`;

            const grabTemp = document.getElementById(grabTempId);
            const grabWind = document.getElementById(grabWindId);
            const grabHumidity = document.getElementById(grabHumidityId);
            const grabWeatherIcon = document.getElementById(grabWeatherIconId);
           
            if (grabTemp && grabWind && grabHumidity && grabWeatherIcon) {
                grabTemp.innerHTML = `Temp: ${temp}°F`
                grabWind.innerHTML = `Wind: ${wind} MPH`
                grabHumidity.innerHTML = `Humidity: ${humidity}%`
                grabWeatherIcon.src = fetchWeatherIcon
               
            }
        });
           
    });
}

//function deleteCity(buttonElement) {
 // var listItem = buttonElement.parentElement;
  //var list = listItem.parentElement;

 // list.removeChild(listItem);

//}

// Generates default weather for Portland, OR
const city = 'Portland';

fetchWeatherData(city)
.then(data => {
    displayWeatherData(data)
})

const citiesList = document.getElementById('cities');
const addedCities = JSON.parse(localStorage.getItem('addedCities')) || [];

function updatedAddedCities(city) {
    addedCities.push(city);
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
}

function displayAddedCities() {
    citiesList.innerHTML = '';

    addedCities.forEach(city => {
        const newCity = document.createElement('li');
        newCity.innerHTML = city;
        citiesList.appendChild(newCity);
    });
}

displayAddedCities();

searchBtn.addEventListener('click', () => {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city === '') {
        cityInput.placeholder = 'Invalid Search';
    } else if (addedCities.includes(city)) {
        cityInput.value = '';
        cityInput.placeholder = 'City already in list';
    } else {
        fetchWeatherData(city)
        .then(data => {
            displayWeatherData(data);
            updatedAddedCities(city);
            displayAddedCities();
        })
        .catch(error => {
            console.error('Error loading weather data', error);
            cityInput.placeholder = 'City not found';
        })
        cityInput.value = '';
        cityInput.placeholder = '';
    }
});

citiesList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const searchedCity = event.target.textContent;
        fetchWeatherData(searchedCity)
        .then(data => {
            displayWeatherData(data);
        })
    }
});


clearSearchBtn.addEventListener('click', () => {
    addedCities.length = 0;
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
    displayAddedCities();
});

// current day
const jsday = dayjs();
const date = dayjs(jsday).format('MM/DD/YYYY');
const datedisplay = document.getElementById('date');
datedisplay.innerHTML = " (" + date + ")"; 

// 5-Day Forecast dates
for (let i = 1; i < 6; i++) {
    const datePlusOne = jsday.add(i, 'day');
    const formatDate = datePlusOne.format('MM/DD/YYYY');

    const dateElementId = `date${i}`;
    const grabDateElement = document.getElementById(dateElementId);

    grabDateElement.innerHTML = formatDate;
}




