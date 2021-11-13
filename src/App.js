import { useEffect, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';
import './App.css';

const App = () => {
  const [map, setMap] = useState({})
  const [lat, setLat] = useState(14.6091)
  const [lon, setLon] = useState(121.0223)
  //const mapElement = document.querySelector("#mapElement")

  useEffect(() => {
    let im = tt.map({
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
    })
    setMap(im)

    const options = {
      searchOptions: {
        key: "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl",
        language: 'en-GB',
        limit: 5
      },
      autocompleteOptions: {
        key: "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl",
        language: 'en-GB'
      }
    }
    const ttSearchBox = new SearchBox(services, options)
    ttSearchBox.on('tomtom.searchbox.resultselected', function({data}) {
      const { lat, lng } = data.result.position
      setLat(lat)
      setLon(lng)
    });

    im.addControl(ttSearchBox, 'top-left');

  }, [lat, lon])



  return (
    <>{ map &&
      <div className="app">
        <div id="mapElement" className="map"></div>
      </div>
    }</>
  );
}

export default App;
