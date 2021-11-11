import { useEffect, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
/*import * as ttapi from '@tomtom-international/web-sdk-services';*/
import './App.css';

const App = () => {
  const positionstack_key = "b6a2d80cb74268d4b6f819f7bc75e5a0"
  const url = `http://api.positionstack.com/v1/forward?access_key=${positionstack_key}&query=`

  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const [map, setMap] = useState({})
  const [lat, setLat] = useState(16.932122)
  const [lon, setLon] = useState(121.387948)

  async function searchLocation(ev) {
    ev.preventDefault()

    let res = await fetch(`${url}${ev.target["location"].value}`)
    let search = await res.json()

    if(search.data.length == 1) {
      setLat(search.data[0].latitude)
      setLon(search.data[0].longitude)
    } else {
      setSearchResults(search.data)
    }
  }

  useEffect(() => {
    let map = tt.map({
      key: "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl",
      container: "mapElement",
      basePath: "sdk",
      source: "vector",
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true
      },
      center: {lat: lat, lng: lon},
      zoom: 13
    });

    setMap(map)

    return () => map.remove()
  }, [lat, lon])

  return (
    <>{ map &&
      <div className="app">
        <div id="mapElement" className="map"></div>

        <form onSubmit={searchLocation}>
          <input
            type="app"
            name="location"
            placeholder="Search location"
          />
          <button>Search</button>
        </form>

        <div className="search-results">{
          searchResults.length > 1 &&
          <ul className="list">{
            searchResults.map(item =>
              <li key={item.latitude} onClick={() => {
                setLat(item.latitude)
                setLon(item.longitude)
              }}>
                {item.label}
              </li>
            )
          }</ul>
        }</div>
      </div>
    }</>
  );
}

export default App;
