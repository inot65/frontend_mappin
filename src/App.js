import * as React from 'react';
import Map, {Marker} from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';

function App() {
  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      initialViewState={{
        latitude: 46,
        longitude: 10,
        zoom: 4,
      }}
      style={{width: 600, height: 400}}
      mapStyle='mapbox://styles/mapbox/streets-v9'
    >
      <Marker
        latitude={48.858093}
        longitude={2.294694}
        offsetLeft={-20}
        offsetTop={-10}
      >
        <RoomIcon />
        <div className='clasic'>Esti aici</div>
      </Marker>
    </Map>
  );
}
export default App;
