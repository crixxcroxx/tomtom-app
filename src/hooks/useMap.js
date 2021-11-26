import { useEffect, useState } from 'react';

import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'

export default function useMap() {
  const base_url = `https://api.tomtom.com/search/2`
  const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"
  const [map, setMap] = useState({})
  const [lat, setLat] = useState(14.5454)
  const [lng, setLng] = useState(121.0687)
  const [origin, setOrigin] = useState({})
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [destinations, setDestinations] = useState([])
  const [matrixData, setMatrixData] = useState([])

  /* get nearby points of interest */
  const getNearbyPOI = async (data) => {
    let res = await fetch(`${base_url}/nearbySearch/.json?lat=${data.lat}&lon=${data.lng}&radius=1000&key=${tomtom_key}`)
    let resData = await res.json()

    setLocationSuggestions(resData.results)
  }


  /* format points to follow this form
     this will be used in matrix calculation
     provided by tomtom */
  const formatPoints = (coords) => {
    return {
      point: {
        latitude: coords.lat,
        longitude: coords.lon
      }
    }
  }

  /* remove all markers */
  const removeMarkers = () => {
    //let parent = document.querySelector('.mapboxgl-canvas-container.mapboxgl-interactive.mapboxgl-touch-drag-pan.mapboxgl-touch-zoom-rotate')
    let q = document.querySelectorAll('#custom-marker.marker')
    let arr = Object.keys(q)

    arr.map(e => document.querySelector('#custom-marker.marker').remove())
  }


  /* search box */
  const ttSearchBox = new SearchBox(services, {
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
  })

  /* marker */
  const marker = (coords, caller) => {
    // create container element for marker
    const markerElement = document.createElement('div')
    markerElement.className = 'marker'
    markerElement.id = 'custom-marker'

    // caller === 1 is origin
    if(caller === 1) markerElement.style.backgroundColor = 'yellow'

    // create marker
    const mrkr = new tt.Marker({
      dragabble: false,
      element: markerElement
    }).setLngLat([coords.lng, coords.lat])

    return mrkr
  }

  /* popup */
  const popup = (obj, caller) => {
    let element = ''

    // caller === 1 is origin
    if(caller === 1) {
      element = `<p>${origin.poi.name}, ${origin.address.municipality}</p>`
    } else {
      element = `<p>
        ${obj.poi.name},
        ${obj.address.municipality} </p>`
    }

    const pu = new tt.Popup({
      offset: {
      bottom: [0, -30] }
    }).setHTML(element)

    return pu
  }

  /* route path */
  const drawRoute = (geoJson, map) => {
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

  /* sort destination routes */
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

    const matrix_data = []

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
              distance: result.response.routeSummary.lengthInMeters,
              idx: index
            }
          })

          // sort routes(time)
          resultsArray.sort((a, b) => {
            return a.drivingtime - b.drivingtime
          })

          const sortedLocations = resultsArray.map((result) => {
            matrix_data.push(result)
            return result.location
          })

          setMatrixData(matrix_data)

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

      getNearbyPOI(data.result.position)
    })

    // onclick event on map
    iMap.on('click', e => {
      // get nearby points of interest
      getNearbyPOI(e.lngLat)
    })
  }, [])


  /* routing */
  useEffect(() => {
    removeMarkers()

    // add marker to map when origin is set
    if(Object.keys(origin).length > 0) {
      // create popup
      let pu = popup({}, 1)

      //create marker then add both to map
      let mrkr = marker({
        lat: origin.position.lat,
        lng: origin.position.lon
      }, 1).addTo(map).setPopup(pu)
    }

    // add marker to map when new destination is added
    if(destinations.length > 0) {
      destinations.map(dest => marker({
        lat: dest.position.lat,
        lng: dest.position.lon
      }, 0).addTo(map).setPopup(popup(dest, 0)))
    }

    /* recalculate route matrix when
       destinations have changed,
       i.e. added new destination or deleted */
    recalculateRoute()
  }, [origin, destinations])


  return {
    origin, locationSuggestions, destinations, matrixData,
    setOrigin, setDestinations
  }
}
