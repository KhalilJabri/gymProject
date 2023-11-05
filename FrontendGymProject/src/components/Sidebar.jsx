import React,{useState,useEffect} from 'react'
import {Link, NavLink} from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import {superAdminElements} from '../data/navbarElement'
import {link} from '../Connection/link'
import logoGym from '../data/logoGym.png'
import {MdOutlineCancel} from 'react-icons/md'
import {TbPointFilled} from 'react-icons/tb'

const Sidebar = () => {
  const {activeMenu, setActiveMenu, screenSize, isClicked, setIsClicked, handleClick, initialState} = useStateContext();
  const [listAct,setlistAct] = useState([]);

  const fetchActivity = async() =>{
    const response = await fetch(`${link}/account/activity/`,{
      method: 'GET',
      headers: {
       'Content-Type': 'application/json',
      },})
      const resData = await response.json();
      setlistAct(resData["data"]);                   
  }
    useEffect(()=>{
      fetchActivity();
    },[])

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md m-2 bg-light-gray';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-light-gray m-2'; 

  const activeList = 'flex items-center gap-3 pl-4 pt-2 pb-2 rounded-lg text-md m-1 bg-light-gray';
  const normalList = 'flex items-center gap-3 pl-4 pt-2 pb-2 rounded-lg text-md text-gray-700 hover:bg-light-gray m-1'; 


  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10' >
      {
        activeMenu && (
        <>
          <div className='flex justify-between items-center'>
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-slate-900 "> 
              <span><img alt='logoGym' src={logoGym} className="rounded-full w-14 h-14"/></span><span>MY GYM</span> 
            </Link>
            <div content="Menu" position="BottomCenter" >
              <button type='button' onClick={() => setActiveMenu( (prevActiveMenu) => !prevActiveMenu )} className='text-xl rounded-full p-3 hover,bg-light-gray mt-4 block md:hidden'>
                <MdOutlineCancel/>
              </button>
            </div>
          </div>
        
          <div className='mt-10'>
            {
              superAdminElements.map((item) => (
                <div key={item.title}>
                  <p className='text-gray-400 m-3 mt-4 uppercase'>
                    {item.title}
                  </p>
                  {
                    item.links.map((link,index) => (
                      <div key={index}>
                        {link.name ==="Subscribers"?
                        <NavLink to={`/${link.name}/all`} key={link.name} onClick={()=>{handleCloseSideBar();handleClick(link.name)}} className={({isActive}) => isActive ? activeLink : normalLink} >
                          {link.icon}
                          <span className='capitalize'>
                            {link.name}
                          </span>
                        </NavLink> :
                        <NavLink to={`/${link.name}`} key={link.name} onClick={()=>{handleCloseSideBar();handleClick(link.name)}} className={({isActive}) => isActive ? activeLink : normalLink} >
                          {link.icon}
                          <span className='capitalize'>
                            {link.name}
                          </span>
                        </NavLink>
                        } 
                        {
                          (link.name==="Subscribers" && isClicked.Subscribers===true) ? 
                            <div className=' rounded-lg text-md ml-8 mr-7'>
                              {(listAct.map((list,index) =>(
                                <NavLink to={`/${link.name}/${list.name}`} key={index} onClick={()=>{handleCloseSideBar();}} className={({isActive}) => isActive ? activeList : normalList} >
                                  <TbPointFilled/>
                                  <span className=' capitalize'>
                                    {list.name}
                                  </span>
                                </NavLink>
                              )))}
                            </div> :null
                        }
                      </div> 
                    ))
                  }
                </div>
              ))
            }
          </div>
        </>)
      }
    </div>
  )
}

export default Sidebar