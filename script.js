const inputField = document.getElementById("city")
const searchBtn = document.getElementById("search")
const forecastDiv = document.getElementById("forecast-div")
const errorMsg = document.getElementById("error")

const apiKey1 = "f6256b2f54327d5967846ab0e3b01a2d"
// const apiKey2 = "fAvL9zaK1amGR3VWW1YDw39s8g9RXFlw"
const weatherUrl =
	"https://api.openweathermap.org/data/2.5/weather?units=metric"
const forecastUrl =
	"https://api.openweathermap.org/data/2.5/forecast?units=metric"

async function getWeatherInfo() {
	const city = inputField.value
	if (!city) {
		alert("Please enter a valid city name.")
		weatherIcon.style.display = "none"
	}

	// get current weather data
	try {
		const response = await fetch(weatherUrl + `&q=${city}&appid=${apiKey1}`)
		const weatherData = await response.json()

		if (response.status == 404) {
			errorMsg.innerHTML =
				"City not found. Please enter a valid city name"
			console.log(data.cod)
		} else {
			errorMsg.innerHTML = ""
			displayWeatherInfo(weatherData)
		}
	} catch (error) {
		console.log("Encountered error while fetching data - ", error)
	}

	// get 5-day weather forecast data
	try {
		const response = await fetch(
			forecastUrl + `&q=${city}&appid=${apiKey1}`
		)

		if (!response.ok) {
			console.log(data.cod)
		}

		const forecastData = await response.json()
		displayFiveDayForecast(forecastData.list)
	} catch (error) {
		console.log("Encountered error while fetching data - ", error)
	}
}

function displayWeatherInfo(data) {
	const weatherIcon = document.getElementById("weather-icon")
	const temperature = document.getElementById("temp-div")
	const weatherMessage = document.getElementById("weather-info")

	weatherIcon.style.display = "block"
	temperature.innerHTML = `${Math.round(
		data.main.temp
	)}<span id="celsius"><sup>℃</sup></span>`

	// retrieve and update icon from data
	const iconValue = data.weather[0].icon
	const iconUrl = `https://openweathermap.org/img/wn/${iconValue}@2x.png`
	weatherIcon.src = iconUrl

	// update the weather message/desription
	const p = `<p id="desc">${data.weather[0].description}<br />
	<span>${data.name}</span>
	</p>`
	const temp = document.querySelector("#desc")
	if (weatherMessage.contains(temp)) {
		temp.remove() // prevents weather information from being added to the DOM multiple times when the search btn is clicked
	}
	weatherMessage.innerHTML = p
}
function displayFiveDayForecast(data) {
	// update forecast information by clearing previously displayed data
	document.querySelectorAll(".daily").forEach((day) => day.remove())

	const dailyForecastDiv = document.getElementById("daily-item-div")
	const today = new Date().getDay()
	const fiveDayForecast = []
	const isUnique = {}

	data.forEach((item) => {
		// forecast api returns a 5-day weather forecast in 3-hour sections of each day
		// this function returns only one forecast each, for the five days

		const dateTime = new Date(item.dt * 1000)
		const date = dateTime.getDate()
		if (isUnique[date]) {
			return
		} else {
			isUnique[date] = true
			if (fiveDayForecast.length != 5) fiveDayForecast.push(item)
		}
	})

	fiveDayForecast.forEach((item) => {
		const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		const dateTime = new Date(item.dt * 1000)
		const month = dateTime.getMonth() + 1
		const monthDay = dateTime.getDate()
		const dayIndex = dateTime.getDay()

		let weekday
		if (dayIndex === today) {
			weekday = "Today"
		} else if (dayIndex === today + 1) {
			weekday = "Tomorrow"
		} else {
			weekday = weekDays[dayIndex]
		}

		const temperature = Math.round(item.main.temp_max)
		const iconValue = item.weather[0].icon
		const iconUrl = `https://openweathermap.org/img/wn/${iconValue}@2x.png`

		const dailyForecast = `
							<div class="daily">
								<p class="dd">${weekday}</p>
								<p class="dt">${monthDay}/${month}</p>
								<img src="${iconUrl}" alt="Forecast Icon">
								<span class="forecast-temp">${temperature}°</span>
							</div>
							`

		dailyForecastDiv.insertAdjacentHTML("beforeend", dailyForecast)

		// unhide forecast div
		forecastDiv.style.display = "block"
	})
}
searchBtn.addEventListener("click", getWeatherInfo)

//clear input field
const clearInputField = () => {
	inputField.value = ""
	inputField.focus()
}
