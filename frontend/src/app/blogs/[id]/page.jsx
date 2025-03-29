"use client"

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Navbar from '../../../components/Navbar';
import Image from 'next/image';


import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function Blog() {
    const [blocks, setBlocks] = useState([])
    const params = useParams();
    const id = params.id;
    const [editor, setEditor] = useState(null);

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

    React.useEffect(() => {
        // Initialize the editor after component mounts
        const editor = useCreateBlockNote({
            initialContent: editorContent,
        });
        setEditor(editor);
    }, []);

    const fetchContentFromBackend = async () => {
        try {
            const response = await fetch('/api/getContent');
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            const data = await response.json();
            setEditorContent(data.content); // Update the editor content with data from backend
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    // React.useEffect(() => {
    //     fetchContentFromBackend(); // Fetch content when the component mounts
    // }, []);

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
                <Navbar />
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

                {editor && (
                    <BlockNoteView
                        editor={editor}
                        onChange={() => { }}
                        className='mb-5'
                    />
                )}

                <button className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition' onClick={handleSave}>Save</button>

            </div>
        </>

    );
}