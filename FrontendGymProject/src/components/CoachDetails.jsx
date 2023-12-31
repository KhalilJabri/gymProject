import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { MdOutlinePhoneIphone, MdEmail } from 'react-icons/md';
import { LiaUserEditSolid } from 'react-icons/lia';
import EditCoach from '../EditForm/EditCoach';

const CoachDetails = ({ x }) => {
  const { showCoachDetails, setShowCoachDetails, handleClickCoachDetails } = useStateContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const elementFooterCrad = 'flex flex-row flex-nowrap text-white m-1 mr-3';
  const iconFooterCard = 'w-4 h-4';

  const openEditModal = (coachData) => {
    setSelectedCoach(coachData);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCoach(null);
    setIsEditModalOpen(false);
  };

  const saveEditedCoach = (editedCoachData) => {
    console.log('Edited Coach Data:', editedCoachData);
    // Implement the logic to update the state or send the data to the server here
  };

  return (
    <div>
      <div className='text-center m-5 mb-10 text-2xl font-bold'>
        <h1>Coach Profile</h1>
      </div>
      {
        <>
          <div className='shadow-xs bg-light-gray rounded-2xl md:mx-12 mx-8'>
            <div>
              <button
                className='och:text-2xl och:hover:text-3xl text-xl hover:text-2xl bg-eBony border rounded-full absolute md:top-24 md:right-14 thr:top-24 top-32 right-10 ml-3 p-2'
                onClick={() => openEditModal(x)}
              >
                <LiaUserEditSolid className='text-white ml-1 mb-1' />
              </button>
            </div>
            <br />
            <div className='mb-3'>
              <img
                className='rounded-full border-4 border-eBony w-32 h-32 mx-auto'
                src={x.person.picture}
                alt='profile img'
              />
            </div>
            <div>
              <h3 className='text-center text-2xl font-bold'>{x.person.name}</h3>
              <div className='flex flex-row flex-nowrap justify-center text-xs m-1 mb-3'>
                <p className='text-gray-500 border-r-1 border-gray-500 px-1'>{x.person.gender}</p>
                <span className=' text-gray-600 flex flex-row flex-nowrap px-1'>
                  Born :
                  <p className='pl-1'>{x.person.birthdate}</p>
                </span>
              </div>
            </div>
            <hr />
            <table className='mx-4 my-2'>
              <tbody className=''>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>CIN :</td>
                  <td className='pl-8'>{x.person.cin}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Address :</td>
                  <td className='pl-8'>{x.person.address}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Activity :</td>
                  <td className='pl-8'>{x.activity.name}</td>
                </tr>
                <tr className='h-8'>
                  <td className=' font-semibold whitespace-nowrap'>Hired :</td>
                  <td className='pl-8'>{x.hireDate}</td>
                </tr>
              </tbody>
            </table>
            <div className=' bg-eBony rounded-b-2xl p-2'>
              <ul className='text-xs flex flex-row justify-around flex-wrap'>
                <li className={elementFooterCrad}>
                  <MdOutlinePhoneIphone className={iconFooterCard} /> <p>{x.person.number}</p>
                </li>
                <li className={elementFooterCrad}>
                  <MdEmail className={iconFooterCard} /> <p>{x.person.email}</p>
                </li>
              </ul>
            </div>
          </div>
        </>
      }
      {isEditModalOpen && (
        <EditCoach isOpen={isEditModalOpen} closeModal={closeEditModal} coachData={selectedCoach} onSave={saveEditedCoach} />
      )}
    </div>
  );
};

export default CoachDetails;
