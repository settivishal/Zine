// Handles the initial Google login by redirecting the user to the Google auth URL
export const handleGoogleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8080/auth/google", {
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
      console.log("Redirecting to Google login page:", data.auth_url);
      window.location.href = data.auth_url;
    } else {
      throw new Error("Invalid authentication URL");
    }
  } catch (error) {
    console.error("Google login error:", error);
  }
};