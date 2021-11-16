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
      <Origin origin={origin} />
      <Locations locations={locations} />
      <Destinations destinations={destinations} />
    </div>
  )
}
