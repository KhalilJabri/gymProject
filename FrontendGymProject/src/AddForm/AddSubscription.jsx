import React, { useState, useEffect } from 'react';
import { link } from '../Connection/link.js'

const AddSubscription = ({ memberId }) => {
  const currentDate = new Date().toISOString().split('T')[0]; 
  const [subscription, setSubscription] = useState({
    price: '',
    startDate: currentDate,
    numberOfSub: '',
    typeOfNumberSub: 'day',
    activity: '',
    member: memberId
  });
 useEffect(() => {
  console.log('Member ID passed:', memberId);
}, [memberId]);

   
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
    const { name, value } = e.target;
  
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
    }
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${link}/account/subscription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Subscription added:', responseData);
        setSubscription({
          price: '',
          startDate: '',
          numberOfSub: '',
          typeOfNumberSub: 'day',
          activity: '',
          member: memberId, 
        });
      } else {
        console.error('Error adding subscription:', response.status, response.statusText );
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };
  
  


  return (
    <>
    <h2 className="text-2xl font-bold mb-4 text-center">Add Subscription</h2>
    <div className="shadow-xs bg-light-gray rounded-2xl mx-8 p-4">
      <form onSubmit={handleSubmit}>
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
       Add Subscription
     </button>
   </div>
      </form>
    </div>
  </>
);
};


export default AddSubscription;