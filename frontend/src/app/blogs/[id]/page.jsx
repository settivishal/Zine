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
    const [uploading, setUploading] = useState(false);



    const fetchContentFromBackend = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/blog/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
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
        if (id && accessToken) {
            fetchContentFromBackend(id);
        } // Fetch content when the component mounts
    }, [id, accessToken]);

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('blog_id', id);

            const response = await axios.post(
                'http://localhost:8080/api/blog/cover/upload',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data) {
                // Refresh blog data to get the updated cover image
                fetchContentFromBackend(id);
            }
        } catch (error) {
            console.error('Error uploading cover image:', error);
        } finally {
            setUploading(false);
        }
    };

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

                <div className="relative">
                    <Image
                        src={data?.Cover || '/images/alps.jpg'}
                        alt="Cover image"
                        className='w-full h-[35vh] bg-gray-200 my-4 rounded-t-md object-cover'
                        width={1000}
                        height={1000}
                    />

                    <label className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all transform hover:scale-105">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleCoverImageUpload}
                            accept="image/*"
                            disabled={uploading}
                        />
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </label>
                </div>

                <Room room_id={`room-${id}`}>
                    <Editor />
                </Room>

            </div>
        </>
    );
}