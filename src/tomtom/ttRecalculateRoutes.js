import { services } from '@tomtom-international/web-sdk-services';

import ttDrawRoute from "./ttDrawRoute";
import ttSortDestinations from "./ttSortDestinations";

const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"

const ttRecalculateRoutes = (origin, destinations, map, setMatrixData) => {
  if(destinations.length > 0) {
    // sort destinations first
    ttSortDestinations(origin, destinations, setMatrixData).then((sorted) => {
      sorted.unshift({lat: origin.position.lat, lng: origin.position.lon})

      // calculate optimized route
      services
        .calculateRoute({
          key: tomtom_key,
          locations: sorted,
        })

        // draw a path for the optimized route
        .then((routeData) => {
          const geoJson = routeData.toGeoJson()
          ttDrawRoute(geoJson, map)
        })
    })
  }
}

export default ttRecalculateRoutes;