import { useState, useEffect } from 'react';

const useProfile = () => {
    const [profileImage, setProfileImage] = useState('/profile2.jpg'); // Default fallback image
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                setLoading(true);
                const accessToken = getCookie('accessToken');
                const response = await fetch('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                if (!data.image) {
                    // If image is null, use the avatar service with username
                    const avatarUrl = `https://avatar.iran.liara.run/public?username=${data.name || data.email || 'user'}`;
                    setProfileImage(avatarUrl);
                } else {
                    setProfileImage(data.image);
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileImage();
    }, []);

    return { profileImage, loading, error };
};

export default useProfile; 