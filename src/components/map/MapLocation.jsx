import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapDisplay({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB12zV70G4pEPERWnWPiC69_BZhw_5Af9k", // Replace with your API key
  });

  const position = { lat: latitude, lng: longitude };

  return (
    <div>
      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
          <Marker position={position} />
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
}
