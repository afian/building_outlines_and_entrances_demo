import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

import "./PlaceAutocompleteInput.scss";

const PlaceAutocompleteInput = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["place_id", "geometry", "name", "formatted_address"],
      types: ["premise", "subpremise", "street_address", "point_of_interest"]
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const handlePlaceChanged = () => {
      const { place_id } = placeAutocomplete.getPlace();

      if (place_id) {
        onPlaceSelect(placeAutocomplete.getPlace());
      }
    };

    const placeChangedListener = placeAutocomplete.addListener(
      "place_changed",
      handlePlaceChanged
    );

    return () => {
      if (placeChangedListener) {
        window.google.maps.event.removeListener(placeChangedListener);
      }
    };
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

export default PlaceAutocompleteInput;
