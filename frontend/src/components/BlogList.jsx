'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { useAuth } from '../hooks/authcontext';
//import LocalOfferIcon from '@mui/icons-material/LocalOffer';


const BlogList = () => {
    let userTags = [
        {
            text: 'Travel',
            color: '#2196f3'
        },
        {
            text: 'Nature',
            color: '#4caf50'
        },
        {
            text: 'Adventure',
            color: '#ff9800'
        },
        {
            text: 'Beach',
            color: '#00bcd4'
        },
        {
            text: 'Summer',
            color: '#f44336'
        },
        {
            text: 'Vacation',
            color: '#9c27b0'
        }
    ];

    const { accessToken } = useAuth();
    const [realBlogs, setRealBlogs] = useState([]);
    const [blogs, setBlogs] = useState([
        // Sample blog data - replace with actual API call
        {
            id: 1,
            title: 'Majestic peaks and breathtaking views in the heart of the Swiss Alps! 🏔️✨',
            excerpt: 'Snow-capped mountains, crystal-clear lakes, and charming alpine villages...',
            date: '2024-03-19',
            image: '/images/alps.jpg',
            tags: [userTags[0], userTags[1], userTags[2]] // Travel, Nature, Adventure
        },
        {
            id: 2,
            title: 'Sun, sand, and endless vibes at Miami Beach! ☀️🌊✨',
            excerpt: 'Golden sands, turquoise waters, and vibrant nightlife ...',
            date: '2024-03-18',
            image: '/images/beach.jpg',
            tags: [userTags[3], userTags[4], userTags[5]] // Beach, Summer, Vacation
        }
    ]);

    // Add new state for dialog
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!accessToken) {
                console.log('Waiting for access token...');
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/blogs?page=1&limit=7", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Raw API response:', data);

                    if (data.blogs) {
                        setRealBlogs(data.blogs);
                        console.log('Processed blogs data:', data.blogs);
                    } else {
                        console.error('Blog data missing in response:', data);
                    }

                    // Log pagination info for debugging
                    console.log('Total pages:', data.total_pages);
                    console.log('Total count:', data.count);
                } else {
                    const errorData = await response.json().catch(() => null);
                    console.error('Failed to fetch blogs:', {
                        status: response.status,
                        statusText: response.statusText,
                        errorData
                    });
                }
            } catch (error) {
                console.error('Error fetching blogs:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
        };

        fetchBlogs();
    }, [accessToken]);

    const handleCreateBlog = async () => {
        try {
            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];

            const response = await fetch('http://localhost:8080/api/blog/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: formattedDate
                })
            });

            const data = await response.json();
            console.log('Create blog response:', data);
            if (response.ok) {
                // Extract just the path from blog_url and combine with origin
                const blogPath = data.blog_url.replace('localhost:3000', '');
                window.location.href = `${window.location.origin}${blogPath}`;
            } else {
                console.error('Failed to create blog:', data.message);
            }
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    const handleTagClick = (tag) => {
        // Implement tag click functionality
        console.log(`Tag clicked: ${tag}`);
    };

    const handleAddTags = (blogId) => {
        setSelectedBlogId(blogId);
        setOpenTagDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenTagDialog(false);
        setSelectedBlogId(null);
    };

    const handleTagSelect = (newTag) => {
        setBlogs(blogs.map(blog => {
            if (blog.id === selectedBlogId) {
                // Check if tag already exists
                const tagExists = blog.tags.some(tag => tag.text === newTag.text);
                if (!tagExists) {
                    return {
                        ...blog,
                        tags: [...blog.tags, newTag]
                    };
                }
            }
            return blog;
        }));
        handleCloseDialog();
    };

    // Add this function to check if blog exists for today
    const blogExistsForToday = () => {
        const today = new Date();
        // Format date as YYYY-MM-DD
        const formattedDate = today.toISOString().split('T')[0];
        console.log('Checking for blog on date:', formattedDate); // Debug log
        console.log('Available blog dates:', Object.keys(realBlogs)); // Debug log
        return Object.keys(realBlogs).includes(formattedDate);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">My Blogs</h2>
                {!blogExistsForToday() && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateBlog}
                        sx={{
                            backgroundColor: '#1a73e8',
                            '&:hover': {
                                backgroundColor: '#1557b0'
                            }
                        }}
                    >
                        Create New Blog
                    </Button>
                )}
            </div>

            <div className="overflow-y-auto">
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        className="mb-4 hover:shadow-lg transition-shadow"
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s ease-in-out'
                            }
                        }}
                    >
                        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={blog.id === 1} // Priority loading for first image
                            />
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
                                {blog.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag.text}
                                        size="small"
                                        onClick={() => handleTagClick(tag.text)}
                                        sx={{
                                            backgroundColor: tag.color,
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
                                ))}
                                <Chip
                                    icon={<AddIcon />}
                                    label="Add Tag"
                                    size="small"
                                    onClick={() => handleAddTags(blog.id)}
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
                        </div>
                        <CardContent>
                            <Typography variant="h6" component="h3" className="mb-2">
                                {blog.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="mb-2">
                                {blog.excerpt}
                            </Typography>
                            <Box className="flex justify-end text-sm text-gray-500">
                                <Typography variant="caption">
                                    {new Date(blog.date).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add the Dialog component at the end */}
            <Dialog open={openTagDialog} onClose={handleCloseDialog}>
                <DialogTitle>Select a Tag</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
                        {userTags.map((tag, index) => (
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
    );
};

export default BlogList;