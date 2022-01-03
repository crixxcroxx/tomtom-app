import useMap from '../../hooks/useMap';
import Side from '../Side/Side';

import '@tomtom-international/web-sdk-maps/dist/maps.css'
import '@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css';

import { Container, Row, Col } from 'react-bootstrap';

import './App.css';

const App = () => {
  useMap()

  return (
    <Container fluid>
      <Row>
        <Col id="mapElement"></Col>

        <Col md="4">
          <Side />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
