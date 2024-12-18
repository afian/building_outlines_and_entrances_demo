import React, { useEffect } from "react";
import { Map as GMap, useMap } from "@vis.gl/react-google-maps";
import PlaceMarker from "./PlaceMarker";
import EntranceMarker from "./EntranceMarker";
import Polygon from "./Polygon";

const Map = ({ place }) => {
  const mapInstance = useMap();

  useEffect(() => {
    if (place && mapInstance) {
      const { latitude, longitude } = place;
      mapInstance.panTo({ lat: latitude, lng: longitude });
      mapInstance.setZoom(20);

      if (place.outlines) {
        const bounds = new window.google.maps.LatLngBounds();
        let hasBounds = false;

        place.outlines.forEach((polygon) => {
          polygon.outline.forEach(({ lat, lng }) => {
            if (!!lat && !!lng) {
              hasBounds = true;
              bounds.extend(new window.google.maps.LatLng(lat, lng));
            }
          });
        });
        if (hasBounds) {
          mapInstance.fitBounds(bounds);
        }
      }
    }
  }, [place, mapInstance]);

  return (
    <GMap
      mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
      defaultCenter={{ lat: 49.2569501547411, lng: -123.11058970045666 }}
      defaultZoom={12}
      disableDefaultUI
    >
      {place?.outlines &&
        place.outlines.map((polygon) => (
          <Polygon key={polygon.id} polygon={polygon.outline} />
        ))}
      {place?.entrances &&
        place.entrances.map((entrance) => (
          <EntranceMarker key={entrance.id} entrance={entrance} />
        ))}
      {place && <PlaceMarker place={place} />}
    </GMap>
  );
};

export default Map;
