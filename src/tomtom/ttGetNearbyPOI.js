const base_url = "https://api.tomtom.com/search/2"
const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"

const getNearbyPOI = async (data, setSuggestions) => {
  let res = await fetch(`${base_url}/nearbySearch/.json?lat=${data.lat}&lon=${data.lng}&radius=1000&key=${tomtom_key}`)
  let resData = await res.json()

  setSuggestions(resData.results)
}

export default getNearbyPOI;