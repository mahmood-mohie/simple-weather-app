import {getWeather} from './weather.js'
import {ICON_MAP} from "./iconMap.js"

getWeather(28.10988 , 30.7503, Intl.DateTimeFormat().resolvedOptions().timeZone)
.then((parsedData) => {
    const {current, daily, hourly} = parsedData
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
})
.catch(error => {
    console.error('Error:', error);
});


function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}
function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}
const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-high", current.highFeelsLike)
    setValue("current-fl-low", current.lowFeelsLike)
    setValue("current-wind", current.windSpeed)
    setValue("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday : "short" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")

function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp ,{parent : element})
        setValue("date", DAY_FORMATTER.format(day.timestamp)  ,{parent : element})
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    });
}


const Hour_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp ,{parent : element})
        setValue("fl-temp", hour.feelsLike ,{parent : element})
        setValue("wind", hour.windSpeed ,{parent : element})
        setValue("temp", hour.temp ,{parent : element})
        setValue("precip", hour.precip ,{parent : element})
        setValue("day", DAY_FORMATTER.format(hour.timestamp)  ,{parent : element})
        setValue("time", Hour_FORMATTER.format(hour.timestamp)  ,{parent : element})
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    });
}

