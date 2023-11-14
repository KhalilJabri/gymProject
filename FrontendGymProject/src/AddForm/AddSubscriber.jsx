import React, { useState, useEffect } from 'react';
import avatar from '../data/avatar.png';
import { FaTimes } from 'react-icons/fa';
import { link } from '../Connection/link.js';
import axios from 'axios';



const defaultImageSrc = avatar;

const AddSubscribers = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const [subscription, setSubscription] = useState({
    startDate: currentDate,
    numberOfSub: '',
    typeOfNumberSub: 'day',
    activity: '',
    price: '',
  });

  const [person, setPerson] = useState({
    picture: null,
    name: '',
    number: '',
    gender: 'male',
    birthdate: '',
    cin: '',
    address: '',
    email: '',
  });


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
  

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (files.length > 0) {
        setPerson({
          ...person,
          picture: files[0],
        });
      }
    } else {
      if (name === 'activity') {
        const selectedActivity = activityOptions.find((activity) => activity.id === parseInt(value));
        const activityId = selectedActivity ? selectedActivity.id : '';
        console.log('Selected Activity ID:', activityId);

        setSubscription({
          ...subscription,
          activity: activityId,
        });
      } else {
        setSubscription({
          ...subscription,
          [name]: value,
        });

     
        setPerson({
          ...person,
          [name]: value,
        });
      }
    }
  };
  
  
  

  const handleClearImage = () => {
    setPerson({ ...person, picture: null });
    document.getElementById('imageInput').value = ''; 
  };
  


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append('person[name]', person.name);
    formData.append('person[email]', person.email);
    formData.append('person[gender]', person.gender);
    formData.append('person[address]', person.address);
    formData.append('person[number]', person.number);
    formData.append('person[cin]', person.cin);
    formData.append('person[birthdate]', person.birthdate);

    if (person.picture) {
      formData.append('person[picture]', person.picture);
    } else {
      formData.append('person[picture]', defaultImageSrc);
    }

    formData.append('subscription[price]', subscription.price);
    formData.append('subscription[startDate]', subscription.startDate);
    formData.append('subscription[typeOfNumberSub]', subscription.typeOfNumberSub);
    formData.append('subscription[numberOfSub]', subscription.numberOfSub);
    formData.append('subscription[activity]', subscription.activity);

    const response = await axios.post(`${link}/account/member/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response.data);

    setPerson({
      picture: null,
      name: '',
      number: '',
      gender: 'male',
      birthdate: '',
      cin: '',
      address: '',
      email: '',
    });

    setSubscription({
      startDate: currentDate,
      numberOfSub: '',
      typeOfNumberSub: 'day',
      activity: '',
      price: '',
    });
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error status:', error.response.status);
      console.error('Error message from the server:', error.response.data);
    } else if (error.request) {
      console.error('No response received from the server:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
  }
};

  
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Add Subscriber</h2>
      <div className="shadow-xs bg-light-gray rounded-2xl mx-8 p-4">
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
       
       <label className="cursor-pointer rounded-full w-24 h-24 overflow-hidden hover:bg-gray-200 hover:opacity-80">
         {person.picture ? (
           <div className="relative">
             <div className="flex items-center justify-center h-full">
               <div className="rounded-full overflow-hidden w-24 h-24">
                 <img
                   src={URL.createObjectURL(person.picture)}
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
           name="picture"
           accept="image/*"
           onChange={handleChange}
           className="hidden"
         />
       </label>
     </div>

     
   

<div className="flex flex-wrap -mx-2 mb-6">
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold">Name:</label>
<input
 type="text"
 name="name"
 value={person.name}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Name"
 required
/>
</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold">Email:</label>
<input
 type="email"
 name="email"
 value={person.email}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Email"
 required
/>
</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Phone Number:</label>
<input
 type="number"
 name="number"
 value={person.number}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Phone Number"
/>

</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Gender:</label>
<select
 name="gender"
 value={person.gender}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 required
>
 <option value="male">Male</option>
 <option value="female">Female</option>
</select>
</div>
<div className="mb-6 px-2 w-1/2">
         <label className="font-semibold mb-2">Birthday:</label>
         <input
  type="date"
  name="birthdate"
  value={person.birthdate}
  onChange={handleChange}
  className="border border-gray-300 rounded w-full p-2"
/>

       </div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">CIN:</label>
<input
 type="number"
 name="cin"
 value={person.cin}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter CIN"
/>
</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Address:</label>
<input
 type="text"
 name="address"
 value={person.address}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Address"
/>
</div>
</div>


<h2 className="text-xl font-semibold mb-2 text-center underline">Activtiy Details</h2>
<div className="flex flex-wrap -mx-2">
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Activity:</label>
<select
 name="activity"
 value={subscription.activity}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
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
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Price:</label>
<input
 type="number"
 name="price"
 value={subscription.price}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Price"
 required
/>
</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Start Date:</label>
<input
  type="date"
  name="startDate"
  value={subscription.startDate}
  onChange={handleChange}
  className="border border-gray-300 rounded w-full p-2"
/>
</div>


<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Number of Subscription:</label>
<input
 type="number"
 name="numberOfSub"
 value={subscription.numberOfSub}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 placeholder="Enter Number of Subscription"
 required
/>
</div>
<div className="mb-6 px-2 w-1/2">
<label className="font-semibold mb-2">Subscription Number Type:</label>
<select
 name="typeOfNumberSub"
 value={subscription.typeOfNumberSub}
 onChange={handleChange}
 className="border border-gray-300 rounded w-full p-2"
 required
>
 <option value="day">Day(s)</option>
 <option value="month">Month(s)</option>
</select>
</div>
</div>


     <div className="flex justify-center">
       <button
         type="submit"
         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
       >
         Add Subscriber
       </button>
     </div>
        </form>
      </div>
    </>
  );
};

export default AddSubscribers;
