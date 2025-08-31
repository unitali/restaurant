import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { storage } from "../config/firebase";
import type { ImageParams, ImageType } from "../types";

function buildPath(restaurantId: string) {
    return `${restaurantId}/${Date.now()}.jpg`;
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

function validateImageFile(file: File): void {
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
    validateImageFile(file);
    const compress = file.size > 300 * 1024;
    if (!compress && file.type === "image/jpeg") return file;
    return await compressImage(file, {
        maxWidth: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
        maxHeight: file.size > 4 * 1024 * 1024 ? 1000 : 1200,
        quality: file.size > 2 * 1024 * 1024 ? 0.7 : 0.8
    });
}

export function useImages() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const _upload = useCallback(async ({ file, restaurantId }: ImageParams): Promise<ImageType | null> => {
        try {
            const fileProcessed = await processFileForUpload(file);
            const path = buildPath(restaurantId);
            const storageRef = ref(storage, path);
            const snap = await uploadBytes(storageRef, fileProcessed);
            const url = await getDownloadURL(snap.ref);
            return { url, path, imageId: path.split("/").pop()!.replace(".jpg", "") };
        } catch (err) {
            throw err;
        }
    }, []);

    const _remove = useCallback(async (imagePath: string) => {
        if (!imagePath) return;
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef);
        } catch (err: any) {
            if (err.code === "storage/object-not-found") {
                console.warn(`Imagem em "${imagePath}" não encontrada para exclusão, mas o processo continuará.`);
            } else {
                throw err;
            }
        }
    }, []);

    const updateImage = useCallback(async (props: ImageParams): Promise<ImageType | null> => {
        setLoading(true);
        setError(null);
        try {
            if (props.oldImagePath) {
                await _remove(props.oldImagePath);
            }
            const newImage = await _upload({ file: props.file, restaurantId: props.restaurantId });
            return newImage;
        } catch (err) {
            console.error("Erro ao atualizar imagem:", err);
            const error = err instanceof Error ? err : new Error("Ocorreu um erro desconhecido.");
            setError(error);
            toast.error(error.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [_remove, _upload]);

    const removeImage = useCallback(async (imagePath: string) => {
        setLoading(true);
        setError(null);
        try {
            await _remove(imagePath);
        } catch (err) {
            console.error("Erro ao remover imagem:", err);
            const error = err instanceof Error ? err : new Error("Ocorreu um erro desconhecido.");
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [_remove]);

    return { loading, error, updateImage, removeImage, validateImageFile };
}