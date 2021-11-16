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
  const [location, setLocation] = useState({})
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [destinations, setDestinations] = useState([])

  /* get nearby points of interest */
  const getNearbyPOI = async (data) => {
    let res = await fetch(`${url}/nearbySearch/.json?lat=${data.lat}&lon=${data.lng}&radius=1000&key=${tomtom_key}`)
    let resData = await res.json()

    setLocationSuggestions(resData.results)
  }


  /* format points to follow one form */
  const formatPoints = (coords) => {
    return {
      point: {
        latitude: coords.lat,
        longitude: coords.lon
      }
    }
  }


  /* search box options */
  const search_options = {
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

  // search instance
  const ttSearchBox = new SearchBox(services, search_options)

  /* marker */
  const marker = (coords) => {
    // create container element for marker
    const markerElement = document.createElement('div')
    markerElement.className = 'marker'

    // create marker
    const mrkr = new tt.Marker({
      dragabble: false,
      element: markerElement
    }).setLngLat([coords.lng, coords.lat])

    return mrkr
  }

  /* route path layer */
  const drawRoute = (geoJson, map) => {
    // remove first old layer if any
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

  /* sort destinations routes */
  const sortDestinations = (locations) => {
    // create formatted points array
    const pointsForDestinations = locations.map((loc) => {
      return formatPoints(loc.position)
    })

    const options = {
      key: tomtom_key,
      destinations: pointsForDestinations,
      origins: [formatPoints(origin.position)],
    }

    return new Promise((resolve, reject) => {
      // call tomtom services for matrix routing
      services
        .matrixRouting(options)
        .then((matrixAPIResults) => {
          const results = matrixAPIResults.matrix[0]
          const resultsArray = results.map((result, index) => {
            return {
              location: {
                lng: locations[index].position.lon,
                lat: locations[index].position.lat
              },
              drivingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })

          // sort routes(time)
          resultsArray.sort((a, b) => {
            return a.drivingtime - b.drivingtime
          })

          const sortedLocations = resultsArray.map((result) => {
            return result.location
          })

          resolve(sortedLocations)
        })
      })
  }

  /* recalculate and draw route path */
  const recalculateRoute = () => {
    if(destinations.length > 0) {
      // sort destinations first
      sortDestinations(destinations).then((sorted) => {
        sorted.unshift({lat: origin.position.lat, lng: origin.position.lon})

        // calculate optimized route
        services
          .calculateRoute({
            key: tomtom_key,
            locations: sorted,
          })

          // draw a path for the optimized route
          .then((routeData) => {
            const geoJson = routeData.toGeoJson()
            drawRoute(geoJson, map)
        })
      })
    }
  }


  /* initialize map */
  useEffect(() => {
    // create map
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

    // add search box on top-left of the map
    iMap.addControl(ttSearchBox, 'top-left')

    // search box functionality
    ttSearchBox.on('tomtom.searchbox.resultselected', function({data}) {
      // center the selected location
      setLat(data.result.position.lat)
      setLng(data.result.position.lng)

      // zoom/pan animation to selected location
      iMap.flyTo({
        center: {lat: data.result.position.lat, lng: data.result.position.lng},
        zoom: 13
      })

      // add marker on location and get nearby points of interest
      marker(data.result.position).addTo(iMap)
      getNearbyPOI(data.result.position)
    })

    // onclick event on map
    iMap.on('click', e => {
      // get nearby points of interest
      getNearbyPOI(e.lngLat)
    })
  }, [])


  /* routing */
  // note I separated this to prevent map rerender
  // every time a new destination is being added
  useEffect(() => {
    // add marker to map when origin is set
    if(Object.keys(origin).length > 0) {
      marker({
        lat: origin.position.lat,
        lng: origin.position.lon
      }).addTo(map)
    }

    // add marker to map when new destination is added
    if(destinations.length > 0) {
      marker({
        lat: destinations[0].position.lat,
        lng: destinations[0].position.lon
      }).addTo(map)
    }

    // recalculate route matrix when a new destination is added
    recalculateRoute()
  }, [origin, destinations])


  return {
    origin, location, locationSuggestions, destinations,
    setOrigin, setLocation, setDestinations
  }
}
