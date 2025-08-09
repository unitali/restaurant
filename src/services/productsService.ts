import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { ProductType } from "../types";
import { removeImage } from "./imagesServices";

export async function fetchProductsByRestaurantId(restaurantId: string) {
    if (!restaurantId) throw new Error("restaurantId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    return data.products || [];
}

export async function fetchProductById(restaurantId: string, productId: string) {
    if (!restaurantId || !productId) throw new Error("restaurantId ou productId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const product = data.products?.find((p: { id: string }) => p.id === productId);

    if (!product) {
        throw new Error("Produto não encontrado");
    }

    return product;
}

export async function addProduct(restaurantId: string, product: ProductType) {
    if (!restaurantId) throw new Error("restaurantId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const products = data.products || [];

    const cleanProduct = Object.entries(product).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;
        if (key === "price" && typeof value === "string") {
            acc[key] = parseFloat(value);
        } else {
            acc[key] = value;
        }

        return acc;
    }, {} as Record<string, any>);

    if (!cleanProduct.id) {
        cleanProduct.id = Date.now().toString();
    }

    products.push(cleanProduct);

    await updateDoc(restaurantRef, { products });

    return cleanProduct;
}

export const deleteProduct = async (restaurantId: string, productId: string) => {
    if (!restaurantId || !productId) throw new Error("restaurantId ou productId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }
    const data = restaurantSnap.data();
    const products = data.products || [];
    const productToDelete = products.find((p: ProductType) => p.id === productId);
    if (productToDelete?.image?.path) {
        try {
            await removeImage(productToDelete.image.path);
        } catch (imageError) {
            console.error("Erro ao remover imagem do Storage:", imageError);
        }
    }
    const updatedProducts = products.filter((p: { id: string }) => p.id !== productId);
    await updateDoc(restaurantRef, { products: updatedProducts });
};

export const updateProduct = async (restaurantId: string, product: ProductType) => {
    if (!restaurantId || !product.id) throw new Error("restaurantId ou productId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const products = data.products || [];
    const productIndex = products.findIndex((p: ProductType) => p.id === product.id);

    if (productIndex === -1) {
        throw new Error("Produto não encontrado");
    }

    const cleanProduct = Object.entries(product).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;
        if (key === "price" && typeof value === "string") {
            acc[key] = parseFloat(value);
        } else {
            acc[key] = value;
        }

        return acc;
    }, {} as Record<string, any>);

    products[productIndex] = { ...products[productIndex], ...cleanProduct };

    await updateDoc(restaurantRef, { products });

    return products[productIndex];
};
