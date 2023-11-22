import './register.css';
import React, {useState} from 'react';
import RoomIcon from '@mui/icons-material/Room';
import {useRef} from 'react';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';

const Register = ({setShowRegister}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);

    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        newUser
      );
      setSuccess(true);
      setError(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <div className='registerContainer'>
      <div className='registerLogo'>
        <RoomIcon className='logoIcon' />
        <span>Register to MAPPIN</span>
      </div>
      <form onSubmit={handleSubmit} className='formRegister'>
        <input type='text' autoFocus placeholder='user name' ref={nameRef} />
        <input type='email' placeholder='email' ref={emailRef} />
        <input type='password' placeholder='passsword' ref={passwordRef} />
        <button className='registerButton' type='submit'>
          Register
        </button>
        {success && (
          <span className='success'>Succesfull! You can login now!</span>
        )}
        {error && <span className='failure'>Something went wrong...</span>}
      </form>
      <CancelIcon
        className='registerCancel'
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
