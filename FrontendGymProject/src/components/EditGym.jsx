import React, { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import axios from 'axios'
import {link} from '../Connection/link'
import {CiSaveDown2} from 'react-icons/ci'

const EditGym = () => {

    const {gymId,gymLogo, gymName,setGymName, gymAddress,setGymAddress, gymFb,setGymFb, gymInsta,setGymInsta,file,setFile} = useStateContext();
    
    const inputStyle='border-1 border-black rounded-lg lg:w-72 w-64 lg:p-3 p-1 mb-6 shadow-sh1 break-words';
    const styleTxt='md:text-lg text-md font-semibold md:my-3 my-2 underline';                   
    const styleRowInp='md:flex md:flex-row md:justify-between my-3';  

    const editDataGym = async() =>{
        let formData = new FormData();
        if(file!==null){
            formData.append('pictureGym',file);
        }
        formData.append('name',gymName);
        formData.append('address',gymAddress);
        formData.append('linkFacebook',gymFb );
        formData.append('linkInstagram',gymInsta);

        const response = await axios.put(`${link}/account/gym/${gymId}/`, formData, {headers: { 'content-type': 'multipart/form-data' }});
      }

      
  return (
    <div>
        <form className='rounded-3xl lg:p-10 p-5'>
            <div>
                <div className='mb-10'>
                    <h4 className={styleTxt}>Logo:</h4>
                    <div>
                        <img className='md:w-36 md:h-36 w-28 h-28' src={gymLogo} alt='logo' />
                        <input className={'bg-white '+inputStyle} type='file' accept='.jpeg, .jpg, .png' onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                </div>

                <div className={styleRowInp}>
                    <div className='md:mr-6'>
                    <h4 className={styleTxt}>Name:</h4>
                    <input className={inputStyle} type='text' value={gymName}  onChange={(e) => setGymName(e.target.value)} />
                    </div>
                    
                    <div className='md:ml-6'>
                    <h4 className={styleTxt}>Address:</h4>
                    <input className={inputStyle} type='text' value={gymAddress}  onChange={(e) => setGymAddress(e.target.value)} />
                    </div>
                </div>

                <div className={styleRowInp}>
                    <div className='md:mr-6'>
                    <h4 className={styleTxt}>FaceBook Link:</h4>
                    <input className={inputStyle} type='text' value={gymFb}  onChange={(e) => setGymFb(e.target.value)} />
                    </div>

                    <div className='md:ml-6'>
                    <h4 className={styleTxt}>Instagram Link:</h4>
                    <input className={inputStyle} type='text' value={gymInsta}  onChange={(e) => setGymInsta(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className='flex felx-row justify-end'>
                <button className='bg-blue-400 border-1 rounded-xl text-white lg:text-lg p-2 px-4 mt-4 hover:bg-white hover:text-black' onClick={()=>editDataGym()} >Save Changes</button>
            </div>
        </form>
    </div>    
  )
}

export default EditGym