import tt from '@tomtom-international/web-sdk-maps';

const ttMarker = (coords, caller) => {
  // create container element for marker
  const markerElement = document.createElement('div')
  markerElement.className = 'marker'
  markerElement.id = 'custom-marker'

  // caller === 1 is origin
  if(caller === 1) markerElement.style.backgroundColor = 'yellow'

  // create marker
  const marker = new tt.Marker({
    dragabble: false,
    element: markerElement
  }).setLngLat([coords.lng, coords.lat])

  return marker
}

export default ttMarker;