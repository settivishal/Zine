'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { useAuth } from '../hooks/authcontext';
import { useTags } from '../hooks/tagsContext';
import { useRouter } from 'next/navigation';
//import LocalOfferIcon from '@mui/icons-material/LocalOffer';


const BlogList = () => {
    const { accessToken } = useAuth();
    const { tags, fetchTags } = useTags();
    const router = useRouter();
    const [realBlogs, setRealBlogs] = useState({});
    const [blogTags, setBlogTags] = useState({}); // New state to store tags for each blog
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [hoveredTag, setHoveredTag] = useState(null); // Add this new state

    const fetchTagsByIds = async (tagIds) => {
        if (!tagIds || tagIds.length === 0) return [];

        try {
            const response = await fetch("http://localhost:8080/api/tags/getByIDs", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tag_ids: tagIds })
            });

            if (response.ok) {
                const tags = await response.json();
                // The response is already an array of tags, so we don't need to access .tags
                return tags || [];
            } else {
                console.error('Failed to fetch tags by IDs');
                return [];
            }
        } catch (error) {
            console.error('Error fetching tags by IDs:', error);
            return [];
        }
    };

    // Move fetchBlogs outside useEffect so we can reuse it
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

                if (data.blogs) {
                    setRealBlogs(data.blogs);

                    // Collect all unique tag IDs from all blogs
                    const allTagIds = Object.values(data.blogs)
                        .filter(blog => blog.tagIds)
                        .flatMap(blog => blog.tagIds);

                    if (allTagIds.length > 0) {
                        const tags = await fetchTagsByIds(allTagIds);
                        // Create a mapping of blog IDs to their tags
                        const tagMapping = {};
                        Object.values(data.blogs).forEach(blog => {
                            if (blog.tagIds) {
                                tagMapping[blog.id] = tags.filter(tag =>
                                    blog.tagIds.includes(tag.ID)
                                );
                            }
                        });
                        setBlogTags(tagMapping);
                    }
                }
            } else {
                console.error('Failed to fetch blogs');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    // Update useEffect to use the new fetchBlogs function
    useEffect(() => {
        fetchBlogs();
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            fetchTags();
        }
    }, [accessToken, fetchTags]);

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

    const handleAddTags = (blogId, date) => {
        setSelectedBlogId(blogId);
        setOpenTagDialog(true);
        fetchTags();
    };

    const handleCloseDialog = () => {
        setOpenTagDialog(false);
        setSelectedBlogId(null);
    };

    // Update addTagToBlog to use the new fetchBlogs function
    const addTagToBlog = async (tagText, blogDate) => {
        try {
            const payload = {
                text: tagText,
                date: blogDate
            };

            console.log('Adding tag with payload:', payload);

            const response = await fetch('http://localhost:8080/api/tag/set', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Successfully added tag to blog');
                // Refresh the blogs data immediately after adding tag
                await fetchBlogs();
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

    // Update handleTagSelect function
    const handleTagSelect = async (selectedTag) => {
        if (!selectedBlogId) return;

        // Find the blog date for the selected blog
        const blogEntry = Object.entries(realBlogs).find(([_, blog]) => blog.id === selectedBlogId);
        if (!blogEntry) return;

        const [blogDate, blog] = blogEntry;

        // Check if tag already exists for this blog
        const existingTags = blogTags[blog.id] || [];
        const tagExists = existingTags.some(tag => tag.text === selectedTag.text);

        if (!tagExists) {
            await addTagToBlog(selectedTag.text, blogDate);
        }

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

    // Add new function to remove tag
    const removeTagFromBlog = async (tagText, blogDate) => {
        try {
            const payload = {
                text: tagText,
                date: blogDate
            };

            console.log('Removing tag with payload:', payload);

            const response = await fetch('http://localhost:8080/api/tag/remove', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Successfully removed tag from blog');
                await fetchBlogs(); // Refresh the blogs data
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
    };

    // Add function to handle blog click
    const handleBlogClick = (blogId) => {
        router.push(`/blogs/${blogId}`);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">My Blogs</h2>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={blogExistsForToday() ? undefined : handleCreateBlog}
                    disabled={blogExistsForToday()}
                    sx={{
                        backgroundColor: blogExistsForToday() ? '#e0e0e0' : '#1a73e8',
                        '&:hover': {
                            backgroundColor: blogExistsForToday() ? '#e0e0e0' : '#1557b0'
                        }
                    }}
                >
                    Create New Blog
                </Button>
            </div>

            <div className="overflow-y-auto">
                {Object.entries(realBlogs).map(([date, blog]) => (
                    <Card
                        data-testid="blog-card"
                        key={blog.id}
                        className="mb-4 hover:shadow-lg transition-shadow"
                        onClick={() => handleBlogClick(blog.id)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s ease-in-out'
                            }
                        }}
                    >
                        <div
                            style={{ position: 'relative', width: '100%', height: '200px' }}
                            onClick={(e) => e.stopPropagation()} // Prevent image container clicks from triggering navigation
                        >
                            <Image
                                src={blog.cover || '/images/alps.jpg'}
                                alt={blog.title || 'Blog Post'}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={false}
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
                                {blogTags[blog.id]?.map((tag, index) => (
                                    <div
                                        key={tag.ID}
                                        className="relative"
                                        onMouseEnter={() => setHoveredTag(`${blog.id}-${tag.ID}`)}
                                        onMouseLeave={() => setHoveredTag(null)}
                                    >
                                        <Chip
                                            label={tag.text}
                                            size="small"
                                            onClick={() => handleTagClick(tag.text)}
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
                                        {hoveredTag === `${blog.id}-${tag.ID}` && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering the tag click
                                                    removeTagFromBlog(tag.text, date);
                                                }}
                                                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-700"
                                                style={{ zIndex: 2 }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <Chip
                                    icon={<AddIcon />}
                                    label="Add Tag"
                                    size="small"
                                    onClick={() => handleAddTags(blog.id, date)}
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
                                {blog.title || 'Untitled Blog Post'} {/* Default title if none exists */}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="mb-2">
                                {blog.excerpt || 'No content yet...'} {/* Default excerpt if none exists */}
                            </Typography>
                            <Box className="flex justify-end text-sm text-gray-500">
                                <Typography variant="caption">
                                    {new Date(date.replace(/-/g, '/')).toLocaleDateString()}
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
                        {console.log('Available tags in dialog:', tags)}  {/* Debug log */}
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
    );
};

export default BlogList;