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
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
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

export async function validateImageFile(
  file: File,
  options: {
    maxMB?: number;
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<void> {
  const {
    maxMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    minWidth,
    minHeight
  } = options;

  if (!file) throw new Error("Nenhum arquivo selecionado.");

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Tipo inválido. Permitidos: ${allowedTypes
        .map(t => t.split("/")[1])
        .join(", ")}.`
    );
  }

  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Arquivo excede ${maxMB}MB.`);
  }

  if (minWidth || minHeight) {
    const dims = await getImageDimensions(file);
    if (minWidth && dims.width < minWidth) {
      throw new Error(`Largura mínima é ${minWidth}px (recebido ${dims.width}px).`);
    }
    if (minHeight && dims.height < minHeight) {
      throw new Error(`Altura mínima é ${minHeight}px (recebido ${dims.height}px).`);
    }
  }
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    img.src = URL.createObjectURL(file);
  });
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