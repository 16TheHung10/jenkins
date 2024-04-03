import React, { useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const SelectStorePosition = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const defaultCenter = {
    lat: 10.8231,
    lng: 106.6297,
  };

  const handleMapClick = (e) => {
    setSelectedPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={15}
        onClick={handleMapClick}
      >
        {selectedPosition && <Marker position={selectedPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default SelectStorePosition;
