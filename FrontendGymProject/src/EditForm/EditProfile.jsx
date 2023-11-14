import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

const EditProfile = ({ isOpen, closeModal, userData, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({ ...userData });
  const [imagePreview, setImagePreview] = useState(userData.image || null);

  useEffect(() => {
    const formatDateToInput = (dateString) => {
      const [day, month, year] = dateString.split('/');
      const formattedDay = day.padStart(2, '0');
      const formattedMonth = month.padStart(2, '0');
      return `${year}-${formattedMonth}-${formattedDay}`;
    };

    setEditedProfile((prevEditedProfile) => ({
      ...prevEditedProfile,
      birthday: formatDateToInput(userData.birthday),
    }));
  }, [userData.birthday]);

  
  const formatDateToDisplay = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'file') {
    
      const imageFile = event.target.files[0];
      setEditedProfile((prevEditedProfile) => ({
        ...prevEditedProfile,
        image: imageFile,
      }));

      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
    
        setEditedProfile((prevEditedProfile) => ({
        ...prevEditedProfile,
        [name]: value,
      }));
    }
  };


  const handleSave = () => {

    const formattedBirthday = formatDateToDisplay(editedProfile.birthday);
    const editedProfileWithFormattedDate = {
      ...editedProfile,
      birthday: formattedBirthday,
    };


    onSave(editedProfileWithFormattedDate);
    closeModal();
  };

  return (
    <Modal
      title={<div className="text-center">Edit Profile</div>}
      visible={isOpen}
      onCancel={closeModal}
      footer={[
        <Button key="cancel" onClick={closeModal} className="mr-2">
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Save
        </Button>,
      ]}
     
    >
      <form onSubmit={handleSave} >
        <div className="mb-4">
          <label className="cursor-pointer rounded-full w-24 h-24 overflow-hidden hover:bg-gray-200 hover:opacity-80">
            {imagePreview && (
              <div className="relative">
                <div className="flex items-center justify-center h-full">
                  <div className="rounded-full overflow-hidden w-24 h-24">
                    <img
                      src={imagePreview}
                      alt="Subscriber Preview"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="text-center mt-1 text-gray-600 hover:text-gray-800 text-sm underline">
                  Click to change Image
                </div>
              </div>
            )}
            {!imagePreview && (
              <div className="text-center mt-1 text-gray-600 hover:text-gray-800 text-sm underline">
                Click to change Image
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
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
              value={editedProfile.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={editedProfile.phoneNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Gender:</label>
            <select
              name="gender"
              value={editedProfile.gender}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-semibold">Birthday:</label>
            <input
              type="date" 
              name="birthday"
              value={editedProfile.birthday}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">CIN:</label>
            <input
              type="text"
              name="cin"
              value={editedProfile.cin}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              value={editedProfile.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;