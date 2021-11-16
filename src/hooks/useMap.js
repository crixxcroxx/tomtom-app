import { useEffect, useState } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';

export default function useMap() {
  const url = `https://api.tomtom.com/search/2`
  const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"
  const [map, setMap] = useState({})
  const [lat, setLat] = useState(14.5454)
  const [lng, setLng] = useState(121.0687)
  const [origin, setOrigin] = useState({})
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [location, setLocation] = useState({})
  const [destinations, setDestinations] = useState([])

  const getLocationInfo = async (data) => {
    let res = await fetch(`${url}/nearbySearch/.json?lat=${data.lat}&lon=${data.lng}&radius=1000&key=${tomtom_key}`)
    let resData = await res.json()

    setLocationSuggestions(resData.results)
  }

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

  const ttSearchBox = new SearchBox(services, options)

  /*marker*/
  const marker = (coords) => {
    const markerElement = document.createElement('div')
    markerElement.className = 'marker'

    const mrkr = new tt.Marker({
      dragabble: false,
      element: markerElement
    }).setLngLat([coords.lng, coords.lat])

    return mrkr
  }

  /**/
  useEffect(() => {
    const iMap = tt.map({
      key: tomtom_key,
      container: "mapElement",
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

  return {
    origin, location, locationSuggestions, destinations,
    setOrigin, setLocation, setDestinations
  }
}
