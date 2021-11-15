import { useEffect, useState, useRef } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';
import './App.css';


const App = () => {
  const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"
  const mapElement = useRef()
  const [map, setMap] = useState({})
  const [lat, setLat] = useState(14.5454)
  const [lng, setLng] = useState(121.0687)
  const [origin, setOrigin] = useState({})
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [location, setLocation] = useState({})
  const [destinations, setDestinations] = useState([])

  const positionstack_key = "b6a2d80cb74268d4b6f819f7bc75e5a0"
  const positionstack_url = `http://api.positionstack.com/v1/reverse?access_key=${positionstack_key}&query` /*{lat, lon}*/


  const getLocationInfo = async (data) => {
    let res = await fetch(`${positionstack_url}=${data.lat},${data.lng}`)
    let resData = await res.json()

    setLocationSuggestions(resData.data)
  }

  /**/
  useEffect(() => {
    const iMap = tt.map({
      key: tomtom_key,
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
        key: tomtom_key,
        language: 'en-GB',
        limit: 5
      },
      autocompleteOptions: {
        key: tomtom_key,
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
      getLocationInfo(data.result.position)
    })

    iMap.on('click', e => {
      getLocationInfo(e.lngLat)
    })

  }, [])

  return (
    <>{ map &&
      <div className="app">
        <div ref={mapElement} className="map"></div>
        <div className="app-controls">
          { Object.keys(origin).length == 0 &&
            <i>Search or Click on the map to select location</i>
          }
          { Object.keys(origin).length > 0 &&
            <>
              <div className="origin">
                <h3>Origin</h3>
                <p>{origin.name}</p>
                <i>{origin.label}</i>
              </div>
                <p><i>Search or Click on the map to select location</i></p>
            </>
          }
          <div className="location">
            <p><i>Choose any locations below to add to destination</i></p>
            <div>{
              locationSuggestions.length > 0 && locationSuggestions.map(loc => (
                <div
                  className="location-suggestions"
                  key={`${loc.latitude},${loc.longitude}`}
                  onClick={e => setLocation(loc)}
                >
                  <h3>{loc.name}</h3>
                  <p>{loc.label}</p>
                </div>
              ))

            }</div>
            { Object.keys(origin).length > 0 &&
              <button onClick={e => setDestinations([...destinations,location])}>Add</button>
            }
            { Object.keys(origin).length == 0 &&
              <button onClick={e => setOrigin(location)}>Set Origin</button>
            }
          </div>
          <div className="destinations-list">
            <p>Destinations</p>
            <ul>
              { destinations.length > 0 && destinations.map(destination =>
                  <li key={`${destination.latitude},${destination.longitude}`}>
                    {destination.name}
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    }</>
  );
}

export default App;
