import React, { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import Map from "./components/Map";
import LocationSearchPanel from "./components/LocationSearchPanel";
import axios from "axios";
import "./App.scss";

const App = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelection = async (placeResult) => {
    console.log(JSON.stringify(placeResult));
    try {
      const placeId = placeResult.place_id;
      // const placeId = "ChIJ4TTDdzS3j4AR78EQgu5EADA";
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/place-details`,
        {
          params: { placeId },
        }
      );

      const details = response.data;

      if (details) {
        setSelectedPlace({
          name: details.name,
          rating: details.rating,
          reviewsCount: details.reviewsCount,
          categories: details.category,
          imageUrl: details.imageUrl,
          address: placeResult.formatted_address,
          latitude: placeResult.geometry?.location?.lat(),
          longitude: placeResult.geometry?.location?.lng(),
          outlines: details.buildingData?.outlines,
          entrances: details.buildingData?.entrances,
        });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="app">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <div className="location-panel">
          <LocationSearchPanel onPlaceSelect={handlePlaceSelection} />
        </div>
        <Map place={selectedPlace} />
      </APIProvider>
    </div>
  );
};

export default App;
