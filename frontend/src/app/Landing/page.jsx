"use client";
import Link from "next/link";

import * as React from "react";
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';

// import SignUp from "../Signup/page";
import AuthModal from "../Modal/page";

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

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
                {/* Logo or Home Button */}

                {/* <div className="text-xl font-bold text-gray-800">
          <Link href="/">MyLogo</Link>
        </div> */}

                {/* Navigation Buttons */}
                <nav className="space-x-4">
                    <Link href="../">
                        <button className= "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Home
                        </button>
                    </Link>
                    {/* <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
              Sign In
            </button>
          </Link> */}
                    {/* <Link href="../Signup">
            <button className="px-4 py-2 text-sm font-medium text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition">
              Sign Up
            </button>
          </Link> */}
                    {/* <div>
            <Button onClick={handleOpen}>Sign up</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <SignUp />
              </Box>
            </Modal>
          </div> */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        Sign in
                    </button>

                    {/* Auth Modal */}
                    <AuthModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Welcome to My Landing Page
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    This is a modern landing page built with Next.js and
                    Tailwind CSS.
                </p>
                <Link href="../Signup">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
                        Get Started
                    </button>
                </Link>
            </main>
        </div>
    );
}
