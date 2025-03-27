"use client"

import React, { useState } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import Navbar from '../../components/Navbar';


import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function Blog() {
  const [localFiles, setLocalFiles] = useState({}); // Store local file previews
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

  return (
    <>
    
    <div className='p-5'>
        <Navbar />
        <button className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>Save</button>
        <BlockNoteView editor={editor} className='my-5' />
    </div>
    </>
    
  );
}