import './login.css';
import React, {useState} from 'react';
import RoomIcon from '@mui/icons-material/Room';
import {useRef} from 'react';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';

const Register = ({setShowLogin, myStorage, setCurrentUsername}) => {
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        user
      );
      // stochez local userul
      myStorage.setItem('username', res.data.username);
      setCurrentUsername(res.data.username);
      setShowLogin(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <div className='loginContainer'>
      <div className='loginLogo'>
        <RoomIcon className='logoIcon' />
        <span>Login to MAPPIN</span>
      </div>
      <form className='formLogin' onSubmit={handleSubmit}>
        <input type='text' autoFocus placeholder='user name' ref={nameRef} />
        <input type='password' placeholder='passsword' ref={passwordRef} />
        <button className='loginButton' type='submit'>
          Login
        </button>
        {error && <span className='failure'>Something went wrong...</span>}
      </form>
      <CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Register;
