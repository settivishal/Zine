"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback, memo } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import { useAuth } from '../../../hooks/authcontext';
import { useTags } from '../../../hooks/tagsContext';
import { Chip, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PublishBlog from '../../../components/PublishBlog';

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Room } from '../../../components/Room';
import { Editor } from '../../../components/Editor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Memoized tag component to prevent unnecessary re-renders
const TagItem = memo(({ tag, isHovered, onMouseEnter, onMouseLeave, onRemove }) => {
    return (
        <div
            className="relative"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Chip
                label={tag.text}
                size="small"
                sx={{
                    backgroundColor: tag.color || '#666',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                    },
                    '&:active': {
                        transform: 'translateY(0)'
                    }
                }}
            />
            {isHovered && (
                <button
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-700"
                    style={{ zIndex: 2 }}
                >
                    ×
                </button>
            )}
        </div>
    );
});

TagItem.displayName = 'TagItem';

// Memoized TagsContainer component
const TagsContainer = memo(({ blogTags, hoveredTag, setHoveredTag, handleAddTags, removeTagFromBlog }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}
        >
            {blogTags.map((tag) => (
                <TagItem
                    key={tag.ID}
                    tag={tag}
                    isHovered={hoveredTag === tag.ID}
                    onMouseEnter={() => setHoveredTag(tag.ID)}
                    onMouseLeave={() => setHoveredTag(null)}
                    onRemove={(e) => {
                        e.stopPropagation();
                        removeTagFromBlog(tag.text);
                    }}
                />
            ))}
            <Chip
                icon={<AddIcon />}
                label="Add Tag"
                size="small"
                onClick={handleAddTags}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#666',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                    },
                    '&:active': {
                        transform: 'translateY(0)'
                    }
                }}
            />
        </Box>
    );
});

TagsContainer.displayName = 'TagsContainer';

// Memoized editor wrapper
const MemoizedEditor = memo(({ roomId }) => {
    return (
        <Room room_id={`room-${roomId}`}>
            <Editor />
        </Room>
    );
});

MemoizedEditor.displayName = 'MemoizedEditor';

export default function Blog() {
    const params = useParams();
    const id = params.id;
    const { accessToken } = useAuth();
    const { tags, fetchTags } = useTags();
    const [data, setData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [blogTags, setBlogTags] = useState([]);
    const [hoveredTag, setHoveredTag] = useState(null);
    const [openTagDialog, setOpenTagDialog] = useState(false);

    const fetchContentFromBackend = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/blog/${id}`,
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

                // Fetch tags for this blog if it has tag IDs
                if (data.blog?.TagIDs && data.blog.TagIDs.length > 0) {
                    fetchTagsByIds(data.blog.TagIDs);
                }
            }

        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    const fetchTagsByIds = async (tagIds) => {
        if (!tagIds || tagIds.length === 0) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/tags/getByIDs`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tag_ids: tagIds })
            });

            if (response.ok) {
                const tags = await response.json();
                setBlogTags(tags || []);
            } else {
                console.error('Failed to fetch tags by IDs');
            }
        } catch (error) {
            console.error('Error fetching tags by IDs:', error);
        }
    };

    useEffect(() => {
        if (id && accessToken) {
            fetchContentFromBackend(id);
            fetchTags();
        }
    }, [id, accessToken, fetchTags]);

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('blog_id', id);

            const response = await axios.post(
                `${API_BASE_URL}/api/blog/cover/upload`,
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

    const handleCoverImageDelete = async () => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('blog_id', id);
            const response = await axios.post(
                `${API_BASE_URL}/api/blog/cover/delete`,
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
            console.error('Error deleting cover image:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddTags = useCallback(() => {
        setOpenTagDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenTagDialog(false);
    }, []);

    const handleTagSelect = useCallback(async (selectedTag) => {
        if (!data) return;

        // Check if tag already exists for this blog
        const tagExists = blogTags.some(tag => tag.text === selectedTag.text);

        if (!tagExists) {
            await addTagToBlog(selectedTag.text);
        }

        handleCloseDialog();
    }, [data, blogTags, handleCloseDialog]);

    const addTagToBlog = async (tagText) => {
        try {
            const payload = {
                text: tagText,
                date: data.Date
            };

            const response = await fetch(`${API_BASE_URL}/api/tag/set`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Refresh the blog data to get updated tags
                fetchContentFromBackend(id);
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Failed to add tag to blog:', {
                    status: response.status,
                    error: errorData
                });
            }
        } catch (error) {
            console.error('Error adding tag to blog:', error);
        }
    };

    const removeTagFromBlog = useCallback(async (tagText) => {
        try {
            const payload = {
                text: tagText,
                date: data.Date
            };

            const response = await fetch(`${API_BASE_URL}/api/tag/remove`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Immediately update UI by filtering out the removed tag
                const updatedTags = blogTags.filter(tag => tag.text !== tagText);
                setBlogTags(updatedTags);

                // Also refresh the blog data in the background
                fetchContentFromBackend(id);
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Failed to remove tag from blog:', {
                    status: response.status,
                    error: errorData
                });
            }
        } catch (error) {
            console.error('Error removing tag from blog:', error);
        }
    }, [data, blogTags, id, accessToken]);

    function FormattedDate({ date }) {
        if (!date) return null;

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const [year, month, day] = date.split("-");
        const formattedDate = `${parseInt(day)} ${months[parseInt(month) - 1]}`;

        return <span suppressHydrationWarning className="text-gray-700 bg-gray-200 py-2 px-4 text-base font-semibold rounded-md">{formattedDate}</span>;
    }
    return (
        <div className='bg-secondary-light dark:bg-secondary-dark relative flex flex-col p-4 min-h-screen'>
            <div className='p-5'>
                <Navbar Page={'Home'} />
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <FormattedDate date={data?.Date} />
                    </div>
                    <div>
                        <PublishBlog blog_data={data} />
                    </div>
                </div>

                <div className="relative">
                    <Image
                        src={data?.Cover || '/images/alps.jpg'}
                        alt="Cover image"
                        className='w-full h-[35vh] bg-gray-200 my-4 rounded-t-md object-cover'
                        width={1000}
                        height={1000}
                    />
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '25%',
                            background: 'linear-gradient(to bottom, rgb(0, 0, 0, 0.8) 0%, rgba(0,0,0,0) 100%)',
                            zIndex: 1
                        }}
                        // className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black/80 to-transparent z-10"
                    />
                    {/* Tags positioned at the top left of the cover image */}
                    <TagsContainer
                        blogTags={blogTags}
                        hoveredTag={hoveredTag}
                        setHoveredTag={setHoveredTag}
                        handleAddTags={handleAddTags}
                        removeTagFromBlog={removeTagFromBlog}
                    />

                    {data?.Cover && (
                        <button
                            onClick={handleCoverImageDelete}
                            disabled={uploading}
                            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                            {uploading ? (
                                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    )}
                    <label className={`absolute bottom-4 ${data?.Cover ? 'right-20' : 'right-4'} w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all transform hover:scale-105`}>
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

                <MemoizedEditor roomId={id} />

                {/* Dialog for adding tags */}
                <Dialog open={openTagDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Select a Tag</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
                            {tags && tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag.text}
                                    onClick={() => handleTagSelect(tag)}
                                    sx={{
                                        backgroundColor: tag.color,
                                        color: 'white',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.9,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}