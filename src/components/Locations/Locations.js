import { useState, useEffect } from 'react';

import { Stack } from 'react-bootstrap';

import useStore from "../../zustand/store";

import './location.css';

export default function Locations() {
  const [location, setLocation] = useState({})
  const [divID, setDivID] = useState("")

  const {
    origin,
    suggestions,
    destinations,
    setOrigin,
    setDestinations
  } = useStore(state => state)

  const addDestination = (obj) => {
    obj.custom_id = destinations.length + 1

    setDestinations([obj, ...destinations])
  }

  const toggleIsActive = (clr) => {
    const child = document.getElementById(divID)
    if(child) {
      child.style.color = clr
      clr === "#0b5ed7" ? child.style.borderColor = clr : child.style.borderColor = "lightgrey"
    }
  }

  useEffect(() => {
    toggleIsActive("#0b5ed7")

    return () => { if(divID) toggleIsActive("#33383c") }
  }, [divID])

  return(
    <>{
      suggestions.length > 0 && <div className="locations">

        <Stack gap={3} className="location-suggestions">{
          suggestions.map(loc => (
            <div
              className="location"
              key={`${loc.id}`}
              id={`${loc.info}`}
              onClick={e => {
                setLocation(loc)
                setDivID(`${loc.info}`)
              }}
            >
              <h3>{loc.poi.name}</h3>
              <i>{loc.poi.categories[0]}</i>
              <p>{loc.address.freeformAddress}</p>
            </div>
          ))
        }</Stack>
        { Object.keys(origin).length > 0 &&
          <button
            className="btn btn-primary"
            onClick={e => addDestination(location)}
          >Add</button>
        }
        { Object.keys(origin).length === 0 &&
          <button
            className="btn btn-primary"
            onClick={e => setOrigin(location)}
          >Set Origin</button>
        }
      </div>
    }</>
  )
}
