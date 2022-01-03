import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';

const tomtom_key = "AzOyG5FQGdrRudBEBua0GpMXt5xNWGrl"

const ttSearchBox = new SearchBox(services, {
  idleTimePress: 200,
  minNumberOfCharacters: 0,
  searchOptions: {
    key: tomtom_key,
    language: 'en-GB',
    limit: 5
  },
  autocompleteOptions: {
    key: tomtom_key,
    language: 'en-GB'
  },
  noResultsMessage: 'No results found.'
})

export default ttSearchBox