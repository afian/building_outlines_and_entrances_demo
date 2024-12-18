import React from "react";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import "./LocationSearchPanel.scss";

const LocationSearchPanel = ({ onPlaceSelect }) => {
  return (
    <div className="location-search-panel">
      <h3>Your Location</h3>
      <PlaceAutocompleteInput onPlaceSelect={onPlaceSelect} />
    </div>
  );
};

export default LocationSearchPanel;
