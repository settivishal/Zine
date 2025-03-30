'use client';
import { useState } from 'react';
import Image from 'next/image';
import profileImage from '../../public/profile2.jpg';
import { User, Gear, Question, SignOut } from "@phosphor-icons/react";

const ProfileDropDown = ({Page}) => {
  const [toggle, setToggle] = useState(false);
  const options = [
    { label: Page, icon: <User size={16} className="mr-2" />, onClick: () => handleOptionClick(Page) },
    { label: "Settings", icon: <Gear size={16} className="mr-2" />, onClick: () => handleOptionClick("Settings") },
    { label: "Help", icon: <Question size={16} className="mr-2" />, onClick: () => handleOptionClick("Help") },
    { label: "Logout", icon: <SignOut size={16} className="mr-2 text-red-500" />, onClick: () => handleOptionClick("Logout") }
  ];

  const handleOptionClick = (option) => {
    if(option === Page) {
      window.location.href = "/" + Page.toLowerCase();
    }
    // Add your logic here for each option
    setToggle(false); // Close the dropdown after clicking an option
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <div
        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-all"
        onClick={() => setToggle(!toggle)}
      >
        <Image 
          src={profileImage} 
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </div>

      {/* Dropdown Menu */}
      {toggle && (
        <div className="absolute mt-3 w-[130px] bg-white border border-gray-300 rounded-lg shadow-lg z-50"
          style={{ right: "10px" }}>
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-blue-500 hover:text-white text-black transition-all cursor-pointer flex items-center"
              onClick={option.onClick}
            >
              {option.icon} {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
