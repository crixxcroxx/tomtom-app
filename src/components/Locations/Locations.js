import './location.css';

export default function Locations({locations}) {
  const {origin, location, locationSuggestions, destinations} = locations.data
  const {setOrigin, setLocation, setDestinations} = locations.methods

  return(
    <>{
      locationSuggestions.length > 0 && <div className="locations">
        {Object.keys(origin).length > 0 &&
          <p><i>Choose any locations below to add to destination</i></p>
        }
        {Object.keys(origin).length === 0 &&
          <p><i>Choose your origin location</i></p>
        }
        <div>{
          locationSuggestions.map(loc => (
            <div
              className="location-suggestions"
              key={`${loc.id}`}
              onClick={e => setLocation(loc)}
            >
              <h3>{loc.poi.name}</h3>
              <i>{loc.poi.categories[0]}</i>
              <p>{loc.address.freeformAddress}</p>
            </div>
          ))
        }</div>
        { Object.keys(origin).length > 0 &&
          <button onClick={e => setDestinations([location, ...destinations])}>Add</button>
        }
        { Object.keys(origin).length === 0 &&
          <button onClick={e => setOrigin(location)}>Set Origin</button>
        }
      </div>
    }</>
  )
}
