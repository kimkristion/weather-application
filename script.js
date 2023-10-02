// API Key for OpenWeatherMap
const APIKey = "278f3553f0664bd192230bfbcfafa765";

// Grabs search and clear button elements
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');

// Function to fetch weather data with the paramater of city
function fetchWeatherData(city) {
    // Contructs the specific URL for the fetch which includes the city referenced
    const baseURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

    // Returns the data parsed as JSON
    return fetch(baseURL)
    .then(response => response.json())
    .catch(error => {
        // Catches an error if error occurs
        console.error('Error fetching weather data', error)
        throw error;
    });
}


// Function to display weather data on the web page
function displayWeatherData(weatherdata) {
    // Toggles the HTML elements for displaying weather information
    const displayCityName = document.getElementById('cityName');
    const displayWeatherIcon = document.getElementById('weatherIcon');
    const displayTemp = document.getElementById('temp');
    const displayWind = document.getElementById('wind');
    const displayHumidity = document.getElementById('humidity');

    // Grabs the relevant weather icon
    var weatherIconCode = weatherdata.weather[0].icon;
    var fetchWeatherIcon = `https://openweathermap.org/img/w/${weatherIconCode}.png`;

    // Updates the displayed weather information 
    displayCityName.textContent = weatherdata.name;
    displayWeatherIcon.src = fetchWeatherIcon
    displayTemp.textContent = weatherdata.main.temp + '°F';
    displayWind.textContent = weatherdata.wind.speed + ' MPH';
    displayHumidity.textContent = weatherdata.main.humidity + "%";
    
    // 5-Day Forecast
    const lat = weatherdata.coord.lat;
    const lon = weatherdata.coord.lon;

    // Contructs API endpoint ULR for the 5-Day Forecast
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
    fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
        // Filter and displays daily forecast with a timestap of 12:00:00
        const dailyForecasts3HourInterval = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));

        dailyForecasts3HourInterval.slice(0, 5).forEach((forecast, index) => {
            // Toggles data for each day's information
            const temp = forecast.main.temp;
            const wind = forecast.wind.speed;
            const humidity = forecast.main.humidity;
            var weatherIconCode = forecast.weather[0].icon;
            var fetchWeatherIcon = `https://openweathermap.org/img/w/${weatherIconCode}.png`;

            // Toggle HTML elements in acsending order stoppping that 5
            const grabTempId = `temp${index + 1}`;
            const grabWindId = `wind${index + 1}`;
            const grabHumidityId = `humidity${index + 1}`;
            const grabWeatherIconId = `weatherIcon${index + 1}`;

            const grabTemp = document.getElementById(grabTempId);
            const grabWind = document.getElementById(grabWindId);
            const grabHumidity = document.getElementById(grabHumidityId);
            const grabWeatherIcon = document.getElementById(grabWeatherIconId);
           
            // Update and displays daily forecast for city 
            if (grabTemp && grabWind && grabHumidity && grabWeatherIcon) {
                grabTemp.innerHTML = `Temp: ${temp}°F`
                grabWind.innerHTML = `Wind: ${wind} MPH`
                grabHumidity.innerHTML = `Humidity: ${humidity}%`
                grabWeatherIcon.src = fetchWeatherIcon
               
            }
        });
           
    });
}

// Generates default weather for Portland, OR
const city = 'Portland';

// Fetch and displays the default weather data
fetchWeatherData(city)
.then(data => {
    displayWeatherData(data)
})

// Toggles the list of added cities or creates a list for added cities
const citiesList = document.getElementById('cities');
const addedCities = JSON.parse(localStorage.getItem('addedCities')) || [];

// Function to update the list of added cities in local storage
function updatedAddedCities(city) {
    addedCities.push(city);
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
}

// Function to display the list of added cities on the web page
function displayAddedCities() {
    citiesList.innerHTML = '';

    addedCities.forEach(city => {
        const newCity = document.createElement('li');
        newCity.innerHTML = city;
        citiesList.appendChild(newCity);
    });
}

// Displays a list of city if applicable on page load
displayAddedCities();

// Event listener for search button 
searchBtn.addEventListener('click', () => {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city === '') {
        cityInput.placeholder = 'Invalid Search';
    } else if (addedCities.includes(city)) {
        cityInput.value = '';
        cityInput.placeholder = 'City already in list';
    } else {
        // Fetches and displays weather information for searched city
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

// Event listener for clicking on a city in the added cities list
citiesList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const searchedCity = event.target.textContent;
        // Fetch and displays weather information for clicked city in added cities list
        fetchWeatherData(searchedCity)
        .then(data => {
            displayWeatherData(data);
        })
    }
});

// Event listener for clearing the added cities list
clearSearchBtn.addEventListener('click', () => {
    addedCities.length = 0;
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
    displayAddedCities();
});

// Current day
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




