import Origin from '../Origin/Origin';
import Locations from '../Locations/Locations';
import Destinations from '../Destinations/Destinations';

import { Stack, Tabs, Tab } from 'react-bootstrap';

import './side.css';

export default function Side({side}) {
  const {origin, location, locationSuggestions, destinations} = side.data
  const {setOrigin, setLocation, addDestination} = side.methods
  const locations = {
    data: {origin, location, locationSuggestions, destinations},
    methods: {setOrigin, setLocation, addDestination}
  }

  return (
    <Stack gap={2} className="side">
      <Origin origin={{org: origin, locS: locationSuggestions}} />

      { locationSuggestions.length > 0 &&
      <Tabs defaultActiveKey="locations" transition={true}>
        <Tab eventKey="locations" title="Locations">
          <Locations locations={locations} />
        </Tab>
        <Tab eventKey="destinations" title="Destinations">
          <Destinations destinations={destinations} />
        </Tab>
      </Tabs>
      }

    </Stack>
  )
}
