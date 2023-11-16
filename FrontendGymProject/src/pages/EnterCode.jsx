import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import img1 from '../assets/img1.jpg'; // Import the image
import { link } from '../Connection/link';

function EnterCode() {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleCodeSubmit = async (event) => {
    event.preventDefault();

    try {
      const codeData = {
        verificationCode,
      };

      const response = await fetch(`${link}/account/verifyOtp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(codeData),
      });

      if (response.ok) {
        console.log('Verification code is valid.');
      } else {
        console.error('Verification code is invalid.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
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
          textAlign: 'center',
        }}
      >
        <div>
          <h2 className='text-black font-bold text-2xl mb-6'>Enter Verification Code</h2>
          <form onSubmit={handleCodeSubmit} className='flex flex-col items-center'>
            <div className='relative mb-4'>
              <input
                type='text'
                id='verificationCode'
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder='Enter verification code'
                className='border rounded-full pl-10 py-2 w-64 outline-none'
              />
              <FontAwesomeIcon
                icon={faKey}
                className='absolute top-1/2 transform -translate-y-1/2 left-4 text-black'
              />
            </div>
            <button
              type='submit'
              className='bg-red-500 text-white border-none rounded-full py-2 w-48 hover:bg-red-600' //px-4
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EnterCode;
