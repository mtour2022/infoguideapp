export default class Weather {
    constructor({
      feelsLike,
      location,
      temp,
      tempMin,
      tempMax,
      weather,
      humidity,
      windspeed,
      visibility,
      airpressure,
      weathericon,
    }) {
      this.feelsLike = feelsLike;
      this.location = location;
      this.temp = temp;
      this.tempMin = tempMin;
      this.tempMax = tempMax;
      this.weather = weather;
      this.humidity = humidity;
      this.windspeed = windspeed;
      this.visibility = visibility;
      this.airpressure = airpressure;
      this.weathericon = weathericon;
    }
  
    static fromJson(json) {
      return new Weather({
        feelsLike: json.main.feels_like,
        location: json.name,
        temp: json.main.temp,
        tempMin: json.main.temp_min,
        tempMax: json.main.temp_max,
        weather: json.weather[0].description,
        weathericon: json.weather[0].icon,
        humidity: json.main.humidity,
        windspeed: json.wind.speed,
        visibility: json.visibility,
        airpressure: json.main.pressure,
      });
    }
  }
  