import React from 'react';
import { useStateContext } from '../contexts/ContextProvider'
import { chatData } from '../data/data';

const Notification = () => {

  const {listNotif,setListNotif}= useStateContext();

  return (
    <div className="nav-item absolute right-5 md:right-40 top-14 bg-white dark:bg-[#42464D] p-2 rounded-lg w-80 border-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Notifications</p>
        </div>
      </div>
      <div className="mt-4 h-60 overflow-x-hidden">
        {listNotif.map((item, index) => (
          
          <div key={index} className="flex items-center leading-8 gap-5 border-b-1 border-color p-2 hover:bg-light-gray">
            <img className="rounded-full h-11 w-11" src={item.person.picture} alt="image" />
            <div>
              <p className="font-bold dark:text-gray-200">{item.person.name}</p>
              {item.member_sub.map((i)=>(
              <p className="text-gray-500 font-semibold text-xs pl-3 dark:text-gray-400 whitespace-nowrap">Expired Subscription {i.activity.name}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;