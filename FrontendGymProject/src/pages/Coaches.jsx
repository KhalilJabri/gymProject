import React from 'react'
import {CoachesTable} from '../data/data'
import {CoachDetails, Header } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import {Modal} from 'antd'
import {FaUserCog} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'

const Coaches = () => {

    const rowStyle ='p-2 font-bold tracking-wide text-center border-2 text-sm';
    const style={backgroundColor:'light-gray'};
    const {showCoachDetails, setShowCoachDetails, handleClickCoachDetails} = useStateContext();
    return (
    <div className='m-2 md:m-8 mt-20 p-3 md:p-12 bg-white rounded-3xl '>
        <Header category="Page" title="Coachs" />
        <div className='overflow-auto'>
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
                        CoachesTable.map((item) => (
                            <tr key={item.id} className='border-2 hover:bg-light-gray'>
                                <td className=' p-4 text-center border-2 w-8' >{item.id}</td>
                                <td className=' w-36' ><img className="rounded-full w-20 m-auto p-2" src={item.image} alt='Employee img' /></td>
                                <td className=' p-4 text-center w-40' >{item.name}</td>
                                <td className=' p-4 text-center w-36'>{item.phoneNumber}</td>
                                <td className=' p-4 text-center w-32' >{item.activity}</td>
                                <td className=' text-center w-36' >
                                    <button className='m-1 md:m-5 text-lg md:text-2xl ' onClick={() => handleClickCoachDetails(item.id) } ><FaUserCog/></button>
                                </td>
                            </tr>
                        ) )
                    }
                </tbody>
            </table>
        </div>

        <Modal style={style} open = {showCoachDetails!==0} onCancel={()=> setShowCoachDetails(0)} closeIcon={<AiFillCloseCircle className=" text-red-500 text-2xl" />} footer={<button className='text-center text-white bg-red-700 mx-35% mt-7 mb-1 py-2 px-4 rounded-lg'>Delete Account</button>}>
            <CoachDetails/>
        </Modal> 
    </div>
  )
}

export default Coaches