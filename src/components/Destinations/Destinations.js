import './destinations.css';

export default function Destinations({destinations}) {

  return(
    <>{
      destinations.length > 0 && <div className="destinations-list">
        <p>Destinations</p>
        <ul>{
          destinations.length > 0 && destinations.map(destination =>
            <li key={`${destination.id}`}>
              {destination.poi.name} <i>({destination.address.municipality})</i>
            </li>
          )
        }</ul>
      </div>
    }</>
  )
}
