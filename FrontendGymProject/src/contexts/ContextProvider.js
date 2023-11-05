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

    const [listNotif,setListNotif] = useState([]);

    const [showFilter,setShowFilter]=useState(false);
    const [searchName,setSearchName]=useState("");
    const [startDate,setStartDate]=useState("");
    const [endDate,setEndDate]=useState("");
    const [status,setStatus]=useState("");

    const [gymId,setGymId]=useState()
    const [gymLogo,setGymLogo]=useState("")
    const [gymName,setGymName]=useState("")
    const [gymAddress,setGymAddress]=useState("")
    const [gymFb,setGymFb]=useState("")
    const [gymInsta,setGymInsta]=useState("")
    const [editGym, setEditGym]=useState(false);
    const [file,setFile]=useState(null);

    const handleClickNotif = () => setShowNotif(prevShowNotif => !prevShowNotif);
    const handleClickProfile = () => setShowProfile(prevShowProfile => !prevShowProfile);
    
    const handleClickCoachDetails = (clicked) => setShowCoachDetails(clicked);
    const handleClickEmployeeDetails = (clicked) => setShowEmployeeDetails(clicked);
    const handleClickSubDetails = (clicked) => setShowSubDetails(clicked);  
    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

    const handeleClickDelEmp = () => setDelEmp(prevDelEmp => !prevDelEmp);
    const handeleClickDelSub = () => setDelSub(prevDelSub => !prevDelSub);
    const handeleClickDelCoach = () => setDelCoach(prevDelCoach => !prevDelCoach);

    const handleClickFilter=()=>setShowFilter(prevShowFilter=>!prevShowFilter);
    const handleClickSearchName=(name)=>setSearchName(name);
    const handleClickFilterStart=(date)=>setStartDate(date);
    const handleClickFilterEnd=(date)=>setEndDate(date);
    const handleClickFilterStatus=(val)=>setStatus(val);

    
    return (
        <StateContext.Provider value={{activeMenu , setActiveMenu, screenSize, setScreenSize, showNotif, setShowNotif,handleClickNotif,showProfile, setShowProfile,handleClickProfile, showCoachDetails, setShowCoachDetails, handleClickCoachDetails,showEmployeeDetails, setShowEmployeeDetails, handleClickEmployeeDetails, showSubDetails, setShowSubDetails,handleClickSubDetails, isClicked, setIsClicked, handleClick, initialState,delEmp,setDelEmp,handeleClickDelEmp,delSub,setDelSub,handeleClickDelSub,delCoach,setDelCoach,handeleClickDelCoach,listNotif,setListNotif,showFilter,setShowFilter,handleClickFilter,searchName,setSearchName,handleClickSearchName,startDate,setStartDate,handleClickFilterStart,endDate,setEndDate,handleClickFilterEnd,status,setStatus,handleClickFilterStatus,editGym, setEditGym,gymLogo,setGymLogo, gymName,setGymName, gymAddress,setGymAddress, gymFb,setGymFb, gymInsta,setGymInsta,gymId,setGymId,file,setFile}}> 
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext (StateContext);