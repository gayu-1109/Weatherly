import React from "react";

export default function Forecast({ data }) {
    if (!data || data.length === 0) return null;

    // Keep only one forecast per day at 12:00
    const dailyData = data.filter(f => f.dt_txt.includes("12:00:00"));

    return (
        <div id="forecast">
            <h3>5-Day Forecast</h3><br />
            <div className="forecast-cards">
                {dailyData.map(day => (
                    <div key={day.dt} className="forecast-card">
                        <h4>{new Date(day.dt_txt).toDateString()}</h4>
                        <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].main}
                        />
                        <p>{Math.round(day.main.temp)}°C</p>
                        <p>{day.weather[0].main}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


