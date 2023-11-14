import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import ProfileData from '../data/Profile.js';
import { Header } from '../components';
import EditProfile from '../EditForm/EditProfile';
import EditPassword from '../EditForm/EditPassword';

const Profile = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const userData = ProfileData[0];

  const openEditModal = () => {
    setIsEditModalVisible(true);
  };

  const openPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  return (
    <div className='m-2 md:m-8 mt-10 p-3 md:p-12 bg-white rounded-3xl'>
      <Header category='Page' title='Profile' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='border border-gray-300 bg-gray-100 p-6 rounded-lg'>
          <div className='flex flex-col items-center justify-center'>
            <Avatar src={userData.image} size={100} className='border-4 border-white' />
            <p className='mt-4 text-xl font-semibold text-gray-800'>{userData.name}</p>
            <div className='mt-6'>
              <Button
                type='primary'
                onClick={openEditModal}
                className='w-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white'
              >
                Edit Profile
              </Button>
              <Button
                type='link'
                onClick={openPasswordModal}
                className='block mt-4 text-black underline font-sans font-bold text-sm'
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>

        <div className='border border-gray-300 bg-white p-6 rounded-lg'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Email:</p>
              <p className='text-gray-700'>{userData.email}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Phone Number:</p>
              <p className='text-gray-700'>{userData.phoneNumber}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Birthday:</p>
              <p className='text-gray-700'>{userData.birthday}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Gender:</p>
              <p className='text-gray-700'>{userData.gender}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Address:</p>
              <p className='text-gray-700'>{userData.address}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>CIN:</p>
              <p className='text-gray-700'>{userData.cin}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Created:</p>
              <p className='text-gray-700'>{userData.created}</p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalVisible && (
        <EditProfile
          isOpen={isEditModalVisible}
          closeModal={() => setIsEditModalVisible(false)}
          userData={userData}
          onSave={(editedProfile) => {
            setIsEditModalVisible(false);
          }}
        />
      )}

      {isPasswordModalVisible && (
        <EditPassword
          isOpen={isPasswordModalVisible}
          closeModal={() => setIsPasswordModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Profile;
