import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Modal, Button, Card, Row, Col, Image } from "react-bootstrap";
import { getWeatherData } from "../services/GetWeather";

export default function WeatherNav() {
  const [weather, setWeather] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Weather Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeatherData();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchData();
  }, []);

  // Show loading if weather data is not available yet
  if (!weather) return <p>Loading weather...</p>;

  // Capitalize each word in the weather description
  const formattedWeather = weather.weather
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      {/* Weather Link */}
      <NavLink 
        className="ms-lg-2 me-lg-2 weather-text d-flex align-items-center text-decoration-none" 
        to="#"
        onClick={() => setShowModal(true)}
      >
        <Image
          src={`http://openweathermap.org/img/wn/${weather.weathericon}@2x.png`}
          alt="Weather Icon"
          height={25}
          width={25}
          className="me-2"
        />
        {formattedWeather.toUpperCase()} IN {weather.location.toUpperCase()}
      </NavLink>

      {/* Weather Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Weather Today!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <Row className="align-items-center justify-content-center text-center">
            <Col>
                <Row className="justify-content-center">
                    <Image
                        src={`http://openweathermap.org/img/wn/${weather.weathericon}@2x.png`}
                        alt="Weather Icon"
                        height={100}
                        style={{ width: "auto", height: "100px" }}
                    />
                </Row>
                <Row className="justify-content-center">
                    <h5 className="fw-bold">{new Date().toDateString()}</h5>
                    <p className="mb-1 fw-bold">
                        It feels like {weather.feelsLike}°C in {weather.location} today!
                    </p>
                    <h4 className="fw-bold">{weather.temp}°C · {formattedWeather}</h4>
                </Row>
            </Col>
        </Row>


        {/* <Row className="align-items-center justify-center" xs="auto">
            <Image
            src={`http://openweathermap.org/img/wn/${weather.weathericon}@2x.png`}
            alt="Weather Icon"
            height={100}
            width={100}
            />
        </Row> */}
        {/* <Row className="align-items-center">
            
            <Col xs="auto">
                <Image
                src={`http://openweathermap.org/img/wn/${weather.weathericon}@2x.png`}
                alt="Weather Icon"
                height={100}
                width={100}
                />
            </Col>
            <Col>
                <h5 className="fw-bold">{new Date().toDateString()}</h5>
                <p className="mb-1 fw-bold">
                It feels like {weather.feelsLike}°C in {weather.location} today!
                </p>
                <h4 className="fw-bold">{weather.temp}°C · {formattedWeather}</h4>
                <Row className="justify-content-between ">
                    <Col className="text-start justify-content-start align-items-start">
                        <p className="mb-1 caption text-muted">Temp Min: {weather.tempMin}°C</p>
                        <p className="mb-1 caption text-muted">Wind Speed: {weather.windspeed} m/s</p>
                        <p className="mb-1 caption text-muted">Humidity: {weather.humidity}%</p>
                    </Col>
                    <Col className="text-end">
                        <p className="mb-1 caption text-muted">Temp Max: {weather.tempMax}°C</p>
                        <p className="mb-1 caption text-muted">Air Pressure: {weather.airpressure} hPa</p>
                        <p className="mb-1 caption text-muted">Visibility: {weather.visibility} km</p>
                    </Col>
                </Row>
            </Col>
        </Row> */}

            

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
