import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, Sidebar, Navbar } from './components';
import {Home, Employees, Coaches, Subscribers,ManageActivity,ManageGym,Profile,Login, ForgotPass, NewPass, EnterCode} from './pages/index.jsx'
import { useStateContext } from './contexts/ContextProvider';
import { link } from './Connection/link';
import './App.css';

const MainContent = ({ children }) => {
  const location = useLocation();
  const { activeMenu } = useStateContext();

  const isLoginPage = [
    '/login',
    '/forgot',
    '/reset',
    '/entercode'
  ].includes(location.pathname);

  return (
    <div className="flex relative">
      {!isLoginPage && (
        activeMenu ? (
          <div className="w-72 fixed sidebar bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0">
            <Sidebar />
          </div>
        )
      )}
      <div className={`bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
        {!isLoginPage && (
          <div className="fixed md:static bg-main-bg navbar w-full">
            <Navbar />
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

const App = () => {
  const { setListNotif } = useStateContext();

  const fetchNotifData = async () => {
    try {
      const response = await fetch(`${link}/account/notification/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resData = await response.json();
      setListNotif(resData['data']);
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  useEffect(() => {
    fetchNotifData();
  }, []);

  return (
    <div>
      <BrowserRouter>
        {/* Login-related Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPass />} />
          <Route path="/reset" element={<NewPass />} />
          <Route path="/entercode" element={<EnterCode />} />
          <Route path="/" element={<Login />} />

          {/* Main App Structure */}
          <Route
            path="/*"
            element={
              <MainContent>
                <Routes>
                  {/* Dashboards */}
                  <Route path="/home" element={<Home />} />

                  {/* Pages */}
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/coaches" element={<Coaches />} />
                  <Route path="/subscribers/:param" element={<Subscribers />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* Settings */}
                  <Route path="/ManageActivity" element={<ManageActivity />} />
                  <Route path="/ManageGym" element={<ManageGym />} />
                </Routes>
              </MainContent>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
