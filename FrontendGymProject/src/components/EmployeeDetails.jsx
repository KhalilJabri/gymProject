import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { MdOutlinePhoneIphone, MdEmail } from 'react-icons/md';
import { LiaUserEditSolid } from 'react-icons/lia';
import EditEmployee from '../EditForm/EditEmployee';

const EmployeeDetails = ({ empDetails }) => {
  const { showEmployeeDetails, setShowEmployeeDetails, handleClickEmployeeDetails } = useStateContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const elementFooterCrad = 'flex flex-row flex-nowrap text-white m-1 mr-3';
  const iconFooterCard = 'w-4 h-4 mr-2';

  const openEditModal = (employeeData) => {
    setSelectedEmployee(employeeData);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEmployee(null);
    setIsEditModalOpen(false);
  };

  const saveEditedEmployee = (editedEmployeeData) => {
    console.log('Edited Employee Data:', editedEmployeeData);
  };

  return (
    <div>
      <div className='text-center m-5 mb-10 text-2xl font-bold'>
        <h1>Employee Profile</h1>
      </div>
      {
        <>
          <div className='shadow-xs bg-light-gray rounded-2xl md:mx-12 mx-8'>
            <div>
              <button
                className='och:text-2xl och:hover:text-3xl text-xl hover:text-2xl bg-eBony border rounded-full absolute md:top-24 md:right-14 thr:top-24 top-32 right-10 ml-3 p-2'
                onClick={() => openEditModal(empDetails)}
              >
                <LiaUserEditSolid className='text-white ml-1 mb-1' />
              </button>
            </div>
            <br />
            <div className='mb-3'>
              <img className='rounded-full border-4 border-eBony w-32 h-32 mx-auto' src={empDetails.picture} alt='profile img' />
            </div>
            <div>
              <h3 className='text-center text-2xl font-bold'>{empDetails.name}</h3>
              <div className='flex flex-row flex-nowrap justify-center text-xs m-1 mb-3'>
                {empDetails.is_admin ? <p className=' text-gray-600 flex flex-row flex-nowrap px-1'>Administrator</p> : null}
              </div>
            </div>
            <hr />
            <table className='mx-4 my-2'>
              <tbody className=''>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Gender :</td>
                  <td className='pl-8'>{empDetails.gender}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Birthday :</td>
                  <td className='pl-8'>{empDetails.birthdate}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>CIN :</td>
                  <td className='pl-8'>{empDetails.cin}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Address :</td>
                  <td className='pl-8'>{empDetails.address}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Created :</td>
                  <td className='pl-8'>{empDetails.created_at}</td>
                </tr>
              </tbody>
            </table>
            <div className=' bg-eBony rounded-b-2xl p-2'>
              <ul className='text-xs flex flex-row justify-around flex-wrap'>
                <li className={elementFooterCrad}><MdOutlinePhoneIphone className={iconFooterCard} /> <p>{empDetails.number}</p></li>
                <li className={elementFooterCrad}><MdEmail className={iconFooterCard} /> <p>{empDetails.email}</p></li>
              </ul>
            </div>
          </div>
        </>
      }
      {isEditModalOpen && (
        <EditEmployee
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          employeeData={selectedEmployee}
          onSave={saveEditedEmployee}
        />
      )}
    </div>
  );
}

export default EmployeeDetails;
