import { useState, useEffect } from 'react';
import './location.css';

export default function Locations({locations}) {
  const {origin, location, locationSuggestions, destinations} = locations.data
  const {setOrigin, setLocation, setDestinations} = locations.methods
  const [divID, setDivID] = useState("")

  useEffect(() => {
    toggleIsActive("#0b5ed7")

    return () => { if(divID) toggleIsActive("#33383c") }
  }, [divID])

  const toggleIsActive = (clr) => {
    const child = document.getElementById(divID)
    if(child) {
      child.style.color = clr
      clr == "#0b5ed7" ? child.style.borderColor = clr : child.style.borderColor = "lightgrey"
    }
  }

  return(
    <>{
      locationSuggestions.length > 0 && <div className="locations">

        <div className="location-suggestions">{
          locationSuggestions.map(loc => (
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
        }</div>
        { Object.keys(origin).length > 0 &&
          <button
            className="btn btn-primary"
            onClick={e => setDestinations([location, ...destinations])}
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
