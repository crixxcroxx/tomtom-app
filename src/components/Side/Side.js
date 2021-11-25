import Origin from '../Origin/Origin';
import Locations from '../Locations/Locations';
import Destinations from '../Destinations/Destinations';

import { Stack, Tabs, Tab } from 'react-bootstrap';

import './side.css';

export default function Side({side}) {
  const {origin, location, locationSuggestions, destinations, matrixData} = side.data
  const {setOrigin, setLocation, setDestinations} = side.methods
  const locations = {
    data: {origin, location, destinations, locationSuggestions},
    methods: {setOrigin, setLocation, setDestinations}
  }
  const dests = {
    data: {destinations, matrixData},
    methods: {setDestinations}
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
          <Destinations dests={dests} />
        </Tab>
      </Tabs>
      }

    </Stack>
  )
}
