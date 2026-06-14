export default function WeatherCard({ data }) {
    const weather = data.weather[0];

    return (
        <div className="card">

            {/* Top Row */}
            <div className="top">
                <div>
                    <h2>{data.name}, {data.sys.country}</h2>
                    <p>{weather.description}</p>
                </div>
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt="weather"
                />
            </div>

            {/* Middle Row */}
            <div className="middle">
                <p>{Math.round(data.main.temp)}°C</p>
            </div>

            {/* Bottom Row */}
            <div className="bottom">
                <span>Humidity: {data.main.humidity}%</span>
                <span>Wind: {data.wind.speed} m/s</span>
            </div>

        </div>
    );
}
