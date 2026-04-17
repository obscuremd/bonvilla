// src/lib/firebaseUploads.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

export async function uploadImages(
  files: File[],
): Promise<{ message: "success" | "error"; data: string[] }> {
  if (!files || files.length === 0) {
    return { message: "error", data: [] };
  }

  try {
    const uploadTasks = files.map(async (file) => {
      const imageRef = ref(storage, `files/${Date.now()}-${file.name}`);
      const upload = await uploadBytes(imageRef, file);
      return await getDownloadURL(upload.ref);
    });
    console.log(uploadTasks);

    const urls = await Promise.all(uploadTasks);

    return { message: "success", data: urls };
  } catch (err) {
    console.error("Upload failed:", err);
    return { message: "error", data: [] };
  }
}
