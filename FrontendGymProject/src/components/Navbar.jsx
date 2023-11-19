import React, {useEffect} from 'react'
import avatar from '../data/avatar.png'
import {Notification } from '.'
import { useStateContext } from '../contexts/ContextProvider'
import { RiNotification3Line } from 'react-icons/ri'
import { AiOutlineMenu } from 'react-icons/ai'
import { Link } from 'react-router-dom';


const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <div content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray">
      <span style={{ background: dotColor }} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"/>
        {icon}
      <span/>  
    </button>
  </div>
);

const Navbar = () => {
  const { activeMenu , setActiveMenu, screenSize, setScreenSize, showNotif, handleClickNotif, handleClickProfile} = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, );

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(prevactiveMenu=>!prevactiveMenu);
  console.log("test",activeMenu)

  return (
    <div className='flex justify-between p-2 md:ml-6 md:mr-6 relative'>
      <NavButton title="Menu" customFunc={handleActiveMenu} color="blue" icon={<AiOutlineMenu />} />
      <div className="flex">  
        <NavButton title="Notification" customFunc={() => handleClickNotif()} color="blue" icon={<RiNotification3Line />} dotColor="rgb(254, 201, 15)"/>
        <div content="Profile" position="BottomCenter">
          <Link to="/profile">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={() => handleClickProfile()}
            >
              <img
                className="rounded-full w-8 h-8"
                src={avatar}
                alt="user-profile"
              />
              <p>
                <span className="text-gray-400 text-14">Hi,</span>{' '}
                <span className="text-gray-400 font-bold ml-1 text-14">Ahmed</span>
              </p>
            </div>
          </Link>

        </div>
        {showNotif && (<Notification />)}
      </div>
    </div>
  )
}

export default Navbar