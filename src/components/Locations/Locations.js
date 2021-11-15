import './location.css';

export default function Locations({locations}) {
  const {origin, location, locationSuggestions, destinations} = locations.data
  const {setOrigin, setLocation, setDestinations} = locations.methods

  return(
    <div className="locations">
        <p><i>Choose any locations below to add to destination</i></p>
        <div>{
          locationSuggestions.length > 0 && locationSuggestions.map(loc => (
            <div
              className="location-suggestions"
              key={`${loc.latitude},${loc.longitude}`}
              onClick={e => setLocation(loc)}
            >
              <h3>{loc.name}</h3>
              <p>{loc.label}</p>
            </div>
          ))

        }</div>
        { Object.keys(origin).length > 0 &&
          <button onClick={e => setDestinations([...destinations, location])}>Add</button>
        }
        { Object.keys(origin).length === 0 &&
          <button onClick={e => setOrigin(location)}>Set Origin</button>
        }
      </div>
  )
}
