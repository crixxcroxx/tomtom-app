import { useEffect, useState } from 'react';
import { Accordion, Alert, Button } from 'react-bootstrap';

import useStore from "../../zustand/store";

import './destinations.css';

export default function Destinations() {
  const [orderedDestinations, setOrderedDestinations] = useState([])

  const {
    matrixData,
    destinations,
    setDestinations
  } = useStore(state => state)

  const updateOrder = () => {
    let temp = []
    matrixData.map(ele => temp.push(destinations[ele.idx]))

    setOrderedDestinations(temp)
  }

  const handleDelete = (idx) => {
    let temp = orderedDestinations
    temp.splice(idx, 1)

    setDestinations(temp)
  }

  useEffect(() => {
    updateOrder()
  }, [matrixData])

  return(
    <div className="destinations">
      <Accordion className="destinations-list">{
        destinations.length > 0 && orderedDestinations.map((destination, idx) =>
          <Accordion.Item eventKey={idx} key={`${destination.id}`}>

            <Accordion.Header>
              {idx + 1} - {destination.poi.name}
            </Accordion.Header>

            <Accordion.Body>
              <p>{destination.address.freeformAddress}</p>
              <Alert variant="info">
                <p>Distance from origin: {matrixData[idx].distance}m</p>
                <hr />
                <p>Estimated driving time: {Math.round((100 * (matrixData[idx].drivingtime / 60)) / 100)}mins</p>
              </Alert>

              <Button
                variant="outline-danger"
                className="btn"
                onClick={() => handleDelete(idx)}
              >Delete</Button>
            </Accordion.Body>

          </Accordion.Item>
        )
      }</Accordion>
    </div>
  )
}
