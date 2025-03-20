import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage(); // Ensure you have initialized Firebase Storage

export const deleteImageFromFirebase = async (imageUrl) => {
  if (!imageUrl) return;

  const storageRef = ref(storage, imageUrl);
  try {
    await deleteObject(storageRef);
    console.log("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
