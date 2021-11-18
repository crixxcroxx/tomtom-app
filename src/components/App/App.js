import useMap from '../../hooks/useMap';
import Side from '../Side/Side';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

const App = () => {
  const {
    origin, location, locationSuggestions, destinations,
    setOrigin, setLocation, setDestinations
  } = useMap()

  const side = {
    data: {origin, location, locationSuggestions, destinations},
    methods: {setOrigin, setLocation, setDestinations}
  }

  return (
    <div className="app">
      <div id="mapElement" className="map"></div>
      <Side side={side}/>
    </div>
  );
}

export default App;
