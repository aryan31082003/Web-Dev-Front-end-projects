const axios = require('axios');

const cache = new Map();

exports.getWeather = async (req, res) => {
    const city = req.query.city;

    if (!city) return res.status(400).json({ error: "City required" });

    if (cache.has(city)) return res.json(cache.get(city));

    const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        { params: { q: city, units: 'metric', appid: process.env.WEATHER_API_KEY } }
    );

    cache.set(city, response.data);
    setTimeout(() => cache.delete(city), 10 * 60 * 1000);

    res.json(response.data);
};
