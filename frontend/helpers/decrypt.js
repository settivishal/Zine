/**
 * Decrypts a Base64-encoded encrypted string that was produced
 * by concatenating a 12-byte nonce and the ciphertext (with the auth tag appended)
 * using AES-GCM.
 *
 * @param {string} encryptedData - The Base64-encoded encrypted data (nonce || ciphertext).
 * @param {string} keyString - The plaintext key as a string; must be 32 characters (32 bytes) for AES-256.
 * @returns {Promise<string>} The decrypted plaintext.
 */
async function decryptAuthUrl(encryptedData, keyString) {
    // Decode the Base64-encoded string into a Uint8Array
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
    // Extract the nonce (first 12 bytes) and ciphertext (the rest).
    const nonce = encryptedBytes.slice(0, 12);
    const ciphertext = encryptedBytes.slice(12);
  
    // Convert the plaintext key string into bytes.
    // (Ensure your key string is exactly 32 bytes; if not, adjust accordingly.)
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(keyString);
    if (keyBytes.length !== 32) {
      throw new Error(`Invalid key length: expected 32 bytes, got ${keyBytes.length}`);
    }
  
    // Import the key for use with the Web Crypto API.
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
  
    // Decrypt the ciphertext using AES-GCM with the extracted nonce.
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonce
      },
      cryptoKey,
      ciphertext
    );
  
    // Decode the decrypted ArrayBuffer into a UTF-8 string.
    return new TextDecoder().decode(decryptedBuffer);
  }
  
  // Example usage:
  (async () => {
    try {
      // Replace these with your actual values:
      const encryptedAuthUrl = "ENCRYPTED_AUTH_URL_BASE64";
      const plaintextKey = "YOUR_32_BYTE_PLAINTEXT_KEY__"; // Ensure this is 32 characters long
  
      const decryptedUrl = await decryptAuthUrl(encryptedAuthUrl, plaintextKey);
      console.log("Decrypted URL:", decryptedUrl);
  
      // Now you can redirect the browser to the decrypted URL.
      // window.location.href = decryptedUrl;
    } catch (err) {
      console.error("Decryption failed:", err);
    }
  })();

  
  export default decryptAuthUrl;