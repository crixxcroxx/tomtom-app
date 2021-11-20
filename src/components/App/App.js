import useMap from '../../hooks/useMap';
import Side from '../Side/Side';

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';

import { Container, Row, Col } from 'react-bootstrap';

import './App.css';

const App = () => {
  const {
    origin, location, locationSuggestions, destinations,
    setOrigin, setLocation, addDestination
  } = useMap()

  const side = {
    data: {origin, location, locationSuggestions, destinations},
    methods: {setOrigin, setLocation, addDestination}
  }

  /*{<div className="app">
      <div id="mapElement" className="map"></div>
      <Side side={side}/>
    </div>}*/

  return (
    <Container fluid>
      <Row>
        <Col id="mapElement"></Col>

        <Col md="4">
          <Side side={side}/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
