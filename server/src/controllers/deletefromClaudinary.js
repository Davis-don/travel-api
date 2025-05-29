import dotenv from "dotenv";
import crypto from "crypto";
import fetch from "node-fetch"; // Ensure it's installed via npm
import FormData from "form-data"; // Required for multipart form data

// Load environment variables
dotenv.config();

export const deleteCloudinaryImage = async (imageId) => {
  if (!imageId) {
    console.error("No imageId provided");
    return false;
  }

  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary configuration is missing. Please check your environment variables.");
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000); // Generate timestamp
  const stringToSign = `public_id=${imageId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  const formData = new FormData();
  formData.append("public_id", imageId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Image deleted successfully:", result);
      return true;
    } else {
      console.error("Error deleting image:", result);
      return false;
    }
  } catch (error) {
    console.error("Error making API request:", error);
    return false;
  }
};