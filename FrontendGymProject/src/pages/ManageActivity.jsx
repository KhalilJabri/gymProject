import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Header} from '../components'
import {link} from '../Connection/link'

const ManageActivity = () => {
  const [nameAct,setNameAct]=useState();
  const [descAct,setDescAct]=useState();
  const [listAct,setListAct]=useState([]);

  const inputStyle='border-1 border-black rounded-lg lg:w-80 w-64 lg:p-3 p-1 mb-10 shadow-sh1';
  const styleTxt='lg:text-xl text-md lg:my-3 my-2 font-semibold';
  const listStyle='list-disc text-lg font-semibold mt-12 capitalize';
  const descStyle='block lg:w-_360 mt-1';

  const fetchActData = async() =>{
    const response = await fetch(`${link}/account/activity/`,{
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },})
        const resData = await response.json();
        setListAct(resData["data"]);
                    
}
useEffect(()=>{
  fetchActData();
},[])

const addAct = async() =>{
  const postData = {
      name: nameAct,
      description: descAct,
    };
  const response = await axios.post(`${link}/account/activity/`, postData)
}

  return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl'>
        <Header category="Settings" title="Manage Activity" />
        <div className='bg-main-bg lg:flex lg:flex-row lg:justify-between rounded-3xl lg:p-16 p-10'>
          <form className='mr-14'>
            <div className='flex flex-row justify-center'><h1 className='lg:text-2xl text-xl underline font-bold my-3 mb-10'>Add Activity</h1></div>
            <div>
              <h4 className={styleTxt}>Name</h4>
              <input className={inputStyle} type='text' value={nameAct} onChange={(e)=>setNameAct(e.target.value)} />
            </div>
            <div>
              <h4 className={styleTxt}>Description</h4>
              <textarea maxlength="300" className={inputStyle} type='text'value={descAct} onChange={(e)=>setDescAct(e.target.value)} />
            </div>
            <div>
              <button className='bg-blue-400 text-white hover:text-black hover:bg-white text-lg font-semibold border-1 rounded-lg p-2 px-6 lg:m-5 lg:ml-28 my-5' onClick={()=>addAct()} type='submit' >Save</button>
            </div>
          </form>
          <div className='lg:border-l-2 lg:border-black lg:pl-24 pl-2 pr-2'>
            <div className='flex flex-row justify-center lg:mt-0 mt-10'><h1 className='lg:text-2xl text-xl underline font-bold my-3'>List of current activities</h1></div>
            <ul>
              {listAct.map((item)=>(
                <>
                  <li className={listStyle}>{item.name}</li>
                  <span className={descStyle}>{item.description}</span>
                </>
              ))}
            </ul>
          </div>
        </div>
    </div>
  )
}

export default ManageActivity