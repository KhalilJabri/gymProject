import React, { useState, useEffect } from 'react';
import axios from 'axios';
import avatar from '../data/avatar.png';
import { FaTimes } from 'react-icons/fa';
import { link } from '../Connection/link.js'

const defaultImageSrc = avatar;

const AddCoaches = () => {
  const [coachData, setCoachData] = useState({
    picture: null,
    name: '',
    number: '',
    gender: 'male',
    birthdate: '',
    cin: '',
    address: '',
    email: '',
    activity: '',
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get(`${link}/account/activity/`) 
      .then((response) => {
        setActivities(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching activities:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (files.length > 0) {
        setCoachData({
          ...coachData,
          [name]: files[0],
        });
      }
    } else {
      setCoachData({
        ...coachData,
        [name]: value,
      });
    }
  };

  const handleClearImage = () => {
    setCoachData({ ...coachData, picture: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in coachData) {
      formData.append(key, coachData[key]);
    }

    axios.post(`${link}/account/coach/`, formData) 
      .then((response) => {
        console.log('Coach added:', response.data);
        setCoachData({
          picture: null,
          name: '',
          number: '',
          gender: 'male',
          birthdate: '',
          cin: '',
          address: '',
          email: '',
          activity: '',
        });
      })
      .catch((error) => {
        console.error('Error adding coach:', error);
      });
  };

  

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Add Coach</h2>
      <div className="shadow-xs bg-light-gray rounded-2xl mx-8 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="cursor-pointer rounded-full w-24 h-24 overflow-hidden hover:bg-gray-200 hover:opacity-80">
              {coachData.image ? (
                <div className="relative">
                  <div className="flex items-center justify-center h-full">
                    <div className="rounded-full overflow-hidden w-24 h-24">
                      <img
                        src={URL.createObjectURL(coachData.picture)}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleClearImage}
                      className="absolute top-1 right-0 text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full overflow-hidden w-24 h-24">
                    <img
                      src={defaultImageSrc}
                      alt="Default"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <button
                    onClick={() => document.getElementById('imageInput').click()}
                    className="mt-1 text-gray-600 hover:text-gray-800 text-sm underline"
                  >
                    Click to Add Image
                  </button>
                </div>
              )}
              <input
                type="file"
                id="imageInput"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={coachData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={coachData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={coachData.number}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter Phone Number"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="font-semibold">Gender:</label>
            <select
              name="gender"
              value={coachData.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
          <label className="font-semibold mb-2">Birthday:</label>
         <input
  type="date"
  name="birthday"
  value={coachData.birthdate}
  onChange={handleChange}
  className="border border-gray-300 rounded w-full p-2"
  required
/>
</div>



          <div className="mb-4">
            <label className="font-semibold">CIN:</label>
            <input
              type="text"
              name="cin"
              value={coachData.cin}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              required
              placeholder="Enter CIN"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              value={coachData.address}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter Address"
            />
          </div>
          <div className="mb-4">
      <label className="font-semibold">Activity:</label>
      <select
        name="activity"
        value={coachData.activity}
        onChange={handleChange}
        className="border border-gray-300 rounded w-full p-2"
        required
      >
       <option value="">Select Activity</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.name}>
                  {activity.name}
                </option>
              ))}
            </select>
    </div>
    </div>
          
      
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Coach
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCoaches;
