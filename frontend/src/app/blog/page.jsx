"use client"

import React, { useState } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Navbar from '../../components/Navbar';
import Image from 'next/image';


import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function Blog() {
    const [blocks, setBlocks] = useState([])

    const editor = useCreateBlockNote({
    initialContent: [
        {
            type: "heading",
            content: "BlockNote Example",
        },
        
        {
            type: "paragraph",
            content: "Welcome to this demo!",
        },
    ],
});

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
        const content = editor.document; // Get the current document content
        // await saveToBackend(content); // Save the content to the backend
        console.log(content);
    };

  return (
    <>
    
    <div className='p-5'>
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
        
        <BlockNoteView 
        editor={editor}  
        onChange={() => {
            // Saves the document JSON to state.
            setBlocks(editor.document);
          }}
        className='mb-5' 
        />

    <button className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition' onClick={handleSave}>Save</button>

    </div>
    </>
    
  );
}