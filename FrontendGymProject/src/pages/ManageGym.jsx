import React,{useState,useEffect} from 'react'
import {Header, EditGym } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {link} from '../Connection/link'
import { Modal } from 'antd'
import logoGym from '../data/logoGym.png'
import{AiFillCloseCircle} from 'react-icons/ai'
import {BiEdit} from 'react-icons/bi'

const ManageGym = () => {

  const {editGym, setEditGym,setGymId, gymLogo,setGymLogo, gymName,setGymName, gymAddress,setGymAddress, gymFb,setGymFb, gymInsta,setGymInsta }=useStateContext()

  const inputStyle='lg:w-80 w-64 break-words md:text-lg text-gray-500 lg:p-3 p-1 mb-6 ';
  const styleTxt='md:text-xl text-lg font-semibold md:my-3 my-2 underline';                   
  const styleRowInp='md:flex md:flex-row md:justify-between my-3';     
  
  const fetchGymData = async() =>{
    const response = await fetch(`${link}/account/gym/`,{
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },})
        const resData = await response.json();
        setGymId(resData["data"].id)
        setGymLogo(resData["data"].pictureGym)
        setGymName(resData["data"].name)
        setGymAddress(resData["data"].address)
        setGymFb(resData["data"].linkFacebook)
        setGymInsta(resData["data"].linkInstagram)
}
useEffect(()=>{
  fetchGymData();
},[])

  return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl  '>
      <Header category="Settings" title="Manage Gym" />
        <div className='bg-main-bg rounded-3xl lg:p-16 p-10'>
              <div className='m-10'>
                <div className='sm:mb-16 mb-10'>
                    <h4 className={styleTxt}>Logo:</h4>
                    <img className='md:w-48 md:h-48 w-32 h-32 bg-white border-1 rounded-3xl p-4 md:ml-32 shadow-sh1' src={gymLogo} alt='logo'  />
                </div>

                <div className={styleRowInp}>
                    <div>
                      <h4 className={styleTxt}>Name:</h4>
                      <p className={inputStyle}>{gymName}</p>
                    </div>
                    
                    <div>
                      <h4 className={styleTxt}>Address:</h4>
                      <p className={inputStyle} >{gymAddress}</p>
                    </div>
                </div>

                <div className={styleRowInp}>
                    <div>
                      <h4 className={styleTxt}>FaceBook:</h4>
		                  <p className={inputStyle}>{gymFb}</p>
                    </div>

                    <div>       
                      <h4 className={styleTxt}>Instagram:</h4>
							        <p className={inputStyle}>{gymInsta}</p>
                    </div>
                </div>
            </div>

            <div className='flex felx-row justify-end'>
                 <button className='bg-blue-400 border-1 rounded-xl text-white lg:text-xl p-2 px-4 mt-4 hover:bg-white hover:text-black' onClick={()=>setEditGym(true)}>Edit</button>
            </div>
        </div>

      <Modal width={800} open = {editGym===true} onCancel={()=> setEditGym(false)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer>
        <EditGym />
      </Modal>

    </div>

  ) 
}

export default ManageGym