import Origin from '../Origin/Origin';
import Locations from '../Locations/Locations';
import Destinations from '../Destinations/Destinations';

import { Stack, Tabs, Tab } from 'react-bootstrap';

import useStore from "../../zustand/store";

import './side.css';

export default function Side() {
  const suggestions= useStore(state => state.suggestions)

  return (
    <Stack gap={2} className="side">
      <Origin />

      {suggestions &&
        <Tabs defaultActiveKey="locations" transition={true}>
          <Tab eventKey="locations" title="Locations">
            <Locations />
          </Tab>

          <Tab eventKey="destinations" title="Destinations">
            <Destinations />
          </Tab>
        </Tabs>
      }

    </Stack>
  )
}
