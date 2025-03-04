// Code: Navbar component that contains the navigation links and the profile dropdown'use client';
import ProfileDropdown from './ProfileDropDown';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 shadow-lg rounded-lg mb-4 p-4 flex justify-between items-center">
      {/* Left Section (e.g., Nav Links) */}
      <div className="flex space-x-4">
        {/* Add navigation links here if needed */}
      </div>

      {/* Right Section (Profile Dropdown) */}
      <div className="w-3/4 flex justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
