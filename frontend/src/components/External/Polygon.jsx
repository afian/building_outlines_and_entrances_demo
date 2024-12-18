/* eslint-disable complexity */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { GoogleMapsContext, useMapsLibrary } from "@vis.gl/react-google-maps";

function usePolygon(props) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPaths,
    ...polygonOptions
  } = props;
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
  });

  const geometryLibrary = useMapsLibrary("geometry");

  const polygon = useRef(new window.google.maps.Polygon()).current;
  // update PolygonOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  useMemo(() => {
    polygon.setOptions(polygonOptions);
  }, [polygon, polygonOptions]);

  const map = useContext(GoogleMapsContext)?.map;

  // update the path with the encodedPath
  useMemo(() => {
    if (!encodedPaths || !geometryLibrary) return;
    const paths = encodedPaths.map((path) =>
      geometryLibrary.encoding.decodePath(path)
    );
    polygon.setPaths(paths);
  }, [polygon, encodedPaths, geometryLibrary]);

  // create polygon instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Polygon> has to be inside a Map component.");

      return;
    }

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map, polygon]);

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!polygon) return;

    // Add event listeners
    const gme = window.google.maps.event;
    [
      ["click", "onClick"],
      ["drag", "onDrag"],
      ["dragstart", "onDragStart"],
      ["dragend", "onDragEnd"],
      ["mouseover", "onMouseOver"],
      ["mouseout", "onMouseOut"],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polygon, eventName, (e) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });

    return () => {
      gme.clearInstanceListeners(polygon);
    };
  }, [polygon]);

  return polygon;
}

/**
 * Component to render a polygon on a map
 */
export const Polygon = forwardRef((props, ref) => {
  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon, [polygon]);

  return null;
});
