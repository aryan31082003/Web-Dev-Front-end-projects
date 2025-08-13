const apiKey = '08ea3684692b66bc2dea96371f5f49f3'; 

function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('weatherInfo').innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature : ${data.main.temp}°C</p>
                    <p>Humidity : ${data.main.humidity}%</p>
                    <p>Cloudiness : ${data.clouds.all}%</p>
                `;
            } else {
                document.getElementById('weatherInfo').innerHTML = `<p>City not found</p>`;
            }
        })
        .catch(error => console.error('Error fetching weather:', error));
}



