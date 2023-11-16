import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import img1 from '../assets/img1.jpg'; // Import the image

function NewPass() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNewPassSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== confirmPassword) {
        console.error('Passwords do not match.');
        return;
      }

      const newPasswordData = {
        newPassword: password,
      };

      // Replace 'your-api-url.com' with your actual API endpoint for changing the password
      const response = await fetch('https://your-api-url.com/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPasswordData),
      });

      if (response.ok) {
        console.log('Password changed successfully.');
      } else {
        console.error('Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <section
      className='flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${img1})`, // Use the imported image directly
      }}
    >
      <div
        className='w-96 flex border border-gray-300 rounded-md bg-opacity-20 h-3/5 justify-center items-center text-center'
        style={{
          backdropFilter: 'blur(5px)', // Apply backdrop filter blur
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '3em',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        <div>
          <h2 className='text-black font-bold text-2xl mb-6'>Create New Password</h2>
          <form className='flex flex-col items-center' onSubmit={handleNewPassSubmit}>
            <div className='relative mb-4'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={handlePasswordChange}
                placeholder='Enter your new password'
                className='border rounded-full pl-10 py-2 w-72 outline-none'
              />
             <FontAwesomeIcon
  icon={showPassword ? faEye : faEyeSlash}
  className='absolute top-1/2 transform -translate-y-1/2 right-5 text-black cursor-pointer'
  onClick={togglePasswordVisibility}
/>

              <FontAwesomeIcon icon={faLock} className='absolute top-1/2 transform -translate-y-1/2 left-3 text-black' />
            </div>
            <div className='relative mb-4'>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder='Confirm your new password'
                className='border rounded-full pl-10 py-2 w-72 outline-none'
              />
              <FontAwesomeIcon icon={faLock} className='absolute top-1/2 transform -translate-y-1/2 left-3 text-black' />
            </div>
            <button
              type='submit'
              className='bg-red-500 text-white border-none rounded-full py-2 w-64 hover:bg-red-600' //px-4
            >
              Change password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewPass;
