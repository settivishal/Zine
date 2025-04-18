"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import { useAuth } from '../../../hooks/authcontext';

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Room } from '../../../components/Room';
import { Editor } from '../../../components/Editor';

export default function Blog() {
    const params = useParams();
    const id = params.id;
    const { accessToken } = useAuth();
    const [data, setData] = useState(null);
    


    const fetchContentFromBackend = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/blog/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${accessToken}`,
                    },
                }
            ); // Use axios to make the GET request

            if (response) {
                const data = response.data;
                console.log('Fetched content:', data);
                setData(data.blog); // Set the fetched data to state
            }
            
        } catch (error) {

            console.error('Error fetching content:', error);
        }
    };

    useEffect(() => {
        if (id  && accessToken) {
            fetchContentFromBackend(id);
        } // Fetch content when the component mounts
    }, [id, accessToken]);
    

    // editor.uploadFile = async (file) => {
    //     const reader = new FileReader();
    //     return new Promise((resolve, reject) => {
    //         reader.onload = () => {
    //             resolve(reader.result); // Resolve with the base64 image data
    //         };
    //         reader.onerror = reject;
    //         reader.readAsDataURL(file); // Convert the file to base64
    //     });
    // };
    function FormattedDate({ date }) {
        if (!date) return null;

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const [year, month, day] = date.split("-");
        const formattedDate = `${parseInt(day)} ${months[parseInt(month) - 1]}`;

        return <span suppressHydrationWarning className="text-gray-700 bg-gray-200 text-2xl font-bold rounded p-2">{formattedDate}</span>;
    }
    return (
        <>

            <div className='p-5'>
                <Navbar Page={'Home'} />
                

                <FormattedDate date={data?.Date} />

                <Image  
                    src= {data?.Cover || '/images/alps.jpg'}
                    alt="Cover image" 
                    className='w-full h-[35vh] bg-gray-200 my-4 rounded-t-md'
                    width={1000}
                    height={1000}
                />

                <Room room_id={`room-${id}`}>
                    <Editor />
                </Room>

            </div>
        </>

    );
}