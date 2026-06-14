import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import History from "./components/History";
import { getWeather, getForecast } from "./services/weatherApi";


function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("weatherHistory")) || []
  );

  useEffect(() => {
    fetchWeather(city);
  }, []);

  useEffect(() => {
    if (weather?.type) {
      document.body.className = weather.type.toLowerCase();
    }
  }, [weather]);


  const fetchWeather = async (cityName) => {
    const data = await getWeather(cityName);
    setWeather({ ...data, type: data.weather[0].main });

    const fore = await getForecast(cityName);
    setForecast(fore.list.filter(f => f.dt_txt.includes("12:00:00")));

    saveHistory(cityName);
  };

  const saveHistory = (city) => {
    let updated = history.filter(h => h !== city);
    updated.unshift(city);
    updated = updated.slice(0, 6);
    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

  const deleteHistory = (city) => {
    const updated = history.filter(h => h !== city);
    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

  return (
    <main className={`app ${weather?.type?.toLowerCase()}`}>
      <h1 className="title">🌦 Live Weather</h1>

      <div className="controls">
        <SearchBox onSearch={fetchWeather} />
      </div>
      {weather && <WeatherCard data={weather} />}
      <Forecast data={forecast} />
      <History data={history} onSelect={fetchWeather} onDelete={deleteHistory} />
    </main>
  );
}

export default App;
