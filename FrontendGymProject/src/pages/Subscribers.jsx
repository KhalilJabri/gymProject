import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router'
import {link} from '../Connection/link'
import { SubscriberDetails, Header } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {Modal} from 'antd'
import {Pagination} from 'antd'
import {MdRadioButtonChecked,MdFilterAlt} from 'react-icons/md'
import {FaUserCog,FaFilter} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'
import {GoSearch} from 'react-icons/go'



const Subscribers = () => {
    const {param} =useParams();
    const style={backgroundColor:'light-gray'};
    const rowStyle ='p-2 text-sm font-bold tracking-wide text-center border-2';
    const iconVerif = {color: 'green', fontSize: "1.5em", margin: "auto" };
    const iconClose = {color: 'red', fontSize: "1.5em", margin: "auto" };
    const hiddenfilter='hidden';
    const activeFilter='flex sm:flex-row flex-col bg-neutral-100 sm:mt-6 mt-3 p-1 py-2 rounded-xl';

    const {showSubDetails, setShowSubDetails,handleClickSubDetails,delSub, handeleClickDelSub,showFilter,handleClickFilter,searchName,handleClickSearchName,startDate,handleClickFilterStart,endDate,handleClickFilterEnd,status,handleClickFilterStatus} = useStateContext();

    const pageSize=2;
    const [total,setTotal]=useState();
    const [page,setPage]=useState(1);
    const [listSub,setListSub] = useState([]);

    const fetchData = async() =>{
        let url=`${link}/account/member/?activity_name=${param}&page=${page}&page_size=${pageSize}`;
        const response = await fetch(url,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListSub(resData["data"].results);
            setTotal(resData["data"].count);        
    }

    useEffect(()=>{
        fetchData();
    },[param,page])

  const [subDetails,setSubDetails] = useState({});
    const fetchDetails = async(id) =>{
        const response = await fetch(`${link}/account/member/${id}/?&page=${page}&page_size=${pageSize}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setSubDetails(resData["data"].results);          
    }

    const fetchSearchData = async(search,start,end,status) =>{
        console.log("search",search,typeof(search))
        console.log("start",start,typeof(start))
        console.log("end",end,typeof(end))
        console.log("status",status,typeof(status))
        const response = await fetch(`${link}/account/member/?activity_name=${param}&search=${search}&startDate=${start}&endDate=${end}&status=${status}&page=${page}&page_size=${pageSize}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },})
            const resData = await response.json();
            setListSub(resData["data"].results);              
    }
    useEffect(()=>{
        fetchSearchData(searchName,startDate,endDate,status);
    },[searchName,startDate,endDate,status])


  return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl'>
        <Header category="Page" title="Subscribers" />
        <div className='flex flex-row'>
            <div className='flex flex-col'>
                <div>
                    <button className='rounded-2xl p-3 mr-40 bg-neutral-700 hover:bg-neutral-300' onClick={()=>handleClickFilter()}><FaFilter className='sm:text-base text-xs text-white'/></button>
                </div>
                <div className={showFilter ? activeFilter : hiddenfilter}>
                    <div className='mx-4'>
                        <h3 className=' font-semibold'>Start date:</h3>
                        <input className='border-1 rounded-xl border-black p-1 px-2' type='date' onChange={async(e)=>{ await handleClickFilterStart(e.target.value);}}  />
                    </div>
                    <div className='mx-4'>
                        <h3 className=' font-semibold'>End date:</h3>
                        <input className='border-1 rounded-xl border-black p-1 px-2' type='date' onChange={async(e)=>{ await handleClickFilterEnd(e.target.value);}} />
                    </div> 
                    <div className='mx-4'>
                        <h3 className=' font-semibold'>Status:</h3>
                        <select className='border-1 rounded-xl border-black p-1 px-2' onChange={async(e)=>{ await handleClickFilterStatus(e.target.value);}}>
                            <option value="">Select Status</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='flex flex-row bg-neutral-700 rounded-full p-1 sm:h-10 h-9 sm:ml-0 -ml-36'> 
                <input className=' rounded-full border-1 sm:w-64 sm:pl-4 p-2' placeholder='Type name to search...' type="text" onChange={async(e)=>{ await handleClickSearchName(e.target.value);}} />
                <button className='text-white text-lg sm:text-2xl m-1 sm:mx-2 mr:2 ' onClick={()=>fetchSearchData(searchName)}><GoSearch/></button>
            </div>
        </div>

        <div className='overflow-auto mt-16'>
            <table className='w-full border-2'>
                <thead className='bg-gray-50 '>
                    <tr>
                        <th className={rowStyle} >Id</th>
                        <th className={rowStyle} >Image</th>
                        <th className={rowStyle} >Name</th>
                        <th className={rowStyle} >Activity</th>
                        <th className={rowStyle} >End Date</th>
                        <th className={rowStyle} >Status</th>
                        <th className={rowStyle} >Manage Subscriber</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listSub.map((item,index) => (
                            <tr key={index} className='border-2 hover:bg-light-gray'>
                                <td className=' p-4 text-center border-2 w-8' >{item.member.id}</td>
                                <td className=' w-32' ><img className="rounded-full w-20 h-20 m-auto p-2" src={item.member.person.picture} alt='Employee img' /></td>
                                <td className=' w-40 p-4 text-center' >{item.member.person.name}</td>
                                <td className=' w-36' >
                                    {item.subscription.map((i,index)=>(<span key={index} className=' block text-center p-4'>{i.activity.name}</span>))}
                                </td>
                                <td className=' w-32' >
                                    {item.subscription.map((i,index)=>(<span key={index} className=' block text-center p-4'>{i.endDate}</span>))}
                                </td>
                                <td className='w-28' >
                                    {item.subscription.map((i,index)=>(<span key={index} className=' block text-center p-4'>{i.status? <MdRadioButtonChecked style={iconVerif}/> : <MdRadioButtonChecked style={iconClose}/>} </span>))}
                                </td>
                                <td className=' text-center w-32' >
                                    <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={async() => {await fetchDetails(item.member.id);handleClickSubDetails(item.member.id); }} ><FaUserCog/></button>
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div>

        <div className='flex flex-col items-center mt-5'>
            <Pagination responsive total={total} pageSize={pageSize} current={page} onChange={(val)=>setPage(val)} />
        </div>

        <Modal style={style} width={800} open = {showSubDetails!==0} onCancel={()=> setShowSubDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-m mt-7 mb-1 py-2 px-4 rounded-lg' onClick={()=> handeleClickDelSub()}>Delete Account</button>}>
            <SubscriberDetails subDetails={subDetails} />
        </Modal> 

        <Modal open={delSub===true} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} onCancel={() => handeleClickDelSub()}>
            <h3 className=' text-xl font-semibold mb-3'>Confirm Account Deletion</h3>
            <p className='m-3'>Are you sure you want to delete your account?</p>
        </Modal>
    </div>
  )
}

export default Subscribers