import React ,{useEffect,useState} from 'react'
import axios from 'axios'
import {Header, EmployeeDetails } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {link} from '../Connection/link'
import { Switch, Modal } from 'antd'
import { FaUserCog, FaUserPlus} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai';
import {GoSearch} from 'react-icons/go'
import AddEmployees from '../AddForm/AddEmployee'

const Employees = () => {
    const style={backgroundColor:'light-gray'};
    const rowStyle ='p-2 font-bold tracking-wide text-center border-2 text-sm';
    const {showEmployeeDetails, setShowEmployeeDetails, handleClickEmployeeDetails, delEmp,setDelEmp,handeleClickDelEmp} = useStateContext();
    
    const [empDetails,setEmpDetails] = useState({});
    const [listEmp,setListEmp] = useState([]);
    const [searchEmp,setSearchEmp]=useState("");
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const handleClickSearchEmp=(name)=>setSearchEmp(name);

    const fetchData = async() =>{
        const response = await fetch(`${link}/account/users/`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListEmp(resData["data"]);
                        
    }
    useEffect(()=>{
        fetchData();
    },[])

    const updateAccess = async(is_active,is_admin,id) =>{
        const postData = {
            is_active: is_active,
            is_admin: is_admin,
          };
        const response = axios.put(`${link}/account/changePermissionUser/${id}/`, postData)
    }

    const fetchDetails = async(id) =>{
        const response = await fetch(`${link}/account/users/${id}/`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            if(!response.ok){
                console.log(response)
                return 0
            }
            const resData = await response.json();
            setEmpDetails(resData["data"]);                 
    }

    const fetchSearchData = async(value) =>{
        const response = await fetch(`${link}/account/users/?search=${value}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListEmp(resData["data"]);              
    }

    return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl '>
        <Header category="Page" title="Employees" />
        <div className='flex flex-row sm:justify-end justify-between'>
            <div className='flex flex-row bg-neutral-700 rounded-full p-1 sm:h-10 h-9 md:w-72 sm:w-64 w-60 sm:mr-35%'> 
                <input className=' rounded-full border-1 sm:w-64 sm:pl-4 p-2' placeholder='Type name to search...' type="text" onChange={(e)=>{ handleClickSearchEmp(e.target.value);fetchSearchData(e.target.value);}} />
                <button className='text-white text-lg sm:text-2xl m-1 sm:mx-2 mr:2 ' onClick={()=>fetchSearchData(searchEmp)}><GoSearch/></button>
            </div>
            <div>
                <button className="rounded-2xl p-3 mx-2 bg-neutral-700 hover:bg-neutral-300" onClick={() => setShowAddEmployeeModal(true)}>
                    <FaUserPlus className='sm:text-base text-xs text-white'/> 
                </button>
            </div>
        </div>
        <div className='overflow-auto mt-16'>
            <table className='w-full border-2'>
                <thead className='bg-gray-50 '>
                    <tr>
                        <th className={rowStyle} >Id</th>
                        <th className={rowStyle} >Image</th>
                        <th className={rowStyle} >Name</th>
                        <th className={rowStyle} >Phone Number</th>
                        <th className={rowStyle} >Permission Access</th>
                        <th className={rowStyle} >Is Admin</th>
                        <th className={rowStyle} >Manage employee</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listEmp.map((item) => (
                            <tr key={item.id} className='border-2 hover:bg-light-gray '>
                                <td className=' p-4 text-center border-2 w-8' >{item.id}</td>
                                <td className=' w-36' ><img className="rounded-full w-20 h-20 m-auto p-2" src={item.picture} alt='Employee img' /></td>
                                <td className=' p-4 text-center w-40' >{item.name}</td>
                                <td className=' p-4 text-center w-32'>{item.number}</td>
                                <td className=' text-center w-36'>
                                    <Switch className=' bg-zinc-400' defaultChecked={item.is_active} onChange={(checked)=> {item.is_active=checked;updateAccess(checked,item.is_admin,item.id) }}/>
                                </td>
                                <td className=' text-center w-28'>
                                    <Switch className=' bg-zinc-400' defaultChecked={item.is_admin} onChange={(checked)=> {item.is_admin=checked;updateAccess(item.is_active,checked,item.id) }}/>
                                </td>
                                <td className=' text-center w-36' >
                                     <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={async() => {await fetchDetails(item.id); handleClickEmployeeDetails(item.id);}}><FaUserCog/></button> 
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div> 

        <Modal style={style} open = {showEmployeeDetails!==0} onCancel={()=> setShowEmployeeDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-35% mt-7 mb-1 py-2 px-4 rounded-lg' onClick={()=> handeleClickDelEmp()}>Delete Account</button>}>
            <EmployeeDetails empDetails={empDetails} />
        </Modal>
        <Modal style={style} open ={showAddEmployeeModal}  onCancel={() => setShowAddEmployeeModal(false)} footer={null}>
  <AddEmployees /> 
</Modal>

        <Modal open={delEmp===true} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} onCancel={()=> handeleClickDelEmp()}>
            <h3 className=' text-xl font-semibold mb-3'>Confirm Account Deletion</h3>
            <p className='m-3'>Are you sure you want to delete your account?</p>
        </Modal>

    </div>
  )
  
}

export default Employees