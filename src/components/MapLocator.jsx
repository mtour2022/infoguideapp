import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Default center set to Boracay Island, Philippines.
const defaultCenter = {
  lat: 11.967,
  lng: 121.924,
};

export default function MapWidgetFormGroup({ onLocationSelect, name, resetKey }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB12zV70G4pEPERWnWPiC69_BZhw_5Af9k", // Replace with your API key
  });

  const [selectedPosition, setSelectedPosition] = useState(null);

  // Reset location when resetKey changes
  useEffect(() => {
    setSelectedPosition(null); // Reset map marker
  
    // Only reset form data if onLocationSelect is provided
    if (onLocationSelect) {
      onLocationSelect({ lat: "11.967", lng: "121.924" }, ""); // Provide an empty object instead of null
    }
  }, [resetKey]);
  

  // When the map is clicked, update the selected position and call the callback.
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const position = { lat, lng };
    setSelectedPosition(position);
    const link = name 
      ? `http://maps.google.com/?q=${encodeURIComponent(name)}&sll=${lat},${lng}` 
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    if (onLocationSelect) {
      onLocationSelect(position, link);
    }
  };

  return (
    <Form.Group controlId="formMapLocation" className="mb-3">
      <Form.Label className="label">Select Location</Form.Label>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedPosition || defaultCenter}
          zoom={15}
          onClick={handleMapClick}
        >
          {selectedPosition && <Marker position={selectedPosition} />}
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </Form.Group>
  );
}
