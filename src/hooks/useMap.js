import { useEffect, useState } from 'react';

import ttMap from "../tomtom/ttMap";
import ttMarker from "../tomtom/ttMarker";
import ttPopup from "../tomtom/ttPopup";
import ttRecalculateRoutes from "../tomtom/ttRecalculateRoutes";

import useStore from "../zustand/store";

import removeMarkers from "../helpers/removeMarkers";

export default function useMap() {
  // let Pateros municipality be the default center of the map
  const coords = {
    lat: 14.5454,
    lng: 121.0687
  }

  const [map, setMap] = useState({})
  const [{ lat, lng }, setCoords] = useState(coords);

  const {
    origin,
    destinations,
    setMatrixData,
    setSuggestions
  } = useStore(state => state)

  /* initialize map */
  useEffect(() => {
    // create map
    const iMap = ttMap(
      { lat, lng },
      setCoords,
      setSuggestions
    )

    setMap(iMap)
  }, [])

  /* routing */
  useEffect(() => {
    removeMarkers()

    // add marker to map when origin is set
    if(Object.keys(origin).length > 0) {
      // create popup
      let pu = ttPopup(origin)

      //create marker then add both to map
      let mrkr = ttMarker({
        lat: origin.position.lat,
        lng: origin.position.lon
      }, 1).addTo(map).setPopup(pu)
    }

    // add marker to map when new destination is added
    if(destinations.length > 0) {
      destinations.map(dest => ttMarker({
        lat: dest.position.lat,
        lng: dest.position.lon
      }, 0).addTo(map).setPopup(ttPopup(dest)))
    }

    /* recalculate route matrix when
       destinations have changed,
       i.e. added new destination or deleted */
    ttRecalculateRoutes(
      origin,
      destinations,
      map,
      setMatrixData,
    )
  }, [origin, destinations])
}
