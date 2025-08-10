import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import { useRestaurant } from "../contexts/RestaurantContext";
import type { ImageParams } from "../types";

function validateRestaurantId(id: string) {
    if (!id) throw new Error("restaurantId ausente");
    if (/[\/\\]/.test(id)) throw new Error("restaurantId inválido");
}

function buildFileName() {
    return `${Date.now()}.jpg`;
}

function buildPath(restaurantId: string) {
    const fileName = buildFileName();
    return `products/${restaurantId}/${fileName}`;
}

export async function uploadImage({ file }: ImageParams) {
    const { restaurantId } = useRestaurant();
    try {
        validateRestaurantId(restaurantId);
        const processedFile = await processFileForUpload(file);
        const imagePath = buildPath(restaurantId);
        const downloadURL = await uploadToStorage(processedFile, imagePath);
        return { url: downloadURL, path: imagePath };
    } catch (error) {
        console.error("Erro ao fazer upload da imagem: ", error);
        throw new Error("Falha no upload da imagem");
    }
}

export async function updateImage({ file, oldImagePath }: ImageParams) {
    const { restaurantId } = useRestaurant();
    try {
        validateRestaurantId(restaurantId);
        const processedFile = await processFileForUpload(file);

        const [, uploadResult] = await Promise.allSettled([
            oldImagePath ? removeImage(oldImagePath) : Promise.resolve(),
            (async () => {
                const imagePath = buildPath(restaurantId);
                const downloadURL = await uploadToStorage(processedFile, imagePath);
                return { url: downloadURL, path: imagePath };
            })()
        ]);

        if (uploadResult.status === "rejected") throw uploadResult.reason;
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
    if (!file.type.startsWith("image/")) {
        throw new Error("Por favor, selecione apenas arquivos de imagem.");
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
    options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<File> {
    const {
        maxWidth = 1200,
        maxHeight = 1200,
        quality = 0.8
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
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
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error("Falha na compressão da imagem"));
                    const newFile = new File(
                        [blob],
                        "compressed.jpg",
                        { type: "image/jpeg", lastModified: Date.now() }
                    );
                    resolve(newFile);
                },
                "image/jpeg",
                quality
            );
        };
        img.onerror = () => reject(new Error("Falha ao carregar imagem para compressão"));
        img.src = URL.createObjectURL(file);
    });
}

async function processFileForUpload(file: File): Promise<File> {
    validateImageFile(file);
    const shouldCompress = file.size > 300 * 1024; // compressão leve
    if (shouldCompress) {
        const compressionOptions = {
            maxWidth: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
            maxHeight: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
            quality: file.size > 2 * 1024 * 1024 ? 0.7 : 0.8
        };
        return await compressImage(file, compressionOptions);
    }

    // Se não for comprimir e não for jpeg, converte para jpeg garantindo extensão final .jpg
    if (file.type !== "image/jpeg") {
        return await compressImage(file, { maxWidth: 2000, maxHeight: 2000, quality: 0.85 });
    }

    return file;
}