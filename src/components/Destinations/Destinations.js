import { Accordion } from 'react-bootstrap';

import './destinations.css';

export default function Destinations({destinations}) {

  return(
    <div className="destinations">
      <Accordion className="destinations-list">{
        destinations.length > 0 && destinations.map((destination, idx) =>
          <Accordion.Item eventKey={idx} key={`${destination.id}`}>
            <Accordion.Header>{destination.poi.name}</Accordion.Header>
            <Accordion.Body>{destination.address.freeformAddress}</Accordion.Body>
          </Accordion.Item>
        )
      }</Accordion>
    </div>
  )
}
