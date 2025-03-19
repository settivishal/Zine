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

// Handles the callback after Google authentication
export const handleGoogleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (!authCode) {
    console.error("No authorization code found in URL");
    return;
  }

  try {
    // Send the auth code to the backend to get access & refresh tokens
    const response = await fetch("http://localhost:8080/auth/google/callback?code=" + authCode, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch authentication tokens");
    }

    const data = await response.json();

    // Store tokens in local storage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    console.log("Authentication successful! Redirecting...");
    
    // Redirect to homepage
    window.location.href = "/";
  } catch (error) {
    console.error("Error handling Google callback:", error);
  }
};
