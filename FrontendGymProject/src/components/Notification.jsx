import React from 'react';
import { chatData } from '../data/data';

const Notification = () => {

  return (
    <div className="nav-item absolute right-5 md:right-40 top-14 bg-white dark:bg-[#42464D] p-4 rounded-lg w-80 border-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Notifications</p>
        </div>
      </div>
      <div className="mt-5 h-60 overflow-x-hidden">
        {chatData?.map((item, index) => (
          <div key={index} className="flex items-center leading-8 gap-5 border-b-1 border-color p-3">
            <img className="rounded-full h-10 w-10" src={item.image} alt={item.message} />
            <div>
              <p className="font-semibold dark:text-gray-200">{item.message}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;