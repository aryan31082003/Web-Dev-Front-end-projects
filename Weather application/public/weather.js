window.onload = function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
    }
};

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

function getWeather() {
    const city = document.getElementById('city').value;
    const token = localStorage.getItem('token');

    if (!city) {
        alert("Please enter a city");
        return;
    }

    fetch(`http://localhost:5000/api/weather?city=${city}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById('weatherInfo').innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Cloudiness: ${data.clouds.all}%</p>
        `;
    })
    .catch(() => alert("Failed to fetch weather"));
}
