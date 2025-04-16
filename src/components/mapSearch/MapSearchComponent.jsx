import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEyeSlash,
  faEye,
  faLocationPin,
  faLocationPinLock,
} from "@fortawesome/free-solid-svg-icons";
import { OverlayView } from "@react-google-maps/api";

const MapPopup = ({ datas, collectionName}) => {
  const navigate = useNavigate();

  const handleReadMore = (collectionName, dataId) => {
    const readCollections = ["stories", "incomingEvents", "deals", "updates", "lifeStyles", "helpfulLinks", "cruiseShips", "travelExpos", "tourismProjects", "awardsAndRecognitions", "tourismMarkets"];
  
    const path = readCollections.includes(collectionName)
      ? `/read/${collectionName}/${dataId}`
      : `/view/${collectionName}/${dataId}`;
  
    console.log(collectionName);
    console.log(dataId);
    navigate(path);
  };
  
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.9674, lng: 121.9274 });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const mapRef = useRef(null);
  const [hidePOI, setHidePOI] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB12zV70G4pEPERWnWPiC69_BZhw_5Af9k",
  });

  const mapContainerStyle = { height: "100%", width: "100%" };

  const uniquedatas = Array.from(
    new Map(datas.map((acc) => [acc.id, acc])).values()
  );

  useEffect(() => {
    setSelectedAcc(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setCurrentLocation(null);
        }
      );
    }

    return () => {
      mapRef.current = null;
      setSelectedAcc(null);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        google.maps.event.trigger(mapRef.current, "resize");
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleResize = () => {
    if (mapRef.current) {
      google.maps.event.trigger(mapRef.current, "resize");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkerClick = (acc) => {
    setSelectedAcc(acc);
    setMapCenter({ lat: acc.address.lat, lng: acc.address.long });
    if (mapRef.current) {
      mapRef.current.panTo({ lat: acc.address.lat, lng: acc.address.long });
      mapRef.current.setZoom(19);
    }
  };

  const togglePOI = () => {
    const newHideState = !hidePOI;
    setHidePOI(newHideState);

    const newStyles = newHideState
      ? [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ]
      : [];

    if (mapRef.current) {
      mapRef.current.setOptions({ styles: newStyles });
    }
  };

  const toggleCurrentLocation = () => {
    const willShow = !showCurrentLocation;
    setShowCurrentLocation(willShow);

    if (willShow && currentLocation && mapRef.current) {
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      mapRef.current.panTo(currentLocation);
    }
  };

  return (
    <div className="map-popup-container">
      {!isLoaded ? (
        <div>Loading map...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={{
            disableDefaultUI: true,
            gestureHandling: "greedy",
          }}
        >
          {uniquedatas.map((acc) => (
            <OverlayView
            key={acc.id}
            position={{ lat: acc.address.lat, lng: acc.address.long }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
            <div
              className="custom-map-marker"
              onClick={() => handleMarkerClick(acc)}
              title={acc.name}
            >
              <img src={acc.logo || acc.headerImage} alt={acc.name} />
            </div>

            </OverlayView>

            ))}


          {showCurrentLocation && currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "blue",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              }}
              title="Your Current Location"
            />
          )}
        </GoogleMap>
      )}

      {selectedAcc && (
        <div
          className="map-bottom-card"
          onClick={() => handleReadMore(collectionName, selectedAcc.id)}
        >
          <div className="map-card-content">
            <img src={selectedAcc.headerImage} alt={selectedAcc.name} />
            <div className="map-card-text">
              <h4>{selectedAcc.name}</h4>
              <p>{selectedAcc.classification}</p>
              <p className="text-muted">
                {[selectedAcc.address?.street, selectedAcc.address?.barangay, selectedAcc.address?.town, selectedAcc.address?.province]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="map-buttons-container">
        <Button
          variant="outline-secondary"
          onClick={togglePOI}
          className="map-toggle-button"
        >
          <FontAwesomeIcon className="me-2" icon={hidePOI ? faEyeSlash : faEye} />
          {hidePOI ? "Show Other Markers" : "Hide Other Markers"}
        </Button>

        <Button
          variant="outline-primary"
          onClick={toggleCurrentLocation}
          className="map-toggle-location-button"
        >
          <FontAwesomeIcon
            className="me-2"
            icon={showCurrentLocation ? faLocationPin : faLocationPinLock}
          />
          {showCurrentLocation ? "Hide My Location" : "Show My Location"}
        </Button>
      </div>
    </div>
  );
};

export default MapPopup;
