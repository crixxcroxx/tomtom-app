import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';

import './destinations.css';

export default function Destinations(props) {
  const {dests: destinations, matrixData} = props.destinations
  const [orderedDestinations, setOrderedDestinations] = useState([])


  const updateOrder = () => {
    const temp = []
    matrixData.map(ele => temp.push(destinations[ele.idx]))
    setOrderedDestinations(temp)
  }

  console.log(matrixData)

  useEffect(() => {
    updateOrder()
  }, [matrixData])

  return(
    <div className="destinations">
      <Accordion className="destinations-list">{
        destinations.length > 0 && orderedDestinations.map((destination, idx) =>
          <Accordion.Item eventKey={idx} key={`${destination.id}`}>
            <Accordion.Header>{idx + 1} - {destination.poi.name}</Accordion.Header>
            <Accordion.Body>
              <p>{destination.address.freeformAddress}</p>
              <p>Distance from origin: {matrixData[idx].distance}m</p>
              <p>Estimated driving time: {Math.round((100 * (matrixData[idx].drivingtime / 60)) / 100)}mins</p>
            </Accordion.Body>
          </Accordion.Item>
        )
      }</Accordion>
    </div>
  )
}
