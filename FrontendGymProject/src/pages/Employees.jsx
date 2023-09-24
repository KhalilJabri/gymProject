import React ,{useEffect} from 'react'
import {EmployeesTable} from '../data/data'
import {Header, EmployeeDetails } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {link} from '../Connection/link'
import {  Switch  } from 'antd';
import {Modal} from 'antd'
import {FaUserCog} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'


const Employees = () => {
    console.log(link)
    const style={backgroundColor:'light-gray'};
    const rowStyle ='p-2 font-bold tracking-wide text-center border-2 text-sm';
    const {showEmployeeDetails, setShowEmployeeDetails, handleClickEmployeeDetails} = useStateContext();

    // const fetchData = async(value) =>{
    // const response = await fetch(`${link}/account/member/`,{
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },})
    //     const resData = await response.json();
    //     console.log(resData);
    // }
    // useEffect(()=>{
    //     fetchData();
    // },[])


    return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl '>
        <Header category="Page" title="Employees" />
        <div className='overflow-auto'>
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
                        EmployeesTable.map((item) => (
                            <tr key={item.id} className='border-2 hover:bg-light-gray '>
                                <td className=' p-4 text-center border-2 w-8' >{item.id}</td>
                                <td className=' w-36' ><img className="rounded-full w-20 m-auto p-2" src={item.image} alt='Employee img' /></td>
                                <td className=' p-4 text-center w-40' >{item.name}</td>
                                <td className=' p-4 text-center w-32'>{item.phoneNumber}</td>
                                <td className=' text-center w-36'>
                                    <Switch className=' bg-zinc-400'/>
                                </td>
                                <td className=' text-center w-28'>
                                    <Switch className=' bg-zinc-400'/>
                                </td>
                                <td className=' text-center w-36' >
                                     <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={() => handleClickEmployeeDetails(item.id) }><FaUserCog/></button> 
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div> 

        <Modal style={style} open = {showEmployeeDetails!==0} onCancel={()=> setShowEmployeeDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-35% mt-7 mb-1 py-2 px-4 rounded-lg'>Delete Account</button>}>
            <EmployeeDetails/>
        </Modal>
    </div>
  )
}

export default Employees