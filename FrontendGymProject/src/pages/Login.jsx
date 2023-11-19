import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {link} from '../Connection/link'
import img1 from '../assets/img1.jpg'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSuccess = async (token) => {
    localStorage.setItem('authToken', token);
    console.log('Connexion réussie.');
    navigate('/DataVisualization'); // Redirect to '/DataVisualization' upon successful login
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = {
        email,
        password,
      };
      const response = await fetch(
        `${link}/account/login/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        handleLoginSuccess(token);
      } else {
        console.error('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <section
      className='flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${img1})`, 
      }}
    >
      <div
        className='w-96 flex border border-gray-300 rounded-md bg-opacity-20 h-3/5 justify-center items-center text-center'
        style={{
          backdropFilter: 'blur(5px)', 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className='p-4'>
          <h2 className='text-black font-bold text-2xl'>Welcome!</h2>
          <span className='text-white text-sm block'>Login to continue</span>
          <form id='custom-form' className='flex flex-col' onSubmit={handleSubmit}>
            <div className='relative my-2'>
              <input type='email' id='email' value={email} onChange={handleEmailChange} placeholder='Email'
                className='border rounded-full pl-10 py-2 w-64 outline-none' />
              <FontAwesomeIcon icon={faUser} className='absolute top-1/2 transform -translate-y-1/2 left-4 text-black' />
            </div>
            <div className='relative my-2'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={handlePasswordChange}
                placeholder='Password'
                className='border rounded-full pl-10 py-2 w-64 outline-none'
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className='absolute top-1/2 transform -translate-y-1/2 right-2 text-black cursor-pointer'
                onClick={togglePasswordVisibility}
              />
              <FontAwesomeIcon icon={faLock} className='absolute top-1/2 transform -translate-y-1/2 left-4 text-black' />
            </div>
            <a href='/forgot' className='text-white text-sm text-left ml-2 mb-1'>Forgot Password?</a>
            <button type='submit' className='bg-red-500 text-white border-none rounded-full py-2 px-4 hover:bg-red-600'>
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;