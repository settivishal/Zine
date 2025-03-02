// // components/Navbar.jsx
// 'use client';
// import Image from 'next/image';
// import profileImage from './profile2.jpg';

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-100 shadow-lg rounded-lg mb-4 p-4 flex justify-between items-center">
//       <div className="flex space-x-4">
//         {/* You can add navigation links here later */}
//       </div>
//       <div>
//         <button className="focus:outline-none">
//         <div className="relative h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
//             <Image 
//                 src={profileImage} 
//                 alt="Profile"
//                 width={32} // Explicitly set width
//                 height={32} // Explicitly set height
//                 className="rounded-full object-cover"
//             />
//         </div>

//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


'use client';
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
