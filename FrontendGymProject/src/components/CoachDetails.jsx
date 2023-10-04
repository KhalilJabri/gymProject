import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import {CoachesTable} from '../data/data'
import {MdOutlinePhoneIphone,MdEmail } from 'react-icons/md'
import {LiaUserEditSolid} from 'react-icons/lia'

const CoachDetails = () => {
    const {showCoachDetails, setShowCoachDetails, handleClickCoachDetails} = useStateContext();
    const elementFooterCrad ='flex flex-row flex-nowrap text-white m-1 mr-3';
    const iconFooterCard = 'w-4 h-4 mr-2 ';
    const filteredData = CoachesTable.filter((row) => row.id === showCoachDetails);
  return (
    <div>
      <div className='text-center m-5 mb-10 text-2xl font-bold'>
        <h1>Coach Profile</h1>
      </div>
      {
        filteredData.map((item) => (
          <>
            <div className='shadow-xs bg-light-gray rounded-2xl md:mx-12 mx-8'>
              <div>
                <button className=' och:text-2xl och:hover:text-3xl text-xl hover:text-2xl bg-eBony border rounded-full absolute md:top-24 md:right-14 thr:top-24 top-32 right-10 ml-3 p-2'><LiaUserEditSolid className='text-white ml-1 mb-1'/></button>
              </div>  
              <br/>
              <div className='mb-3'>
                <img className='rounded-full border-4 border-eBony w-36 mx-auto' src={item.image} alt='profile img' />
              </div>
              <div>
                <h3 className='text-center text-2xl font-bold'>{item.name}</h3>
                <div className='flex flex-row flex-nowrap justify-center text-xs m-1 mb-3'>
                  <p className='text-gray-500 border-r-1 border-gray-500 px-1'>{item.gender}</p>
                  <span className=' text-gray-600 flex flex-row flex-nowrap px-1'>Born :<p className='pl-1'>{item.birthday}</p></span>
                </div>
              </div>
              <hr/> 
              <table className='mx-4 my-2'>
                <tbody className=''>
                  <tr className='h-8'>
                    <td className=' font-semibold whitespace-nowrap'>CIN :</td>
                    <td className='pl-8'>{item.cin}</td>
                  </tr>
                  <tr className='h-8'>
                    <td className=' font-semibold whitespace-nowrap'>Address :</td>                      
                    <td className='pl-8'>{item.address}</td>
                  </tr>
                  <tr className='h-8'>
                    <td className=' font-semibold whitespace-nowrap'>Activity :</td>
                    <td className='pl-8'>{item.activity}</td>
                  </tr>
                  <tr className='h-8'>
                    <td className=' font-semibold whitespace-nowrap'>Created :</td>
                    <td className='pl-8'>{item.created}</td>
                  </tr>
                </tbody>
              </table>  
              <div className=' bg-eBony rounded-b-2xl p-2'>
                <ul className='text-xs flex flex-row justify-around flex-wrap'>
                  <li className={elementFooterCrad}><MdOutlinePhoneIphone className={iconFooterCard}/> <p>{item.phoneNumber}</p></li>
                  <li className={elementFooterCrad}><MdEmail className={iconFooterCard}/> <p>{item.email}</p></li>
                </ul>
              </div>   
            </div>
          </>
      ))}
    </div>
  )
}

export default CoachDetails