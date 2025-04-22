'use client';
import ProfileDropdown from './ProfileDropDown';
import Image from 'next/image';

const Navbar = ({Page}) => {
  return (
    <nav className="bg-gray-100 shadow-lg rounded-lg mb-4 p-4 flex justify-between items-center">
      {/* Left Section with Logo */}
      <div className="flex space-x-4 items-center">
        <div
          className="cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          <Image
            src="/zine.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Right Section (Profile Dropdown) */}
      <div className="w-3/4 flex justify-end">
        <ProfileDropdown Page = {Page} />
      </div>
    </nav>
  );
};

export default Navbar;
