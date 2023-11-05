import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Header, Footer, Sidebar,Navbar} from './components'
import {Home, Employees, Coaches, Subscribers,ManageActivity,ManageGym} from './pages/index.jsx'
import { useStateContext } from './contexts/ContextProvider'
import {link} from './Connection/link'
import './App.css'

const App = () => {
  const {activeMenu,listNotif,setListNotif} = useStateContext();

    const fetchNotifData = async() =>{
        const response = await fetch(`${link}/account/notification/`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListNotif(resData["data"]);
    }
    useEffect(()=>{
      fetchNotifData();
    },[])
    

  return (
    <div>
        <BrowserRouter>
          <div className='flex relative'>
            {activeMenu ? (
              <div className='w-72 fixed sidebar bg-white'>
                <Sidebar />
              </div>
              ) : (
                <div className='w-0'>
                  <Sidebar />
                </div>
              )
            }
            <div className={`bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
              <div className='fixed md:static bg-main-bg navbar w-full'>
                <Navbar />
              </div>
              <div>
                <Routes>
                  {/* Dashboards */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  
                  {/* pages */}
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/coaches" element={<Coaches />} />
                  <Route path="/subscribers/:param" element={<Subscribers />} />
                  {/*settings */}
                  <Route path="/ManageActivity" element={<ManageActivity />} />
                  <Route path="/ManageGym" element={<ManageGym />} />
                </Routes>
              </div>
            </div>
          </div>  
        </BrowserRouter>    
        
    </div>
  )
}

export default App