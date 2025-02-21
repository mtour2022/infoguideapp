import axios from "axios";
import Weather from "../classes/Weather";

const API_KEY = "1d9a1433d0b0df7ef043daba54417bce";
const ZIP_CODE = "5608";
const BASE_URL = `http://api.openweathermap.org/data/2.5/weather?zip=${ZIP_CODE},ph&units=metric&appid=${API_KEY}`;

export const getWeatherData = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return Weather.fromJson(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return new Weather({
      feelsLike: ".",
      location: ".",
      temp: ".",
      tempMin: ".",
      tempMax: ".",
      weather: ".",
      humidity: ".",
      windspeed: ".",
      visibility: ".",
      airpressure: ".",
      weathericon: "03d",
    });
  }
};
