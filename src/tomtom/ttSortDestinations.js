import { services } from '@tomtom-international/web-sdk-services';

import formatPoints from "../helpers/formatPoints";

const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"

const ttSortDestinations = (origin, destinations, setMatrixData) => {
  // create formatted points array
  const pointsForDestinations = destinations.map((loc) => {
    return formatPoints(loc.position)
  })

  const options = {
    key: tomtom_key,
    destinations: pointsForDestinations,
    origins: [formatPoints(origin.position)],
  }

  const matrix_data = []

  return new Promise((resolve, reject) => {
    // call tomtom services for matrix routing
    services
      .matrixRouting(options)
      .then((matrixAPIResults) => {
        const results = matrixAPIResults.matrix[0]
        const resultsArray = results.map((result, index) => {
          return {
            location: {
              lng: destinations[index].position.lon,
              lat: destinations[index].position.lat
            },
            drivingtime: result.response.routeSummary.travelTimeInSeconds,
            distance: result.response.routeSummary.lengthInMeters,
            idx: index
          }
        })

        // sort routes(time)
        resultsArray.sort((a, b) => {
          return a.drivingtime - b.drivingtime
        })

        const sortedLocations = resultsArray.map((result) => {
          matrix_data.push(result)
          return result.location
        })

        setMatrixData(matrix_data)

        resolve(sortedLocations)
      })
    })
}

export default ttSortDestinations;