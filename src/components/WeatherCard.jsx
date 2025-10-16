import React, { useEffect, useState } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { getWeatherData } from "../services/GetWeather";
import backgroundfade from "../assets/backgroundfade.png";
import PortScheduleTodayComponent from "./portLocationAdmin/portLocationComponent";

export default function UpdateSection() {
  const [weather, setWeather] = useState(null);

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

  return (
    <section
                    className="map-section-short d-flex align-items-center justify-content-center position-relative"
                    style={{
                        backgroundImage: `url(${backgroundfade})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center bottom",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "300px",
                        aspectRatio: "16 / 9",
                    }}
                >
      <Row className="justify-content-center align-items-center w-100 px-2 text-center">
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center mb-3 mb-md-0"
        >

          <div
            className="px-3 py-3 border-start border-4 border-primary text-start shadow-sm"
            style={{
              backgroundColor: "#f5fbff",
              fontSize: "0.85rem",
              lineHeight: 1.3,
              maxWidth: "500px",
              width: "100%",
            }}
          >
             <p className="text-muted mb-2 fw-bold" style={{ fontSize: "0.8rem" }}>
              Weather today
            </p>
            {!weather ? (
              <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                Loading weather...
              </p>
            ) : (
              <Row className="align-items-center gx-3">
                <Col xs="auto">
                  <Image
                    className="me-4"
                    src={`http://openweathermap.org/img/wn/${weather.weathericon}@2x.png`}
                    alt="Weather Icon"
                    height={60}
                    width={60}
                    style={{
                      border: "1px solid #ffffffff",
                      borderRadius: "8px",
                      padding: "4px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                </Col>

                <Col>
                  <p
                    className="fw-bold mb-1"
                    style={{
                      fontSize: "1.5rem",
                      color: "#333",
                    }}
                  >
                    {weather.temp}°C ·{" "}
                    {weather.weather
                      .split(" ")
                      .map(
                        (w) => w.charAt(0).toUpperCase() + w.slice(1)
                      )
                      .join(" ")}
                  </p>

                  <p
                    className="text-muted mb-3"
                    style={{ fontSize: "0.8rem" }}
                  >
                    as of{" "}
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    in {weather.location}
                  </p>

                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Feels like {weather.feelsLike}°C · Wind:{" "}
                    {weather.windspeed} m/s · Humidity: {weather.humidity}%
                  </p>
                </Col>
              </Row>
            )}
          </div>
        </Col>

      </Row>
    </section>
  );
}
