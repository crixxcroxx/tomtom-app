import { Container } from 'react-bootstrap';

import useStore from "../../zustand/store";

import './origin.css';

export default function Origin() {
  const { origin, suggestions } = useStore(state => state)

  return (
    <Container className="origin">
      { suggestions.length === 0 &&
        <i>Search or Click on the map to select location</i>
      }
      { suggestions.length > 0 && Object.keys(origin).length === 0 &&
        <i>Select origin</i>
      }

      { Object.keys(origin).length !== 0 &&
        <>
          <h3>Origin</h3>
          <p>{origin.poi.name}</p>
          <i>{origin.address.freeformAddress}</i>
        </>
      }
    </Container>
  )
}
