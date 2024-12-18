import { Polygon as GPolygon } from "./External/Polygon";

function Polygon({ polygon }) {
  return (
    <GPolygon
      paths={polygon}
      options={{
        fillColor: "#0094FF",
        strokeColor: "#0094FF",
        fillOpacity: 0.4,
        strokeOpacity: 1,
      }}
    />
  );
}

export default Polygon;
