"use client";
// import Link from "next/link";

import * as React from "react";
import { useState } from "react";

import Base from "../../components/Base.jsx";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openAuthModal = () => {
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Base openAuthModal={openAuthModal} />
        </>
    );
}