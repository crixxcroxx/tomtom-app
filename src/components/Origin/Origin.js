import { Container } from 'react-bootstrap';

import './origin.css';

export default function Origin(props) {
  const {org: origin, locS: locationSuggestions} = props.origin

  return (
    <Container className="origin">
      { locationSuggestions.length === 0 &&
        <i>Search or Click on the map to select location</i>
      }
      { locationSuggestions.length > 0 && Object.keys(origin).length === 0 &&
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
