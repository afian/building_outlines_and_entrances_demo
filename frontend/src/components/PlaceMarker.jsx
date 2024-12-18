import React, { useState } from "react";
import {
  AdvancedMarker as GMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { ReactComponent as StopSVG } from "../images/stop-location.svg";
import InfoWindow from "./InfoWindow";

const PlaceMarker = ({ place }) => {
  const [markerRef, markerInstance] = useAdvancedMarkerRef();
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  return (
    <>
      <GMarker
        position={{
          lat: place.latitude,
          lng: place.longitude,
        }}
        ref={markerRef}
        onClick={() => {
          setIsInfoWindowOpen(true);
        }}
      >
        <StopSVG style={{ width: 30, transform: "translateY(8px)" }} />
      </GMarker>
      {isInfoWindowOpen && (
        <InfoWindow
          anchor={markerInstance}
          onCloseClick={() => setIsInfoWindowOpen(false)}
          place={place}
        />
      )}
    </>
  );
};

export default PlaceMarker;
