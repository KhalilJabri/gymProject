import React, { useState } from 'react';
import avatar from '../data/avatar.png'
import { FaTimes } from 'react-icons/fa';
import { link } from '../Connection/link.js'
import axios from 'axios';



const defaultImageSrc = avatar;


const AddEmployees = () => {


 
  const [employeeData, setEmployeeData] = useState({
    image: null,
    name: '',
    phoneNumber: '',
    permissionAccess: true,
    isAdmin: false,
    gender: 'male',
    birthday: '',
    cin: '',
    address: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      if (files.length > 0) {
        setEmployeeData({
          ...employeeData,
          [name]: files[0],
        });
      }
    } else {
      setEmployeeData({
        ...employeeData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleClearImage = () => {
    setEmployeeData({ ...employeeData, image: null });
  };

 
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in employeeData) {
      formData.append(key, employeeData[key]);
    }

    axios.post(`${link}/account/register/`, formData) 
      .then((response) => {
        console.log('Employee added:', response.data);
        setEmployeeData({
          image: null,
          name: '',
          phoneNumber: '',
          permissionAccess: true,
          isAdmin: false,
          gender: 'male',
          birthday: '',
          cin: '',
          address: '',
          email: '',
        });
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
      });
  };

  


  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Add Employee</h2>
    <div className="shadow-xs bg-light-gray rounded-2xl mx-8 p-4">
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
  <label className="cursor-pointer rounded-full w-24 h-24 overflow-hidden hover:bg-gray-200 hover:opacity-80">
    {employeeData.image ? (
      <div className="relative">
        <div className="flex items-center justify-center h-full">
          <div className="rounded-full overflow-hidden w-24 h-24">
            <img
              src={URL.createObjectURL(employeeData.image)}
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
                value={employeeData.name}
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
                value={employeeData.email}
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
                value={employeeData.phoneNumber}
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
                value={employeeData.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="font-semibold mb-2 ">Birthday:</label>
              <input
                type="date"
                name="birthday"
                value={employeeData.birthday}
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
                value={employeeData.cin}
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
                value={employeeData.address}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                placeholder="Enter Address"
              />
            </div>
          </div>
          <div className="mb-6 mt-2 flex items-center">
  <label className="font-semibold mr-2 ">Permission Access :</label>
  <input
    type="checkbox"
    name="permissionAccess"
    checked={employeeData.permissionAccess}
    onChange={handleChange}
  />
<label className="font-semibold mr-2 ml-4 ">Is Admin :</label>
  <input
    type="checkbox"
    name="isAdmin"
    checked={employeeData.isAdmin}
    onChange={handleChange}
  />
</div>
        
        <div class="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AddEmployees;
