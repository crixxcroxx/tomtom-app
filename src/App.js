import { useEffect, useState, useRef } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';
import './App.css';


const App = () => {
  const api_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"
  const mapElement = useRef()
  const [map, setMap] = useState({})
  const [lat, setLat] = useState(14.5454)
  const [lng, setLng] = useState(121.0687)

  /**/
  useEffect(() => {
    const iMap = tt.map({
      key: api_key,
      container: mapElement.current,
      basePath: "sdk",
      source: "vector",
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true
      },
      center: {lat: lat, lng: lng},
      zoom: 13
    })
    setMap(iMap)

    /*search*/
    const options = {
      idleTimePress: 200,
      minNumberOfCharacters: 0,
      searchOptions: {
        key: api_key,
        language: 'en-GB',
        limit: 5
      },
      autocompleteOptions: {
        key: api_key,
        language: 'en-GB'
      },
      noResultsMessage: 'No results found.'
    }

    /*marker*/
    const marker = (coords) => {
      const markerElement = document.createElement('div')
      markerElement.className = 'marker'

      const mrkr = new tt.Marker({
        dragabble: true,
        element: markerElement
      }).setLngLat([coords.lng, coords.lat])

      return mrkr
    }

    const ttSearchBox = new SearchBox(services, options)
    iMap.addControl(ttSearchBox, 'top-left')

    ttSearchBox.on('tomtom.searchbox.resultselected', function({data}) {
      setLat(data.result.position.lat)
      setLng(data.result.position.lng)

      iMap.flyTo({
        center: {lat: data.result.position.lat, lng: data.result.position.lng},
        zoom: 13
      })

      marker(data.result.position).addTo(iMap)
    })

  }, [])

  return (
    <>{ map &&
      <div className="app">
        <div ref={mapElement} className="map"></div>
      </div>
    }</>
  );
}

export default App;
