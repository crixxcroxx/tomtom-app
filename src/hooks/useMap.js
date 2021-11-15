import { useEffect, useState } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';

export default function useMap() {
  const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"
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
