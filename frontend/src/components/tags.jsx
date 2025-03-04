'use client';
import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

export default function TagsComponent() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [color, setColor] = useState('#000000');
    const [showInput, setShowInput] = useState(false);
    const [jwt_token, setJwtToken] = useState(null);
    
    // Fetch JWT token first, then fetch tags when token is available
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setJwtToken(token); // Update state
      }
    }, []);
    
    useEffect(() => {
      if (jwt_token) {
        fetchTags();
      }
    }, [jwt_token]); // Runs when jwt_token is updated
    
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tags', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${jwt_token}` },
        });
    
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          console.error('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      const payload = { text: newTag, color: color };
      try {
        const response = await fetch('http://localhost:8080/api/tag/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt_token}` },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          fetchTags(); // Fetch updated tags after creating a new one
          setNewTag('');
          setColor('#000000');
          setShowInput(false);
        } else {
          console.error('Failed to create tag');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow-md">
      <h2 className="text-lg text-black font-semibold mb-2">Tags</h2>
      
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Create New Tag
        </button>
      )}

      {showInput && (
        <div className="mb-4, text-gray-700">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter tag name"
            className="px-3 py-2 mb-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <SketchPicker
            color={color}
            onChangeComplete={(color) => setColor(color.hex)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            >
              Save Tag
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

        <div className="flex flex-wrap max-w-[200px] gap-2 ">
        {tags.map((tag, index) => (
            <span
            key={index}
            style={{ backgroundColor: tag.color }}
            className="inline-block px-3 py-1 text-sm text-white rounded-full shadow-md"
            >
            {tag.text}
            </span>
        ))}
        </div>

    </div>
  );
}
