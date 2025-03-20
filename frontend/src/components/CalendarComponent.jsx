'use client';
import { useState } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

const BlogList = () => {
    const [blogs, setBlogs] = useState([
        // Sample blog data - replace with actual API call
        {
            id: 1,
            title: 'Getting Started with Next.js',
            excerpt: 'Learn how to build modern web applications with Next.js...',
            date: '2024-03-19',
            image: '/images/alps.jpg'
        },
        {
            id: 2,
            title: 'Understanding React Hooks',
            excerpt: 'Deep dive into React Hooks and their practical applications...',
            date: '2024-03-18',
            image: '/images/beach.jpg'
        }
    ]);

    const handleCreateBlog = () => {
        // Implement navigation to blog creation page
        console.log('Navigate to create blog page');
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
