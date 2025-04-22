"use client";

import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { useAuth } from '../hooks/authcontext';
import { useTags } from '../hooks/tagsContext';

export default function Tags() {
  const [newTag, setNewTag] = useState("");
  const [color, setColor] = useState("#000000");
  const [showInput, setShowInput] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const { accessToken } = useAuth();
  const { tags, fetchTags } = useTags();

  useEffect(() => {
    if (accessToken) {
      fetchTags();
    }
  }, [accessToken, fetchTags]);

  const handleAddTag = async () => {
    if (newTag.trim()) {
      const payload = { text: newTag, color: color };
      

      try {
        const response = await fetch("http://localhost:8080/api/tag/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        

        const responseData = await response.json();
        

        if (response.ok) {
          await fetchTags();
          setNewTag("");
          setColor("#000000");
          setShowInput(false);
        } else {
          console.error("Failed to create tag:", response.status, responseData);
        }
      } catch (error) {
        console.error("Error creating tag:", error.message, error.stack);
      }
    }
  };

  const handleDeleteTag = async (tagText) => {
    try {
      const response = await fetch("http://localhost:8080/api/tag/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text: tagText }),
      });

      if (response.ok) {
        fetchTags(); // Refresh the tags list after deletion
      } else {
        console.error("Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div className="bg-primary-light dark:bg-primary-dark p-4 border rounded shadow-md">
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
        {tags?.map((tag, index) => (
          <div key={index} className="relative">
            <span
              onClick={() => setSelectedTag(selectedTag === tag.text ? null : tag.text)}
              style={{ backgroundColor: tag.color }}
              className="inline-block px-3 py-1 text-sm text-white rounded-full shadow-md cursor-pointer"
            >
              {tag.text}
            </span>
            {selectedTag === tag.text && (
              <button
                onClick={() => handleDeleteTag(tag.text)}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}