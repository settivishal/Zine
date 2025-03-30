import decryptAuthURL from "./decrypt";
const handleGoogleLogin = async (e) => {
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
        const encryptionKey = "1sGJ7CIrKwdSRPVtC4rzJ0rO8pkGjfaX";
        const url = await decryptAuthURL(data.auth_url, encryptionKey);
        console.log("Redirecting to Google login page:", url);
        window.location.href = url;
      } else {
        throw new Error("Invalid authentication URL");
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (setErrorMessage) {
        setErrorMessage("Failed to initiate Google login");
      }
    }
  };

  export default handleGoogleLogin;