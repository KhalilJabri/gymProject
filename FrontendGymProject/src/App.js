import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Header, Footer, Sidebar,Navbar} from './components'
import {Home, Employees, Subscribers, Coaches, SubActivity} from './pages'
import { useStateContext } from './contexts/ContextProvider'
import './App.css'

const App = () => {
  const {activeMenu} = useStateContext();

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
                  <Route path="/subscribers" element={<Subscribers />} />
                  <Route path="/subscribers/:name" element={<SubActivity />} />
                </Routes>
              </div>
            </div>
          </div>  
        </BrowserRouter>    
        
    </div>
  )
}

export default App