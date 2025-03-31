import Link from "next/link";
import React from "react";
import { useAuth } from '../hooks/authcontext';

import Button from "./Button";
// import HeroOneButton from "./HeroOneButton";
import Section from "./Section";
// import NavbarTwoColumns from "./Components/NavbarTwoColumns";

import Image from "next/image";
import myImg from "../../public/zine.png";
// import Logo from "./Logo";


import AuthModal from "../app/Modal/page";



const HeroOneButton = (props) => (
    <header className="text-center">
      <h1 className="whitespace-pre-line text-5xl font-bold leading-hero text-gray-900">
        {props.title}
      </h1>
      <div className="mb-16 mt-4 text-2xl">{props.description}</div>
  
      {props.button}
    </header>
);

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const { accessToken } = useAuth();

    // Add token expiration check function
    const isTokenExpired = () => {
        const expiresAt = document.cookie.split('; ')
            .find(row => row.startsWith('expires_at='))
            ?.split('=')[1];

        if (!expiresAt) return true;

        const datePart = expiresAt.split(' ')[0] + ' ' + expiresAt.split(' ')[1];
        const expirationTime = new Date(datePart).getTime();
        const currentTime = new Date().getTime();
        return currentTime >= expirationTime;
    };

    return (
        <div className="bg-gray-100 px-12">
            <Section yPadding="py-6">
                <div className="flex items-center justify-between" >
                    <Image src={myImg} width={70} height={70} alt="Zine" />

                <div className="flex gap-2 items-center justify-between">
                        <Link href="../home">
                            <Button>Home</Button>
                        </Link>

                        <Button onClick={() => setIsModalOpen(true)}>Sign in</Button>

                        {/* Auth Modal */}
                        <AuthModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>

                </div>
            </Section>

            <Section yPadding="pt-20 pb-32">
                <HeroOneButton
                    title={
                        <>
                            {"Per diem\n"}
                            <span className="text-primary-500 font-bold text-7xl">
                                ZINE
                            </span>
                        </>
                    }
                    description="Write and publish your day-to-day experiences"
                />
            </Section>
        </ div>
    )
};

export default Hero;