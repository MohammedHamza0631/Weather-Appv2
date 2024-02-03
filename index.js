import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import env from 'dotenv';
import ejs from 'ejs';

env.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


  
//   try {
//       const response = await axios.request(options);
//       console.log(response.data);
//   } catch (error) {
//       console.error(error);
// }

app.get('/', (req, res) => {
    res.render('home.ejs', { weather: null });
});
  
app.get('/searchWeather', async (req, res) => {
    try {
        const city = req.query.city;
        const options = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/current.json',
            params: {q: `${city}`},
            headers: {
              'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
              'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
            }
        };
        const options1 = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/astronomy.json',
            params: {q: 'New Delhi'},
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
            }
        };
        const sunriseSunset = await axios.request(options1);
        const sunData = sunriseSunset.data;
        const weatherData = await axios.request(options);
        const weatherResponse = weatherData.data;
        const timeApiUrl = `https://timeapi.io/api/Time/current/coordinate?latitude=${weatherResponse.location.lat}&longitude=${weatherResponse.location.lon}`;
        const timeApiAns = await axios.get(timeApiUrl);
        const timeData = timeApiAns.data;
        // console.log(timeData);
        // console.log(weatherData.data);
        // console.log(weatherResponse.current.condition.icon);
        // console.log(sunData.astronomy);
        res.render('index.ejs', {
            cityName: weatherResponse.location.name,
            cityDate: timeData.date,
            cityTime: timeData.time,
            cityDay: timeData.dayOfWeek,
            cityTemp: weatherResponse.current.temp_c,
            cityFeelsLike: weatherResponse.current.feelslike_c,
            cityCondition: weatherResponse.current.condition.text,
            cityWeatherIcon: weatherResponse.current.condition.icon,
            cityWind: weatherResponse.current.wind_kph,
            cityHumidity: weatherResponse.current.humidity,
            cityUv: weatherResponse.current.uv,
            cityPressure: weatherResponse.current.pressure_mb,
            citySunrise: sunData.astronomy.astro.sunrise,
            citySunset: sunData.astronomy.astro.sunset
        });
        
    } catch (error) {
        console.log(error);
    }

});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
    
