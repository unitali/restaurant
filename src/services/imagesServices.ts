import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import { useRestaurant } from "../contexts/RestaurantContext";
import type { ImageParams } from "../types";

function validateRestaurantId(id: string) {
    if (!id) throw new Error("restaurantId ausente");
    if (/[\/\\]/.test(id)) throw new Error("restaurantId inválido");
}

function sanitizeSegment(seg?: string) {
    if (!seg) return "";
    return seg.replace(/[^a-zA-Z0-9_\-]/g, "_");
}

function createImagePath(restaurantId: string, folder: string | undefined, imageId: string) {
    const base = `products/${restaurantId}`;
    const cleanFolder = sanitizeSegment(folder);
    return cleanFolder ? `${base}/${cleanFolder}/${imageId}` : `${base}/${imageId}`;
}

export async function uploadImage({ file, folder }: ImageParams) {
    const { restaurantId } = useRestaurant();
    try {
        validateRestaurantId(restaurantId);
        const processedFile = await processFileForUpload(file);
        const imageId = generateUniqueFileName();
        const imagePath = createImagePath(restaurantId, folder, imageId);
        const downloadURL = await uploadToStorage(processedFile, imagePath);
        return { url: downloadURL, path: imagePath, imageId };
    } catch (error) {
        console.error("Erro ao fazer upload da imagem: ", error);
        throw new Error("Falha no upload da imagem");
    }
}

export async function updateImage({ ...props }: ImageParams) {
    const { restaurantId } = useRestaurant();
    try {
        validateRestaurantId(restaurantId);
        const processedFile = await processFileForUpload(props.file);

        const [, uploadResult] = await Promise.allSettled([
            props.oldImagePath ? removeImage(props.oldImagePath) : Promise.resolve(),
            (async () => {
                const imageId = generateUniqueFileName();
                const imagePath = createImagePath(restaurantId, props.folder, imageId);
                const downloadURL = await uploadToStorage(processedFile, imagePath);
                return { url: downloadURL, path: imagePath, imageId };
            })()
        ]);

        if (uploadResult.status === 'rejected') {
            throw uploadResult.reason;
        }
        return uploadResult.value;
    } catch (error) {
        console.error("Erro ao atualizar imagem: ", error);
        throw new Error("Falha ao atualizar imagem");
    }
}

export async function removeImage(imagePath: string) {
    try {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    } catch (error) {
        console.error("Erro ao remover imagem: ", error);
        throw new Error("Falha ao remover imagem");
    }
}

export function validateImageFile(file: File, maxSizeInMB: number = 5): boolean {
    if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem.');
    }
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        throw new Error(`A imagem deve ter no máximo ${maxSizeInMB}MB.`);
    }
    return true;
}

const uploadToStorage = async (file: File, imagePath: string): Promise<string> => {
    const imageRef = ref(storage, imagePath);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
};

async function compressImage(
    file: File,
    options: { maxWidth?: number; maxHeight?: number; quality?: number; outputFormat?: string; } = {}
): Promise<File> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.8,
        outputFormat = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            canvas.width = width;
            canvas.height = height;
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
            }
            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error('Falha na compressão da imagem'));
                    const originalName = file.name;
                    const nameWithoutExt = originalName.includes('.')
                        ? originalName.substring(0, originalName.lastIndexOf('.'))
                        : originalName;
                    const newExtension =
                        outputFormat === 'image/png' ? '.png' :
                        outputFormat === 'image/jpeg' ? '.jpg' : '.jpg';
                    const compressedFile = new File(
                        [blob],
                        `${nameWithoutExt}_compressed${newExtension}`,
                        { type: outputFormat, lastModified: Date.now() }
                    );
                    resolve(compressedFile);
                },
                outputFormat,
                quality
            );
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem para compressão'));
        img.src = URL.createObjectURL(file);
    });
}

async function processFileForUpload(file: File): Promise<File> {
    validateImageFile(file);
    const shouldCompress = file.size > 500 * 1024;
    if (shouldCompress) {
        const compressionOptions = {
            maxWidth: file.size > 5 * 1024 * 1024 ? 1000 : 1200,
            maxHeight: file.size > 5 * 1024 * 1024 ? 1000 : 1200,
            quality: file.size > 2 * 1024 * 1024 ? 0.7 : 0.8,
            outputFormat: file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        };
        return await compressImage(file, compressionOptions);
    }
    return file;
}

const generateUniqueFileName = (): string =>
    `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;