"use client";
// import Link from "next/link";

import * as React from "react";

import Base from "../templates/Base"
// import AuthModal from "../Modal/page";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function LandingPage() {
    // const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    return (
        <Base/>
        // <div className="min-h-screen bg-gray-100">
        //     {/* Navbar */}
        //     <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">

        //         {/* Navigation Buttons */}
        //         <nav className="space-x-4">
        //             <Link href="../">
        //                 <button className= "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        //                     Home
        //                 </button>
        //             </Link>
        //             <button
        //                 onClick={() => setIsModalOpen(true)}
        //                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        //                 Sign in
        //             </button>

        //             {/* Auth Modal */}
        //             <AuthModal
        //                 isOpen={isModalOpen}
        //                 onClose={() => setIsModalOpen(false)}
        //             />
        //         </nav>
        //     </header>

        //     {/* Main Content */}
        //     <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
        //         <h1 className="text-5xl font-bold text-gray-800 mb-6">
        //             Welcome to My Landing Page
        //         </h1>
        //         <p className="text-lg text-gray-600 mb-8">
        //             This is a modern landing page built with Next.js and
        //             Tailwind CSS.
        //         </p>
        //         <Link href="../Signup">
        //             <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
        //                 Get Started
        //             </button>
        //         </Link>
        //     </main>
        // </div>
    );
}
