import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export interface ImageUploadParams {
  file: File;
  restaurantId: string;
  oldPath?: string;
}
export interface ImageResult {
  url: string;
  path: string;
  imageId: string;
}

function ensureRestaurantId(id: string) {
  if (!id) throw new Error("restaurantId ausente");
  if (/[\\/]/.test(id)) throw new Error("restaurantId inválido");
}

function generateFileName() { return `${Date.now()}.jpg`; }
function buildPath(restaurantId: string) {
  return `products/${restaurantId}/${generateFileName()}`;
}

async function fetchRestaurantIdFromDoc(uid: string) {
  const snap = await getDoc(doc(getFirestore(), "users", uid));
  if (!snap.exists()) return undefined;
  return (snap.data() as any).restaurantId as string | undefined;
}

async function attemptClaimRefresh() {
  try {
    const fns = getFunctions(undefined, "southamerica-east1");
    const refresh = httpsCallable(fns, "refreshRestaurantClaim");
    await refresh({});
  } catch {}
}

async function ensureRestaurantAccess(restaurantId: string) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  // tenta claim
  let token = await user.getIdTokenResult(true);
  let claim = token.claims.restaurantId as string | undefined;
  if (claim === restaurantId) return;
  if (claim && claim !== restaurantId) {
    throw new Error("Sem permissão.");
  }

  // fallback via Firestore
  const docRestaurant = await fetchRestaurantIdFromDoc(user.uid);
  if (docRestaurant !== restaurantId) throw new Error("Sem permissão.");

  // tenta atualizar claim (não bloqueia)
  attemptClaimRefresh();
}

export async function validateImageFile(
  file: File,
  opts: { maxMB?: number; allowedTypes?: string[] } = {}
) {
  const { maxMB = 5, allowedTypes = ["image/jpeg", "image/png", "image/webp"] } = opts;
  if (!allowedTypes.includes(file.type)) throw new Error("Tipo de imagem inválido.");
  if (file.size > maxMB * 1024 * 1024) throw new Error(`Máximo ${maxMB}MB.`);
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

async function put(file: File, path: string): Promise<string> {
  const r = ref(storage, path);
  const snap = await uploadBytes(r, file);
  return await getDownloadURL(snap.ref);
}

export async function uploadImage({ file, restaurantId }: ImageUploadParams): Promise<ImageResult> {
  ensureRestaurantId(restaurantId);
  await ensureRestaurantAccess(restaurantId);
  const processed = await processFileForUpload(file);
  const path = buildPath(restaurantId);
  const url = await put(processed, path);
  return { url, path, imageId: path.split("/").pop()!.replace(".jpg", "") };
}

export async function updateImage({ file, oldPath, restaurantId }: ImageUploadParams): Promise<ImageResult> {
  ensureRestaurantId(restaurantId);
  await ensureRestaurantAccess(restaurantId);
  if (oldPath) { try { await deleteObject(ref(storage, oldPath)); } catch {} }
  const processed = await processFileForUpload(file);
  const path = buildPath(restaurantId);
  const url = await put(processed, path);
  return { url, path, imageId: path.split("/").pop()!.replace(".jpg", "") };
}

export async function removeImage(path: string) {
  const match = /^products\/([^/]+)\//.exec(path);
  const restaurantId = match?.[1];
  if (restaurantId) await ensureRestaurantAccess(restaurantId);
  await deleteObject(ref(storage, path));
}