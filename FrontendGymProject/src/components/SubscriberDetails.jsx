import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import {SubscribersTable} from '../data/data'
import {MdOutlinePhoneIphone,MdEmail, MdDeleteOutline } from 'react-icons/md'
import {LiaUserEditSolid} from 'react-icons/lia'


const SubscriberDetails = () => {
  const elementFooterCrad ='flex flex-row flex-nowrap text-white m-1 mr-3';
  const iconFooterCard = 'w-4 h-4 mr-2 ';
  const {showSubDetails, setShowSubDetails, handleClickSubDetails} = useStateContext();
  const filteredData = SubscribersTable.filter((row) => row.id === showSubDetails);
  return (
   
    <div>
      <div className='text-center m-5 mb-10 text-2xl font-bold'>
        <h1>Subscriber Profile</h1>
      </div>
      {
        filteredData.map((item) => (
          <>
          <div className='md:flex md:flex-row md:justify-between'>

            <div className='shadow-xs bg-light-gray md:w-2/5 rounded-2xl'>
              <div>
                <button className=' och:text-2xl och:hover:text-3xl text-xl hover:text-2xl bg-eBony border rounded-full absolute och:left-72 md:top-24 md:left-_266 md:right-auto thr:top-24 top-32 right-_10 ml-3 p-2'><LiaUserEditSolid className='text-white ml-1 mb-1'/></button>
              </div>  
              <div className='mt-5 mb-3'>
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

            <div className='shadow-xs bg-light-gray md:w-1/2 md:h-_360 h-72 overflow-x-hidden rounded-2xl md:mt-0 mt-12'>
              <h3 className='text-center text-xl font-semibold underline mt-6 mb-8'>Subscriptions</h3>

              <div className='rounded-l-2xl flex flex-row justify-between border-b border-r bg-white h-16 xs:m-4 m-2'>
                <div className=' rounded-l-2xl bg-mimosa h-16 mr-1'>
                  <h3 className=' font-semibold text-center text-white xs:text-lg text-md xs:p-4 py-5 p-2'>45<span className='whitespace-nowrap pl-1'>DT</span></h3>
                </div>
                <div className=''>
                  <h3 className='xs:text-xl text-lg font-bold text-center mt-1 mb-2'>{item.activity}</h3>
                  <div className='flex flex-row text-xs mb-1'>
                    <span className='font-bold mr-2'>FROM</span> <p>{item.created}</p> <span className=' font-bold mx-2'>TO</span> <p>2/5/2023</p>
                  </div>
                </div>
                <div>
                  <button><MdDeleteOutline className='text-xl text-red-600 m-1'/></button>
                </div>
                {/* <div className='md:mr-6 sm:mr-36 xs:mr-7 '>
                  <h3 className='xs:text-xl text-lg font-bold my-2 ml-4'>{item.activity}</h3>
                  <div className='flex flex-row flex-nowrap text-xs mb-1'>
                    <span className='font-semibold mr-2'>FROM</span> <p>{item.created}</p> <span className=' font-semibold mx-2'>TO</span> <p>2/5/2023</p>
                  </div>
                </div> */}
              </div>  

            </div> 
          </div> 
          <div className='text-center float-right border-1 bg-eBony rounded-lg md:mr-15% xs:mx-35% md:my-0 mt-5'>
            <button className='px-3 py-2 text-white '>Add Subscription</button>
          </div>
          </>
      ))}
    </div>

  )
}

export default SubscriberDetails

