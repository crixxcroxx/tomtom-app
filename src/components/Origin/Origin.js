import './origin.css';

export default function Origin({origin}) {

  return (
    <div>
      { Object.keys(origin).length === 0 &&
        <i>Search or Click on the map to select location</i>
      }
      { Object.keys(origin).length > 0 &&
        <>
          <div className="origin">
            <h3>Origin</h3>
            <p>{origin.poi.name}</p>
            <i>{origin.address.freeformAddress}</i>
          </div>
        </>
      }
    </div>
  )
}
