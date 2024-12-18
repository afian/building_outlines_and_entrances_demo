// server/controllers/placeController.js
const axios = require("axios");

const getPlaceDetails = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const { placeId } = req.query;
    // Step 1: Retrieve place details using Place ID
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
    const placeDetailsResponse = await axios.get(placeDetailsUrl);
    const placeDetails = placeDetailsResponse.data.result;

    // Step 2: Extract the necessary information
    const placeInfo = {
      name: placeDetails.name,
      rating: placeDetails.rating,
      reviewsCount: placeDetails.user_ratings_total,
      category: placeDetails.types ? placeDetails.types.join(", ") : "",
      address: placeDetails.formatted_address,
      imageUrl: placeDetails.photos
        ? getPhotoUrl(placeDetails.photos[0].photo_reference, apiKey)
        : "",
      buildingData: await getPlaceOutline(placeId, apiKey),
    };

    res.json(placeInfo);
  } catch (error) {
    console.error("Error fetching place details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to get the photo URL
const getPhotoUrl = (photoReference, apiKey) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
};

const getPlaceOutline = async (placeId, apiKey) => {
  const outlineUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&extra_computations=BUILDING_AND_ENTRANCES&key=${apiKey}`;
  const outlineResponse = await axios.get(outlineUrl);
  const { buildings, entrances } = outlineResponse.data.results[0];

  if (!buildings) return { outlines: [], entrances: [] };

  // Extract all outlines for each building with a unique ID
  const buildingOutlines = buildings.flatMap((building, buildingIndex) =>
    building.building_outlines.map((outline, outlineIndex) => {
      const coordinates = outline.display_polygon.coordinates;
      let outlineCoordinates;

      // MultiPolygon
      if (coordinates.length > 1) {
        outlineCoordinates = coordinates.flatMap((multiPolygon) =>
          multiPolygon[0].map((polygon) => ({
            lat: polygon[1],
            lng: polygon[0],
          }))
        );
      } else {
        // Polygon
        outlineCoordinates = coordinates[0].map((polygon) => ({
          lat: polygon[1],
          lng: polygon[0],
        }));
      }

      return {
        id: `building_${buildingIndex + 1}_outline_${outlineIndex + 1}`, // Unique ID for each building outline
        outline: outlineCoordinates,
      };
    })
  );

  // Extract entrance coordinates with unique IDs if available
  const entranceCoordinates = entrances
    ? entrances.map((entrance, index) => ({
        id: `entrance_${index + 1}`, // Unique ID for each entrance
        lat: entrance.location.lat,
        lng: entrance.location.lng,
      }))
    : [];

  return { outlines: buildingOutlines, entrances: entranceCoordinates };
};

module.exports = { getPlaceDetails };
