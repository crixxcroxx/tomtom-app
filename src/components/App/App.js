import useMap from '../../hooks/useMap';
import Side from '../Side/Side';

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';

import { Container, Row, Col } from 'react-bootstrap';

import './App.css';

const App = () => {
  const {
    origin, locationSuggestions, destinations, matrixData,
    setOrigin, setDestinations
  } = useMap()

  const side = {
    data: {origin, locationSuggestions, destinations, matrixData},
    methods: {setOrigin, setDestinations}
  }

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
