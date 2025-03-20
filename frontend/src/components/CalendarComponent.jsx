'use client';
import { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const BlogList = () => {
    const [blogs, setBlogs] = useState([
        // Sample blog data - replace with actual API call
        {
            id: 1,
            title: 'Majestic peaks and breathtaking views in the heart of the Swiss Alps! 🏔️✨',
            excerpt: 'Snow-capped mountains, crystal-clear lakes, and charming alpine villages...',
            date: '2024-03-19',
            image: '/images/alps.jpg',
            tags: [
                { text: 'Travel', color: '#2196f3' },
                { text: 'Nature', color: '#4caf50' },
                { text: 'Adventure', color: '#ff9800' }
            ]
        },
        {
            id: 2,
            title: 'Sun, sand, and endless vibes at Miami Beach! ☀️🌊✨',
            excerpt: 'Golden sands, turquoise waters, and vibrant nightlife ...',
            date: '2024-03-18',
            image: '/images/beach.jpg',
            tags: [
                { text: 'Beach', color: '#00bcd4' },
                { text: 'Summer', color: '#f44336' },
                { text: 'Vacation', color: '#9c27b0' }
            ]
        }
    ]);

    const handleCreateBlog = () => {
        // Implement navigation to blog creation page
        console.log('Navigate to create blog page');
    };

    const handleTagClick = (tag) => {
        // Implement tag click functionality
        console.log(`Tag clicked: ${tag}`);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">My Blogs</h2>
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
                                    flexWrap: 'wrap'
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
        </div>
    );
};

export default BlogList;
