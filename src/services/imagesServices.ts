import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import type { ImageParams, ImageType } from "../types";

export async function uploadImage({ ...props }: ImageParams): Promise<ImageType> {
    try {
        validateImageFile(props.file);

        const imageId = generateUniqueFileName();

        const imagePath = `${props.folder}/${imageId}`;
        const imageRef = ref(storage, imagePath);
        const snapshot = await uploadBytes(imageRef, props.file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            url: downloadURL,
            path: imagePath,
            imageId,
        };
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw new Error("Falha no upload da imagem");
    }
}

export async function updateImage({ ...props }: ImageParams) {
    try {
        validateImageFile(props.file);
        if (props.oldImagePath) {
            await removeImage(props.oldImagePath);
        }
        return await uploadImage({ file: props.file, folder: props.folder });
    } catch (error) {
        console.error("Erro ao atualizar imagem:", error);
        throw new Error("Falha ao atualizar imagem");
    }
}

export async function removeImage(imagePath: string) {
    try {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    } catch (error) {
        console.error("Erro ao remover imagem:", error);
        throw new Error("Falha ao remover imagem");
    }
}

function validateImageFile(file: File, maxSizeInMB: number = 5): boolean {

    if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem.');
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        throw new Error(`A imagem deve ter no máximo ${maxSizeInMB}MB.`);
    }

    return true;
}

function generateUniqueFileName() {
    return Date.now().toString();
}