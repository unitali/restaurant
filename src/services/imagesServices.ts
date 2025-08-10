import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

export interface ImageParams {
  file: File;
  restaurantId: string;
  oldImagePath?: string;
}

function ensureRestaurantId(id?: string) {
  if (!id) throw new Error("restaurantId ausente");
  if (/[\\/]/.test(id)) throw new Error("restaurantId inválido");
}

function uniqueFileName() {
  return `${Date.now()}_${Math.random().toString(36).slice(2,8)}.jpg`;
}

function buildPath(restaurantId: string) {
  return `products/${restaurantId}/${uniqueFileName()}`;
}

export async function uploadImage({ file, restaurantId }: ImageParams) {
  ensureRestaurantId(restaurantId);
  const processed = await processFileForUpload(file);
  const path = buildPath(restaurantId);
  const url = await uploadToStorage(processed, path);
  return { url, path };
}

export async function updateImage({ file, oldImagePath, restaurantId }: ImageParams) {
  ensureRestaurantId(restaurantId);
  const processed = await processFileForUpload(file);
  const [, uploadRes] = await Promise.allSettled([
    oldImagePath ? removeImage(oldImagePath) : Promise.resolve(),
    (async () => {
      const path = buildPath(restaurantId);
      const url = await uploadToStorage(processed, path);
      return { url, path };
    })()
  ]);
  if (uploadRes.status === "rejected") throw uploadRes.reason;
  return uploadRes.value;
}

export async function removeImage(imagePath: string) {
  try {
    await deleteObject(ref(storage, imagePath));
  } catch {
    /* silencioso */
  }
}

function validateImageFile(file: File, maxMB = 5) {
  if (!file.type.startsWith("image/")) throw new Error("Arquivo não é imagem.");
  if (file.size > maxMB * 1024 * 1024) throw new Error(`Máximo ${maxMB}MB.`);
}

async function processFileForUpload(file: File): Promise<File> {
  validateImageFile(file);
  const compress = file.size > 300 * 1024;
  if (!compress && file.type === "image/jpeg") return file;
  return await compressImage(file, {
    maxWidth: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
    maxHeight: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
    quality: file.size > 2 * 1024 * 1024 ? 0.7 : 0.8
  });
}

async function compressImage(
  file: File,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.8 }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const r = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * r);
        height = Math.floor(height * r);
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        b => {
          if (!b) return reject(new Error("Falha compressão"));
            resolve(new File([b], "image.jpg", { type: "image/jpeg", lastModified: Date.now() }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Falha leitura imagem"));
    img.src = URL.createObjectURL(file);
  });
}

async function uploadToStorage(file: File, path: string) {
  const r = ref(storage, path);
  const snap = await uploadBytes(r, file);
  return await getDownloadURL(snap.ref);
}