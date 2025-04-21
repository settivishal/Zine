import { useState, useEffect } from 'react';
import { useAuth } from './authcontext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useProfile = () => {
    const [profileImage, setProfileImage] = useState('/profile2.jpg'); // Default fallback image
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (!accessToken) return;

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/profile`, {
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
    }, [accessToken]);

    return { profileImage, loading, error };
};

export default useProfile; 