import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const EditPassword = ({ isOpen, closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangePassword = () => {
    // Implement your password change logic here, e.g., making an API request.
    // You can also handle success and error cases here.
    if (newPassword === confirmPassword) {
      // Make the API request to change the password here
      // You can add error handling and success notifications as needed

      // After successfully changing the password, close the modal
      closeModal();
    } else {
      // Handle password mismatch here (e.g., show an error message)
    }
  };

  return (
    <Modal
      title={<div className="text-center">Change Password</div>}
      visible={isOpen}
      onCancel={closeModal}
      footer={[
        <Button key="cancel" onClick={closeModal} className="mr-2">
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onChangePassword} className="bg-blue-500 hover:bg-blue-700 text-white">
          Save
        </Button>
      ]}
    >
      <form>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-gray-600">Current Password</label>
          <Input
            type="password"
            id="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-600">New Password</label>
          <Input
            type="password"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditPassword;
