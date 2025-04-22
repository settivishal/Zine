'use client';
import { useState } from 'react';
import Image from 'next/image';
import { User, Gear, Question, SignOut } from "@phosphor-icons/react";
import useProfile from '../hooks/useProfile';
import { useAuth } from '../hooks/authcontext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ProfileDropDown = ({ Page }) => {
  const [toggle, setToggle] = useState(false);
  const { profileImage, loading, error } = useProfile();
  const { accessToken } = useAuth();

  const options = [
    { label: Page, icon: <User size={16} className="mr-2" />, onClick: () => handleOptionClick(Page) },
    { label: "Settings", icon: <Gear size={16} className="mr-2" />, onClick: () => handleOptionClick("Settings") },
    { label: "Help", icon: <Question size={16} className="mr-2" />, onClick: () => handleOptionClick("Help") },
    { label: "Logout", icon: <SignOut size={16} className="mr-2 text-red-500" />, onClick: () => handleOptionClick("Logout") }
  ];

  const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const handleOptionClick = async (option) => {
    if (option === Page) {
      window.location.href = "/" + Page.toLowerCase();
    }
    else if (option === "Settings") {
      window.location.href = "/settings";
    }
    else if (option === "Logout") {
      try {
        

        const response = await fetch(`${API_BASE_URL}/consumer/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        // Debug logs
        
        const responseText = await response.text();
        

        if (response.ok) {
          deleteCookie('accessToken');
          window.location.href = "/";
        } else {
          console.error('Logout failed:', response.status, responseText);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    setToggle(false);
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <div
        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-all"
        onClick={() => setToggle(!toggle)}
      >
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : error ? (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} />
          </div>
        ) : (
          <Image
            src={profileImage}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8 aspect-square"
            unoptimized
          />
        )}
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