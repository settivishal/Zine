'use client';
import { useState, useRef, useEffect } from 'react';
import { Button, Popover, Box, Chip, Typography, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useTags } from '../hooks/tagsContext';

const Filter = ({ onFilter, onClearFilters }) => {
    const { tags } = useTags();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const buttonRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTagSelect = (tag) => {
        if (selectedTags.some(t => t.ID === tag.ID)) {
            // If tag is already selected, remove it
            setSelectedTags(selectedTags.filter(t => t.ID !== tag.ID));
        } else {
            // Otherwise, add it
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleApplyFilters = () => {
        setActiveFilters(selectedTags);
        if (onFilter) {
            onFilter(selectedTags.map(tag => tag.ID));
        }
        handleClose();
    };

    const handleClearFilters = () => {
        setSelectedTags([]);
        setActiveFilters([]);
        if (onClearFilters) {
            onClearFilters();
        }
        handleClose();
    };

    // When active filters change, update selected tags
    useEffect(() => {
        setSelectedTags(activeFilters);
    }, [activeFilters]);

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <div>
            {/* Filter Button */}
            <Button
                ref={buttonRef}
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleClick}
                size="small"
                color={activeFilters.length > 0 ? "primary" : "inherit"}
                sx={{
                    borderColor: activeFilters.length > 0 ? 'primary.main' : 'grey.300',
                    '&:hover': {
                        borderColor: activeFilters.length > 0 ? 'primary.dark' : 'grey.400',
                    }
                }}
            >
                Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                    {activeFilters.map(tag => (
                        <Chip
                            key={tag.ID}
                            label={tag.text}
                            size="small"
                            sx={{
                                backgroundColor: tag.color,
                                color: 'white',
                            }}
                            onDelete={() => {
                                const newFilters = activeFilters.filter(t => t.ID !== tag.ID);
                                setActiveFilters(newFilters);
                                if (onFilter) {
                                    onFilter(newFilters.map(t => t.ID));
                                }
                            }}
                        />
                    ))}
                    {activeFilters.length > 0 && (
                        <Chip
                            label="Clear All"
                            size="small"
                            icon={<ClearIcon fontSize="small" />}
                            onClick={handleClearFilters}
                            variant="outlined"
                        />
                    )}
                </Box>
            )}

            {/* Filter Popover */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                        p: 2,
                        width: 300,
                        maxHeight: 400,
                    }
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Filter Blogs by Tags
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ maxHeight: 250, overflow: 'auto', mb: 2 }}>
                    {tags && tags.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {tags.map(tag => (
                                <Chip
                                    key={tag.ID}
                                    label={tag.text}
                                    onClick={() => handleTagSelect(tag)}
                                    sx={{
                                        backgroundColor: tag.color,
                                        color: 'white',
                                        border: selectedTags.some(t => t.ID === tag.ID)
                                            ? '2px solid black'
                                            : 'none',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.9,
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No tags available
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClearFilters}
                            disabled={selectedTags.length === 0}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApplyFilters}
                            disabled={selectedTags.length === 0}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
};

export default Filter;
