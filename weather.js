export async function getWeather(lat ,long ,timezone,) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&precipitation_unit=inch&timeformat=unixtime&timezone=${timezone}`)
    const data = await res.json();
    console.log(data)
    return {
    current : parseCurrentWeather(data) ,
    daily : parseDailyWeather(data) ,
    hourly : parseHourlyWeather(data) ,
    }
        
}

function parseCurrentWeather ({current_weather , daily}) {
    const { 
        temperature : currentTemp ,
        windspeed : windSpeed ,
        weathercode : iconCode
    } = current_weather
    const {
        temperature_2m_max : [maxTemp],
        temperature_2m_min : [minTemp],
        apparent_temperature_max : [maxFeelsLike],
        apparent_temperature_min : [minFeelsLike],
        precipitation_sum : [precip],
    } = daily
    return {
        currentTemp: Math.round(currentTemp),
        highTemp : Math.round(maxTemp) ,
        lowTemp :Math.round(minTemp) ,
        highFeelsLike : Math.round(maxFeelsLike),
        lowFeelsLike :Math.round(minFeelsLike) ,
        windSpeed : Math.round(windSpeed),
        precip : Math.round(precip),
        iconCode :  Math.round(iconCode),
    }
}

function parseDailyWeather({ daily })  {
    return daily.time.map( (time , i ) => {
        return {
            timestamp : time * 1000 ,
            iconCode : daily.weathercode[i],
            maxTemp : Math.round(daily.temperature_2m_max[i])
        }
    })
}

function parseHourlyWeather( {hourly ,current_weather}) {
    return hourly.time.map((time ,i) => {
        return {
            timestamp : time * 1000 ,
            iconCode : hourly.weathercode[i],
            temp : Math.round( hourly.temperature_2m[i]),
            feelsLike : Math.round( hourly.apparent_temperature[i]),
            windSpeed : Math.round( hourly.windspeed_10m[i]),
            precip : Math.round( hourly.precipitation_probability[i] * 100) /100 ,
        }
    }).filter(({timestamp}) => timestamp >= current_weather.time * 1000)
}