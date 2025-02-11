import Link from "next/link";
import React from "react";

// import { Button } from "./Components/Button";
import HeroOneButton from "./Components/HeroOneButton";
import Section from "../layout/Section";
// import NavbarTwoColumns from "./Components/NavbarTwoColumns";

import Image from "next/image";
import myImg from "../zine.png"
// import Logo from "./Logo";


import AuthModal from "../Modal/page";


const Hero = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
    <div className="bg-gray-100 px-12">
        <Section yPadding="py-6">
            <div className="flex items-center justify-between" >
                <Image src={myImg} width={70} height={70} alt="Zine" />

                <div className="flex gap-2 items-center justify-between">
                        <Link href="../">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                Home
                            </button>
                        </Link>

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
