import React, { createContext , useContext, useState} from 'react'

const StateContext = createContext();

export const ContextProvider = ({children}) => {

    const initialState = {
        Employees: false,
        Coaches: false,
        Subscribers: false,
      };

    const [activeMenu, setActiveMenu] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [screenSize, setScreenSize] = useState(undefined);


    const [showEmployeeDetails, setShowEmployeeDetails] = useState(0);
    const [showCoachDetails, setShowCoachDetails] = useState(0);
    const [showSubDetails, setShowSubDetails] = useState(0);
    const [isClicked, setIsClicked] = useState(initialState);

    const [delEmp,setDelEmp] = useState(false);
    const [delSub,setDelSub] = useState(false);
    const [delCoach,setDelCoach] = useState(false);

    const handleClickNotif = () => setShowNotif(prevShowNotif => !prevShowNotif);
    const handleClickProfile = () => setShowProfile(prevShowProfile => !prevShowProfile);
    
    const handleClickCoachDetails = (clicked) => setShowCoachDetails(clicked);
    const handleClickEmployeeDetails = (clicked) => setShowEmployeeDetails(clicked);
    const handleClickSubDetails = (clicked) => setShowSubDetails(clicked);  
    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

    const handeleClickDelEmp = () => setDelEmp(prevDelEmp => !prevDelEmp);
    const handeleClickDelSub = () => setDelSub(prevDelSub => !prevDelSub);
    const handeleClickDelCoach = () => setDelCoach(prevDelCoach => !prevDelCoach);
    
    return (
        <StateContext.Provider value={{activeMenu , setActiveMenu, screenSize, setScreenSize, showNotif, setShowNotif,handleClickNotif,showProfile, setShowProfile,handleClickProfile, showCoachDetails, setShowCoachDetails, handleClickCoachDetails,showEmployeeDetails, setShowEmployeeDetails, handleClickEmployeeDetails, showSubDetails, setShowSubDetails,handleClickSubDetails, isClicked, setIsClicked, handleClick, initialState,delEmp,setDelEmp,handeleClickDelEmp,delSub,setDelSub,handeleClickDelSub,delCoach,setDelCoach,handeleClickDelCoach }}> 
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext (StateContext);