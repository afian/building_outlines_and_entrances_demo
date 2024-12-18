import React from "react";
import { AdvancedMarker as GMarker } from "@vis.gl/react-google-maps";
import { ReactComponent as GateSVG } from "../images/stop-gate.svg";

const EntranceMarker = ({ entrance }) => {
  return (
    <>
      <GMarker
        position={{
          lat: entrance.lat,
          lng: entrance.lng,
        }}
      >
        <GateSVG style={{ transform: "translateY(4px)" }} />
      </GMarker>
    </>
  );
};

export default EntranceMarker;
