import React,{useEffect,useState} from 'react'
import {SubscribersTable} from '../data/data'
import { SubscriberDetails, Header } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {Modal} from 'antd'
import {Switch} from 'antd';
import {MdRadioButtonChecked} from 'react-icons/md'
import {FaUserCog} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'

const Subscribers = () => {
  const style={backgroundColor:'light-gray'};
  const rowStyle ='p-2 text-sm font-bold tracking-wide text-center border-2';
  const iconVerif = {color: 'green', fontSize: "1.5em", margin: "auto" };
  const iconClose = {color: 'red', fontSize: "1.5em", margin: "auto" };
  const {showSubDetails, setShowSubDetails,handleClickSubDetails,delSub, setDelSub, handeleClickDelSub} = useStateContext();

//   const [data, setData] = useState([])
//   const fetchData = async(value) =>{
//     const response = await fetch(`${link}/account/member/`,{
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },})
//         const resData = await response.json();
//         setData(resData);
//     }
//     useEffect(()=>{
//         fetchData();
//     },[])

  return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl '>
    <Header category="Page" title="Subscribers" />
    <div className='overflow-auto'>
        <table className='w-full border-2'>
            <thead className='bg-gray-50 '>
                <tr>
                    <th className={rowStyle} >Id</th>
                    <th className={rowStyle} >Image</th>
                    <th className={rowStyle} >Name</th>
                    <th className={rowStyle} >Activity</th>
                    <th className={rowStyle} >Rest Day</th>
                    <th className={rowStyle} >Status</th>
                    <th className={rowStyle} >Manage Subscriber</th>
                    <th className={rowStyle} >Continuing</th>
                </tr>
            </thead>
            <tbody>
                {
                    SubscribersTable.map((item) => (
                        <tr key={item.id} className='border-2 hover:bg-light-gray'>
                            <td className=' p-4 text-center border-2 w-8' >{item.id}</td>
                            <td className=' w-36' ><img className="rounded-full w-20 m-auto p-2" src={item.image} alt='Employee img' /></td>
                            <td className=' p-4 text-center w-40' >{item.name}</td>
                            <td className=' p-4 text-center w-32' >{item.activity}</td>
                            <td className=' p-4 text-center w-28' >{item.restDay}</td>
                            <td className=' text-center w-28' ><span>{item.payment==='Fulfilled' ? <MdRadioButtonChecked style={iconVerif}/> : <MdRadioButtonChecked style={iconClose}/>} </span></td>
                            <td className=' text-center w-36' >
                                <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={() => handleClickSubDetails(item.id) } ><FaUserCog/></button>
                            </td>
                            <td className=' text-center w-28'>
                                <Switch className=' bg-zinc-400'/>
                            </td>
                        </tr>
                    ) )
                }
            </tbody>
        </table>
    </div>  
    <Modal style={style} width={800} open = {showSubDetails!==0} onCancel={()=> setShowSubDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-m mt-7 mb-1 py-2 px-4 rounded-lg' onClick={()=> handeleClickDelSub()}>Delete Account</button>}>
        <SubscriberDetails/>
    </Modal> 

    <Modal open={delSub===true} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} onCancel={() => handeleClickDelSub()}>
        <h3 className=' text-xl font-semibold mb-3'>Confirm Account Deletion</h3>
        <p className='m-3'>Are you sure you want to delete your account?</p>
    </Modal>
</div>
  )
}

export default Subscribers