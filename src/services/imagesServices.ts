import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import type { ImageParams, ImageType } from "../types";

function buildPath(restaurantId: string) {
  return `products/${restaurantId}/${Date.now()}.jpg`;
}

async function attemptClaimRefresh() {
  try {
    const fns = getFunctions(undefined, "southamerica-east1");
    const refresh = httpsCallable(fns, "refreshRestaurantClaim");
    await refresh({});
  } catch { }
}

async function fetchRestaurantIdFromUser(uid: string) {
  const snap = await getDoc(doc(getFirestore(), "users", uid));
  if (!snap.exists()) return undefined;
  return (snap.data() as any).restaurantId as string | undefined;
}

async function ensureRestaurantAccess(restaurantId: string) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  let token = await user.getIdTokenResult(true);
  let claim = token.claims.restaurantId as string | undefined;
  if (claim === restaurantId) return;
  if (claim && claim !== restaurantId) {
    throw new Error("Sem permissão.");
  }
  const docRestaurant = await fetchRestaurantIdFromUser(user.uid);
  if (docRestaurant !== restaurantId) throw new Error("Sem permissão.");
  attemptClaimRefresh();
}

export function validateImageFile(file: File): void {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Tipo de imagem inválido. Use JPG, PNG ou WEBP.");
  }
  if (file.size > maxSize) {
    throw new Error("Imagem muito grande. Máximo permitido: 5MB.");
  }
}

async function processFileForUpload(file: File): Promise<File> {
  await validateImageFile(file);
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
      canvas.toBlob(b => {
        if (!b) return reject(new Error("Falha compressão"));
        resolve(new File([b], "image.jpg", { type: "image/jpeg", lastModified: Date.now() }));
      }, "image/jpeg", quality);
    };
    img.onerror = () => reject(new Error("Falha leitura imagem"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage({ file, restaurantId }: ImageParams): Promise<ImageType> {
  await ensureRestaurantAccess(restaurantId);
  const fileProcessed = await processFileForUpload(file);
  const path = buildPath(restaurantId);
  const r = ref(storage, path);
  const snap = await uploadBytes(r, fileProcessed);
  const url = await getDownloadURL(snap.ref);
  return { url, path, imageId: path.split("/").pop()!.replace(".jpg", "") };
}

export async function updateImage(props: ImageParams): Promise<ImageType> {
  await ensureRestaurantAccess(props.restaurantId);
  if (props.oldImagePath) {
    try {
      removeImage(props.oldImagePath, props.restaurantId);
    } catch {
      throw new Error("Falha ao excluir imagem anterior.");
    }
  }
  return await uploadImage({ file: props.file, restaurantId: props.restaurantId });
}

export async function removeImage(pathOrId: string, restaurantId?: string) {

  let storagePath = pathOrId;
  if (restaurantId && !pathOrId.includes("/")) {
    storagePath = `products/${restaurantId}/${pathOrId}.jpg`;
  }
  const match = /^products\/([^/]+)\//.exec(storagePath);
  const restId = match?.[1] || restaurantId;
  if (restId) await ensureRestaurantAccess(restId);
  return await deleteObject(ref(storage, storagePath));
}