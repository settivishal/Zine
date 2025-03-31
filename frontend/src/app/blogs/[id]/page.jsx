"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import axios from 'axios';
import { BlockNoteView } from "@blocknote/mantine";
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import { useAuth } from '../../../hooks/authcontext';

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function Blog() {
    const [blocks, setBlocks] = useState([]);
    const params = useParams();
    const id = params.id;
    // console.log(id);
    const { accessToken } = useAuth();
    const [editorContent, setEditorContent] = useState([
        {
            type: "heading",
            content: "BlockNote Example",
        },
        {
            type: "paragraph",
            content: "Welcome to this demo!",
        },
    ]);

    const editor = useCreateBlockNote({
        initialContent: editorContent,
    });

    // const fetchContentFromBackend = async () => {
    //     try {
    //         const response = await fetch('/api/getContent');
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch content');
    //         }
    //         const data = await response.json();
    //         setEditorContent(data.content); // Update the editor content with data from backend
    //     } catch (error) {
    //         console.error('Error fetching content:', error);
    //     }
    // };
    const fetchContentFromBackend = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`http://localhost:8080/api/blog/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${accessToken}`,
                    },
                }
            ); // Use axios to make the GET request
            setEditorContent(response.data?.blog?.Content); // Update the editor content with data from backend
            console.log(response.data?.blog?.Date);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    useEffect(() => {
        if (id  && accessToken) {
            fetchContentFromBackend(id);
        } // Fetch content when the component mounts
    }, [id, accessToken]);
    

    editor.uploadFile = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result); // Resolve with the base64 image data
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); // Convert the file to base64
        });
    };

    const saveToBackend = async (content) => {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to save content');
            }

            console.log('Content saved successfully');
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    const handleSave = async () => {
        console.log(editor);
    };

    return (
        <>

            <div className='p-5'>
                <h1>Blog {id}</h1>
                <Navbar Page={'Home'} />
                {/* cover image like in notion use NEXT IMAGE */}
                <div className='w-full h-[35vh] bg-gray-200 border rounded-t-md'>
                    {/* cover image */}
                    {/* <Image  
            src= "https://images.unsplash.com/random/landscape"
            alt="Cover image" 
            fill
            className='object-cover'
            sizes='100vw'
            /> */}

                </div>

                <BlockNoteView
                    editor={editor}
                    onChange={() => {
                    }}
                    className='mb-5'
                />

                <button className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition' onClick={handleSave}>Save</button>

            </div>
        </>

    );
}