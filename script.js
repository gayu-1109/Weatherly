
const apiKey = "8f1497db9c9400bf03fbe1b106fc4974";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const messageEl = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.getElementById("weatherIcon");
const tempEl = document.getElementById("temperature");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const historyList = document.getElementById("historyList");

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
  const history = getHistory();
  if (history.length) {
    getWeather(history[0]);
  }
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return showMessage("Please enter a city name.");
  getWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

locBtn?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showMessage("Geolocation not supported by your browser.");
    return;
  }
  showMessage("Fetching your location...");
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => {
      showMessage("Permission denied or location unavailable.");
    },
    { timeout: 10000 }
  );
});

async function getWeather(city) {
  try {
    showMessage("Loading...");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unable to fetch weather");
    updateUI(data);
    saveHistory(data.name);
    showMessage("");
  } catch (err) {
    showMessage(err.message || "Error fetching weather.");
    hideCard();
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    showMessage("Loading...");
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unable to fetch weather");
    updateUI(data);
    saveHistory(data.name);
    showMessage("");
  } catch (err) {
    showMessage(err.message || "Error fetching weather by location.");
    hideCard();
  }
}

function updateUI(data) {
  const weather = data.weather?.[0];
  cityNameEl.textContent = `${data.name}, ${data.sys?.country || ""}`;
  descriptionEl.textContent = (weather?.description || "").replace(/\b\w/g, c => c.toUpperCase());

  if (weather) {
    weatherIconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.main}" />`;
  } else {
    weatherIconEl.innerHTML = "";
  }

  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  feelsEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windEl.textContent = `Wind: ${data.wind.speed} m/s`;

  setBackground(weather?.main || "");
  showCard();
}

function showMessage(msg) {
  if (!msg) {
    messageEl.classList.add("hidden");
    messageEl.textContent = "";
    return;
  }
  messageEl.textContent = msg;
  messageEl.classList.remove("hidden");
}
function showCard() { weatherCard.classList.remove("hidden"); }
function hideCard() { weatherCard.classList.add("hidden"); }

function setBackground(weatherMain) {
  const body = document.body;
  switch ((weatherMain || "").toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(135deg,#56ccf2,#2f80ed)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg,#bdc3c7,#2c3e50)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg,#00c6ff,#0072ff)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg,#e0eafc,#cfdef3)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg,#1f1c2c,#928dab)";
      break;
    case "mist":
    case "fog":
      body.style.background = "linear-gradient(135deg,#757f9a,#d7dde8)";
      break;
    default:
      body.style.background = "linear-gradient(135deg,#83a4d4,#b6fbff)";
  }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("weatherHistory")) || [];
  } catch {
    return [];
  }
}

function saveHistory(city) {
  const normalized = city.trim();
  if (!normalized) return;
  let history = getHistory();
  history = history.filter(h => h.toLowerCase() !== normalized.toLowerCase());
  history.unshift(normalized);
  if (history.length > 6) history.pop();
  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderHistory();
}

function deleteHistory(city) {
  let history = getHistory();
  history = history.filter(h => h.toLowerCase() !== city.toLowerCase());
  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderHistory();
}

async function getForecast() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "8f1497db9c9400bf03fbe1b106fc4974";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  const forecastContainer = document.getElementById("forecast-cards");
  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
          <h4>${dayName}</h4>
          <p>${date.toLocaleDateString("en-US", options)}</p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather">
          <p>${day.weather[0].description}</p>
          <p>🌡 ${Math.round(day.main.temp)}°C</p>
        `;
    forecastContainer.appendChild(card);
  });
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";
  history.forEach(city => {
    const li = document.createElement("li");

    const citySpan = document.createElement("span");
    citySpan.textContent = city;
    citySpan.title = `Search ${city}`;
    citySpan.addEventListener("click", () => getWeather(city));

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "delete-btn";
    delBtn.title = `Delete ${city} from history`;
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteHistory(city);
    });

    li.appendChild(citySpan);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
}
