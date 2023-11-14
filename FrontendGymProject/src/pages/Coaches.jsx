import React,{useState,useEffect} from 'react'
import {CoachDetails, Header } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {Modal} from 'antd'
import {link} from '../Connection/link'
import { FaUserCog, FaUserPlus} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'
import {GoSearch} from 'react-icons/go'
import AddCoaches from '../AddForm/AddCoche'

const Coaches = () => {

    const rowStyle ='p-2 font-bold tracking-wide text-center border-2 text-sm';
    const style={backgroundColor:'light-gray'};
    const {showCoachDetails, setShowCoachDetails, handleClickCoachDetails,delCoach,setDelCoach,handeleClickDelCoach} = useStateContext();
    const [showAddCoachModal, setShowAddCoachModal] = useState(false);
    const [listCoach,setListCoach] = useState([]);
    const [x,setX] = useState();

    const [searchCoach,setSearchCoach]=useState("");
    const handleClickSearchCoach=(name)=>setSearchCoach(name);
    
    const fetchData = async() =>{
        const response = await fetch(`${link}/account/coach/`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListCoach(resData["data"]);
                        
    }
    useEffect(()=>{
        fetchData();
    },[])

    
    const fetchDetails = async(id) =>{
        const response = await fetch(`${link}/account/coach/${id}/`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setX(resData["data"]);         
    }
    
    const fetchSearchData = async(value) =>{
        const response = await fetch(`${link}/account/coach/?search=${value}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListCoach(resData["data"]);              
    }

    return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl '>
         <Header category="Page" title="Coaches" />
        <div className='flex flex-row bg-neutral-700 rounded-full p-1 sm:h-10 h-9 md:w-72 sm:w-64 w-60'> 
            <input className=' rounded-full border-1 sm:w-64 sm:pl-4 p-2' placeholder='Type name to search...' type="text" onChange={(e)=>{ handleClickSearchCoach(e.target.value);fetchSearchData(e.target.value);}} />
            <button className='text-white text-lg sm:text-2xl m-1 sm:mx-2 mr:2 ' onClick={()=>fetchSearchData(searchCoach)}><GoSearch/></button>
        </div>
        <div className='overflow-auto mt-16'>
        <button
  className="border border-gray-500 text-black-500 px-2 py-1 rounded-md mb-2"
  onClick={() => setShowAddCoachModal(true)}
>
  <FaUserPlus/> 
</button>
            <table className='w-full border-2'>
                <thead className='bg-gray-50 '>
                    <tr>
                        <th className={rowStyle} >Id</th>
                        <th className={rowStyle} >Image</th>
                        <th className={rowStyle} >Name</th>
                        <th className={rowStyle} >Phone Number</th>
                        <th className={rowStyle} >Activity</th>
                        <th className={rowStyle} >Manage Coache</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listCoach.map((item) => (
                            <tr key={item.id} className='border-2 hover:bg-light-gray'>
                                <td className=' p-4 text-center border-2 w-8' >{item.id}</td>
                                <td className=' w-36' ><img className="rounded-full w-20 h-20 m-auto p-2" src={item.person.picture} alt='Employee img' /></td>
                                <td className=' p-4 text-center w-40' >{item.person.name}</td>
                                <td className=' p-4 text-center w-36'>{item.person.number}</td>
                                <td className=' p-4 text-center w-32' >{item.activity.name}</td>
                                <td className=' text-center w-36' >
                                    <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={async() => {await fetchDetails(item.id);handleClickCoachDetails(item.id);} } ><FaUserCog/></button>
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div>

        <Modal style={style} open = {showCoachDetails!==0} onCancel={()=> setShowCoachDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-35% mt-7 mb-1 py-2 px-4 rounded-lg' onClick={() =>handeleClickDelCoach()}>Delete Account</button>}>
            <CoachDetails x={x} /> 
        </Modal> 
        <Modal style={style} open ={showAddCoachModal}  onCancel={() => setShowAddCoachModal(false)} footer={null}>
  <AddCoaches /> 
</Modal>

        <Modal open={delCoach===true} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} onCancel={() => handeleClickDelCoach()}>
            <h3 className=' text-xl font-semibold mb-3'>Confirm Account Deletion</h3>
            <p className='m-3'>Are you sure you want to delete your account?</p>
        </Modal>
    </div>
  )
}

export default Coaches