const API_KEY = "8f1497db9c9400bf03fbe1b106fc4974";

export const getWeather = async (city) => {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return res.json();
};

export const getForecast = async (city) => {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    return res.json();
};
