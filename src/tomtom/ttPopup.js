import tt from '@tomtom-international/web-sdk-maps';

const ttPopup = (obj, caller) => {
  let element = `<p>${obj.poi.name}, ${obj.address.municipality}</p>`

  const popup = new tt.Popup({
    offset: {
      bottom: [0, -30]
    }
  }).setHTML(element)

  return popup
}

export default ttPopup;