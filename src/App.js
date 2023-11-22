import React, {useState, useEffect} from 'react';
import './app.css';
import Map, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import {format} from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  // fac localstorage-ul meu
  const myStorage = window.localStorage;

  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem('username')
  );

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46.040182,
    longitude: 10.071727,
    zoom: 4,
  });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get('/pins');
        // console.log(allPins);
        setPins(allPins.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  // handler pentru click pe Marker
  const handleMarkerClick = (id, lat, long) => {
    // console.log('Id selectat:', id);
    setCurrentPlaceId(id);
    setViewState({...viewState, latitude: lat, longitude: long});
  };

  const handleAddClick = (e) => {
    const lat = e.lngLat.lat;
    const long = e.lngLat.lng;
    setNewPlace({username: currentUsername, lat, long});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/pins', {
        username: currentUsername,
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long,
      });
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setCurrentUsername('');
    myStorage.removeItem('username');
  };

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          latitude: 46.040182,
          longitude: 10.071727,
          zoom: 4,
        }}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        style={{width: '100%', height: '100%'}}
        onDblClick={handleAddClick}
        transitionDuration='200'
      >
        {pins.map((p) => {
          return (
            <>
              <Marker
                key={'marker_' + p._id}
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-3.5 * viewState.zoom}
                offsetTop={-7 * viewState.zoom}
              >
                <RoomIcon
                  key={'icon_' + p._id}
                  style={{
                    fontSize: viewState.zoom * 5,
                    color:
                      currentUsername === p.username ? 'tomato' : 'slateblue',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  key={p._id}
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor='left'
                >
                  <div className='card'>
                    <label>Place</label>
                    <h4 className='place'>{p.title}</h4>
                    <label>Review</label>
                    <p className='desc'>{p.desc}</p>
                    <label>Rating</label>
                    <div className='stars'>
                      <span>({p.rating})</span>
                      {p.rating > 0 &&
                        [...Array(p.rating)].map((e, i) => {
                          return <StarIcon className='star' key={i} />;
                        })}
                    </div>
                    <label>Information</label>
                    <span className='username'>
                      Created by <b>{p.username}</b>
                    </span>
                    <span className='date'>{format(p.updatedAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          );
        })}
        {newPlace && (
          <>
            <Marker
              key={newPlace.lat}
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewState.zoom}
              offsetTop={-7 * viewState.zoom}
            >
              <RoomIcon
                key={'newPlace_' + newPlace.lat}
                style={{
                  fontSize: 7 * viewState.zoom,
                  color: 'tomato',
                  cursor: 'pointer',
                }}
              />
            </Marker>
            <Popup
              key={'pop' + newPlace.lat}
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor='left'
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    type='text'
                    placeholder='Enter a title'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Review</label>
                  <textarea
                    rows={6}
                    cols={20}
                    placeholder='Say us someting about this place'
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select
                    placeholder='Select a rating'
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                  <button className='submitButton' type='submit'>
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (
          <div className='buttons'>
            <button className='button logoutBtn' onClick={handleLogout}>
              Log out {currentUsername}
            </button>
          </div>
        ) : (
          <div className='buttons'>
            <button
              className='button loginBtn'
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className='button registerBtn'
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUsername={setCurrentUsername}
          />
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
      </Map>
    </div>
  );
}
export default App;
