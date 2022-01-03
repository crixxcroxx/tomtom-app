import tt from '@tomtom-international/web-sdk-maps';

import ttSearchBox from "./ttSearchBox";
import ttGetNearbyPOI from "./ttGetNearbyPOI";

const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"

const ttMap = (coords, setCoords, setSuggestions) => {
  const map = tt.map({
    key: tomtom_key,
    container: "mapElement",
    basePath: "sdk",
    source: "vector",
    stylesVisibility: {
      trafficIncidents: true,
      trafficFlow: true
    },
    center: {
      lat: coords.lat,
      lng: coords.lng
    },
    zoom: 13
  })

  // add search box on top-left of the map
  map.addControl(ttSearchBox, 'top-left')

  // search box functionality
  ttSearchBox.on('tomtom.searchbox.resultselected', function({data}) {
    // center the selected location
    setCoords({
      lat: data.result.position.lat,
      lng: data.result.position.lng
    })

    // zoom/pan animation to selected location
    map.flyTo({
      center: {lat: data.result.position.lat, lng: data.result.position.lng},
      zoom: 13
    })

    ttGetNearbyPOI(data.result.position, setSuggestions)
  })

  // onclick event on map
  map.on('click', e => {
    // get nearby points of interest
    ttGetNearbyPOI(e.lngLat, setSuggestions)
  })

  return map
}

export default ttMap;