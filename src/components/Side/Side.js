import Origin from '../Origin/Origin';
import Locations from '../Locations/Locations';
import Destinations from '../Destinations/Destinations';

import './side.css';

export default function Side({side}) {
  const {origin, location, locationSuggestions, destinations} = side.data
  const {setOrigin, setLocation, setDestinations} = side.methods
  const locations = {
    data: {origin, location, locationSuggestions, destinations},
    methods: {setOrigin, setLocation, setDestinations}
  }

  return (
    <div className="side">
      <Origin origin={{org: origin, locS: locationSuggestions}} />

      { locationSuggestions.length > 0 &&
      <div className="side-tabs-container">
        <ul className="nav nav-tabs" id="" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="locations-tab" data-bs-toggle="tab" data-bs-target="#locations" type="button" role="tab" aria-controls="locations" aria-selected="true">Locations</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="destinations-tab" data-bs-toggle="tab" data-bs-target="#destinations" type="button" role="tab" aria-controls="destinations" aria-selected="false">Destinations</button>
          </li>
        </ul>

        <div className="tab-content" id="">
          <div className="tab-pane fade show active locations-tab" id="locations" role="tabpanel" aria-labelledby="locations-tab">
            <Locations locations={locations} />
          </div>
          <div className="tab-pane fade" id="destinations" role="tabpanel" aria-labelledby="destinations-tab">
            <Destinations destinations={destinations} />
          </div>
        </div>
      </div>
      }

    </div>
  )
}
