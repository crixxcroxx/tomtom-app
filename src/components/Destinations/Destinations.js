import './destinations.css';

export default function Destinations({destinations}) {

  return(
    <div className="destinations-list">
      <ul>{
        destinations.length > 0 && destinations.map(destination =>
          <li key={`${destination.id}`}>
            {destination.poi.name} <i>({destination.address.municipality})</i>
          </li>
        )
      }</ul>
    </div>
  )
}
