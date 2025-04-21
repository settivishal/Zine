'use client';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import { useAuth } from '../hooks/authcontext';
import { useTags } from '../hooks/tagsContext';
import { useRouter } from 'next/navigation';
import Filter from './Filter';


const BlogList = ({ selectedDate, onDateSelect, availableTags, onTagsUpdate }) => {
    const { accessToken } = useAuth();
    const { tags, fetchTags } = useTags();
    const router = useRouter();
    const [realBlogs, setRealBlogs] = useState({});
    const [blogTags, setBlogTags] = useState({}); // New state to store tags for each blog
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [hoveredTag, setHoveredTag] = useState(null); // Add this new state
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isDateFiltered, setIsDateFiltered] = useState(false);
    const [singleBlog, setSingleBlog] = useState(null);

    // Update isDateFiltered when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            setIsDateFiltered(true);
            fetchBlogByDate(selectedDate);
        } else {
            setIsDateFiltered(false);
            fetchBlogs(currentPage);
        }
    }, [selectedDate]);

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
    const fetchBlogs = async (page = currentPage) => {
        if (!accessToken) {
            return;
        }

        // If we have a date filter active, don't run the regular fetch
        if (isDateFiltered) {
            return;
        }

        try {
            let response;

            if (isFiltered && selectedTagIds.length > 0) {
                // Make a POST request to the filter API with the correct endpoint
                response = await fetch(`http://localhost:8080/api/blogs/getByTagIDs?page=${page}&limit=7`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tag_ids: selectedTagIds
                    })
                });
            } else {
                // Make the normal GET request for unfiltered blogs
                response = await fetch(`http://localhost:8080/api/blogs?page=${page}&limit=7`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            if (response.ok) {
                const data = await response.json();

                if (data.total_pages) {
                    setTotalPages(data.total_pages);
                }
                if (data.blogs) {
                    // Convert blogs object to array of entries, reverse it, and convert back to object
                    const reversedBlogs = Object.entries(data.blogs)
                        .reverse()
                        .reduce((acc, [date, blog]) => {
                            acc[date] = blog;
                            return acc;
                        }, {});

                    setRealBlogs(reversedBlogs);
                    setSingleBlog(null); // Clear any single blog when viewing multiple blogs

                    // Collect all unique tag IDs from all blogs
                    const allTagIds = Object.values(reversedBlogs)
                        .filter(blog => blog.tagIds)
                        .flatMap(blog => blog.tagIds);

                    if (allTagIds.length > 0) {
                        const tags = await fetchTagsByIds(allTagIds);
                        // Create a mapping of blog IDs to their tags
                        const tagMapping = {};
                        Object.values(reversedBlogs).forEach(blog => {
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

    // New function to fetch blog by date
    const fetchBlogByDate = async (date) => {
        if (!accessToken || !date) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/blog/date/${date}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.blog) {
                    // Create a "fake" blogs object with just this one blog
                    const singleBlogObj = {
                        [date]: data.blog
                    };
                    setRealBlogs(singleBlogObj);
                    setSingleBlog(data.blog);

                    // Fetch tags for this blog if it has any
                    if (data.blog.tagIds && data.blog.tagIds.length > 0) {
                        const tags = await fetchTagsByIds(data.blog.tagIds);
                        const tagMapping = {};
                        tagMapping[data.blog.id] = tags.filter(tag =>
                            data.blog.tagIds.includes(tag.ID)
                        );
                        setBlogTags(tagMapping);
                    } else {
                        setBlogTags({});
                    }
                } else {
                    // If no blog found for this date
                    setRealBlogs({});
                    setSingleBlog(null);
                    setBlogTags({});
                }
            } else {
                console.error('Failed to fetch blog by date');
                // Clear blogs if there's an error
                setRealBlogs({});
                setSingleBlog(null);
            }
        } catch (error) {
            console.error('Error fetching blog by date:', error);
            // Clear blogs if there's an error
            setRealBlogs({});
            setSingleBlog(null);
        }
    };

    // Update useEffect to use the new fetchBlogs function
    useEffect(() => {
        if (!isDateFiltered) {
            fetchBlogs(currentPage);
        }
    }, [accessToken, currentPage, isFiltered, selectedTagIds, isDateFiltered]);

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
        //console.log(`Tag clicked: ${tag}`);
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

            const response = await fetch('http://localhost:8080/api/tag/set', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Refresh the blogs data immediately after adding tag
                if (isDateFiltered && selectedDate) {
                    await fetchBlogByDate(selectedDate);
                } else {
                    await fetchBlogs();
                }
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

        return Object.keys(realBlogs).includes(formattedDate);
    };

    // Add new function to remove tag
    const removeTagFromBlog = async (tagText, blogDate) => {
        try {
            const payload = {
                text: tagText,
                date: blogDate
            };

            const response = await fetch('http://localhost:8080/api/tag/remove', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (isDateFiltered && selectedDate) {
                    await fetchBlogByDate(selectedDate);
                } else {
                    await fetchBlogs(); // Refresh the blogs data
                }
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

    // Add handlers for pagination buttons
    const handleNextPage = () => {
        if (currentPage - 1 >= 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage + 1 >= totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFilterApply = (tagIds) => {
        // Use a callback function for state that depends on previous state
        setCurrentPage(1);
        setSelectedTagIds(tagIds);
        setIsFiltered(tagIds.length > 0);

        // Clear date filter if tag filter is applied
        if (tagIds.length > 0 && onDateSelect) {
            onDateSelect(null);
        }

        // Use setState callback to ensure we have latest state
        // We don't need to call fetchBlogs directly, the useEffect will handle it
        // when the state values change
    };

    const handleClearFilters = () => {
        setSelectedTagIds([]);
        setIsFiltered(false);
        if (onDateSelect) {
            onDateSelect(null);
        }
        // Fetch unfiltered data
        fetchBlogs(currentPage);
    };

    return (
        <div
            id="blog-list-main"
            className="h-full flex flex-col gap-4 hide-scrollbar"
            style={{
                overflow: 'auto'
            }}
        >
            <style jsx global>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                #blog-list-main::-webkit-scrollbar,
                .hide-scrollbar::-webkit-scrollbar {
                    display: none !important;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                #blog-list-main,
                .hide-scrollbar {
                    -ms-overflow-style: none !important;  /* IE and Edge */
                    scrollbar-width: none !important;  /* Firefox */
                }
            `}</style>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">
                    {isDateFiltered ? `Blog for ${selectedDate}` : "My Blogs"}
                </h2>
                <div className="flex items-center gap-2">
                    <Filter
                        onFilter={handleFilterApply}
                        onClearFilters={handleClearFilters}
                    />
                    {!isDateFiltered && (
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ArrowBackIcon />}
                                onClick={handlePrevPage}
                                disabled={currentPage >= totalPages}
                                sx={{
                                    minWidth: '40px',
                                    padding: '4px 8px',
                                    borderColor: currentPage >= totalPages ? '#9e9e9e' : 'primary.main',
                                    color: currentPage >= totalPages ? '#616161' : 'primary.main',
                                    '&.Mui-disabled': {
                                        borderColor: '#9e9e9e',
                                        color: '#616161',
                                        opacity: 0.8,
                                    },
                                    '&:hover': {
                                        borderColor: currentPage >= totalPages ? '#757575' : 'primary.dark',
                                        backgroundColor: currentPage >= totalPages ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)',
                                    }
                                }}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={handleNextPage}
                                disabled={currentPage <= 1}
                                sx={{
                                    minWidth: '40px',
                                    padding: '4px 8px',
                                    borderColor: currentPage <= 1 ? '#9e9e9e' : 'primary.main',
                                    color: currentPage <= 1 ? '#616161' : 'primary.main',
                                    '&.Mui-disabled': {
                                        borderColor: '#9e9e9e',
                                        color: '#616161',
                                        opacity: 0.8,
                                    },
                                    '&:hover': {
                                        borderColor: currentPage <= 1 ? '#757575' : 'primary.dark',
                                        backgroundColor: currentPage <= 1 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)',
                                    }
                                }}
                            >
                                Next
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        size="small"
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
            </div>

            <div className="overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {Object.keys(realBlogs).length === 0 && isDateFiltered && (
                    <Card className="mb-4 p-4 text-center">
                        <Typography variant="body1">
                            No blog found for {selectedDate}.
                            <Button
                                onClick={() => handleCreateBlog()}
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                Create one?
                            </Button>
                        </Typography>
                    </Card>
                )}

                {Object.keys(realBlogs).length === 0 && !isDateFiltered && (
                    <Card className="mb-4 p-4 text-center">
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Wow, so empty!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            No blogs found
                        </Typography>
                    </Card>
                )}

                {realBlogs && Object.entries(realBlogs).map(([date, blog]) => (
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
                            {/* Gradient overlay at the top */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '30%',
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                                    zIndex: 1
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    left: 10,
                                    zIndex: 2,
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTagClick(tag.text);
                                            }}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddTags(blog.id, date);
                                    }}
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
                                {blog.title || new Date(date.replace(/-/g, '/')).toLocaleDateString(undefined, { weekday: 'long' })} {/* Get day name if no title */}
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