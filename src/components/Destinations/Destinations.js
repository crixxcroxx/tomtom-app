import './destinations.css';

export default function Destinations({destinations}) {

  return(
    <div className="destinations-list">
      <p>Destinations</p>
      <ul>{
        destinations.length > 0 && destinations.map(destination =>
          <li key={`${destination.latitude},${destination.longitude}`}>
            {destination.name} <i>({destination.locality})</i>
          </li>
        )
      }</ul>
    </div>
  )
}
