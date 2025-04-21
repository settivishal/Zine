// Handles the initial Google login by redirecting the user to the Google auth URL

export const handleGoogleLogin = async (e) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  e.preventDefault();
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to initiate Google authentication");
    }

    const data = await response.json();

    if (data.auth_url) {
      window.location.href = data.auth_url;
    } else {
      throw new Error("Invalid authentication URL");
    }
  } catch (error) {
    console.error("Google login error:", error);
  }
};