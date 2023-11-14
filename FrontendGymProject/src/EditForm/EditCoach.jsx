import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import activityData from '../data/ActivityData';
import { link } from '../Connection/link.js'

const EditCoach = ({ isOpen, closeModal, coachData, onSave }) => {
  const [editedCoach, setEditedCoach] = useState({ ...coachData, activity: coachData.activity.id });
  const [imagePreview, setImagePreview] = useState(coachData.person.picture || null);

  const [activityOptions, setActivityOptions] = useState([]);

  const fetchActData = async () => {
    try 
    {
      const response = await fetch(`${link}/account/activity/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resData = await response.json();
      setActivityOptions(resData.data);
      console.log("Fetched Data:", resData.data);

    } 
    catch (error) 
    {
      console.error('Error fetching activity data:', error);
    }
  };

  useEffect(() => {
    fetchActData();
  }, []); 
  

  useEffect(() => {
    const formatDateToInput = (dateString) => {
      if (dateString) {
        const [year, month, day] = dateString.split('-');
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');
        return `${formattedDay}/${formattedMonth}/${year}`;
      }
      return '';
    };

    setEditedCoach((prevEditedCoach) => ({
      ...prevEditedCoach,
      birthday: formatDateToInput(coachData.person.birthdate),
    }));
  }, [coachData.person.birthdate]);

  const formatDateToDisplay = (dateString) => {
    if (dateString) {
      const [day, month, year] = dateString.split('/');
      const formattedDay = day.padStart(2, '0');
      const formattedMonth = month.padStart(2, '0');
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
    return '';
  };

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
  
    if (type === 'file') {
      const imageFile = event.target.files[0];
      setEditedCoach((prevEditedCoach) => ({
        ...prevEditedCoach,
        person: {
          ...prevEditedCoach.person,
          picture: imageFile,
        },
      }));
  
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setEditedCoach((prevEditedCoach) => ({
        ...prevEditedCoach,
        person: {
          ...prevEditedCoach.person,
          [name]: value,
        },
        activity: name === 'activity' ? value : prevEditedCoach.activity,
      }));
    }
  };
  

  const handleSave = () => {
    const formattedBirthday = formatDateToDisplay(editedCoach.birthday);
    const editedCoachWithFormattedDate = {
      ...editedCoach,
      person: {
        ...editedCoach.person,
        birthdate: formattedBirthday,
      },
      activity: activityData.find((activity) => activity.id === editedCoach.activity), 
    };

    onSave(editedCoachWithFormattedDate);
    closeModal();
  };


  return (
    <Modal
      title={<div className='text-center'>Edit Coach</div>}
      visible={isOpen}
      onCancel={closeModal}
      footer={[
        <Button key='cancel' onClick={closeModal} className='mr-2'>
          Cancel
        </Button>,
        <Button key='save' type='primary' onClick={handleSave} className='bg-blue-500 hover:bg-blue-700 text-white'>
          Save
        </Button>,
      ]}
    >
      <form onSubmit={handleSave}>
        <div className='mb-4'>
          <label className='cursor-pointer rounded-full w-24 h-24 overflow-hidden hover:bg-gray-200 hover:opacity-80'>
            {imagePreview && (
              <div className='relative'>
                <div className='flex items-center justify-center h-full'>
                  <div className='rounded-full overflow-hidden w-24 h-24'>
                    <img
                      src={imagePreview}
                      alt='Coach Preview'
                      className='w-full h-full object-cover object-center'
                    />
                  </div>
                </div>
                <div className='text-center mt-1 text-gray-600 hover:text-gray-800 text-sm underline'>
                  Click to change Image
                </div>
              </div>
            )}
            {!imagePreview && (
              <div className='text-center mt-1 text-gray-600 hover:text-gray-800 text-sm underline'>
                Click to change Image
              </div>
            )}
            <input type='file' name='image' accept='image/*' onChange={handleInputChange} className='hidden' />
          </label>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='mb-4'>
            <label className='font-semibold'>Name:</label>
            <input
              type='text'
              name='name'
              value={editedCoach.person.name}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>
          <div className='mb-4'>
            <label className='font-semibold'>Email:</label>
            <input
              type='email'
              name='email'
              value={editedCoach.person.email}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>
          <div className='mb-4'>
            <label className='font-semibold'>Phone Number:</label>
            <input
              type='text'
              name='number'
              value={editedCoach.person.number}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='font-semibold'>Gender:</label>
            <select
              name='gender'
              value={editedCoach.person.gender}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            >
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='font-semibold'>Birthday:</label>
            <input
              type='date'
              name='birthdate'
              value={editedCoach.person.birthdate}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='font-semibold'>CIN:</label>
            <input
              type='text'
              name='cin'
              value={editedCoach.person.cin}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='font-semibold'>Address:</label>
            <input
              type='text'
              name='address'
              value={editedCoach.person.address}
              onChange={handleInputChange}
              className='border border-gray-300 rounded w-full p-2'
            />
          </div>
          <div className='mb-4'>
            <label className='font-semibold'>Activity:</label>
            <select
              name='activity'
              onChange={handleInputChange}
              value={editedCoach.activity}
              className='border border-gray-300 rounded w-full p-2'
              required
            >
             <option value=""> Select an activity </option>
  {activityOptions.map((activity) => (
    <option key={activity.id} value={activity.id}>
      {activity.name}
    </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditCoach;
