const ttDrawRoute = (geoJson, map) => {
  // remove old layer
  if (map.getLayer('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  }

  // add path layer to map
  map.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geoJson
    },
    paint: {
      'line-color': '#4a90e2',
      'line-width': 6
    }
  })
}

export default ttDrawRoute;
