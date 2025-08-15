import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import type { ProductType } from "../types";
import { useImages } from "./useImages";

function cleanProductData(product: Partial<ProductType>): Partial<ProductType> {
    const cleaned = Object.entries(product).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, unknown>);
    return cleaned as Partial<ProductType>;
}

export function useProducts() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // 1. Chame o hook useImages no nível superior. Isso é permitido.
    const { removeImage, loading: imageLoading } = useImages();

    const _getRestaurantDoc = async (restaurantId: string) => {
        if (!restaurantId) throw new Error("ID do restaurante não fornecido.");
        const restaurantRef = doc(db, "restaurants", restaurantId);
        const restaurantSnap = await getDoc(restaurantRef);
        if (!restaurantSnap.exists()) throw new Error("Restaurante não encontrado.");
        return { ref: restaurantRef, data: restaurantSnap.data() };
    };

    const fetchProducts = useCallback(async (restaurantId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await _getRestaurantDoc(restaurantId);
            const fetchedProducts = data.products || [];
            setProducts(fetchedProducts);
            return fetchedProducts;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback(async (restaurantId: string, productData: ProductType) => {
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentProducts = data.products || [];

            const newProduct = {
                ...cleanProductData(productData),
                id: Date.now().toString(), // Garante um ID único
                createdAt: new Date(),
            };

            const updatedProducts = [...currentProducts, newProduct];
            await updateDoc(ref, { products: updatedProducts });

            setProducts(updatedProducts); // Atualiza o estado local
            toast.success("Produto adicionado com sucesso!");
            return newProduct;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao adicionar produto: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProduct = useCallback(async (restaurantId: string, productData: ProductType) => {
        if (!productData.id) {
            toast.error("ID do produto é necessário para atualizar.");
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentProducts = data.products || [];
            const productIndex = currentProducts.findIndex((p: ProductType) => p.id === productData.id);

            if (productIndex === -1) throw new Error("Produto não encontrado para atualizar.");

            const updatedProduct = {
                ...currentProducts[productIndex],
                ...cleanProductData(productData),
                updatedAt: new Date(),
            };

            const updatedProducts = [...currentProducts];
            updatedProducts[productIndex] = updatedProduct;

            await updateDoc(ref, { products: updatedProducts });

            setProducts(updatedProducts); // Atualiza o estado local
            toast.success("Produto atualizado com sucesso!");
            return updatedProduct;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao atualizar produto: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (restaurantId: string, productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentProducts = data.products || [];
            const productToDelete = currentProducts.find((p: ProductType) => p.id === productId);

            // 2. Use a função `removeImage` obtida do hook `useImages`.
            if (productToDelete?.image?.path) {
                await removeImage(productToDelete.image.path);
            }

            const updatedProducts = currentProducts.filter((p: ProductType) => p.id !== productId);
            await updateDoc(ref, { products: updatedProducts });

            setProducts(updatedProducts);
            toast.success("Produto removido com sucesso!");
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao remover produto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [removeImage]);

    return {
        products,
        loading: loading || imageLoading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    };
}