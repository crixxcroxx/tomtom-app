const removeMarkers = () => {
  const elementId = '#custom-marker.marker'
  const markerElements = document.querySelectorAll(elementId)
  const keys = Object.keys(markerElements)

  keys.map(e => document.querySelector(elementId).remove())
}

export default removeMarkers