import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import type { CategoryType, ProductType } from '../types';
import { useProducts } from "./useProducts";

export function useCategories() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { deleteProduct, loading: productsLoading } = useProducts();

    const _getRestaurantDoc = async (restaurantId: string) => {
        if (!restaurantId) throw new Error("ID do restaurante não fornecido.");
        const restaurantRef = doc(db, "restaurants", restaurantId);
        const restaurantSnap = await getDoc(restaurantRef);
        if (!restaurantSnap.exists()) throw new Error("Restaurante não encontrado.");
        return { ref: restaurantRef, data: restaurantSnap.data() };
    };

    const fetchCategories = useCallback(async (restaurantId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await _getRestaurantDoc(restaurantId);
            const fetchedCategories = data.categories || [];
            setCategories(fetchedCategories);
            return fetchedCategories;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addCategory = useCallback(async (restaurantId: string, categoryData: Partial<CategoryType>) => {
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentCategories = data.categories || [];
            const newCategory = {
                ...categoryData,
                id: Date.now().toString(),
                createdAt: new Date(),
            };
            const updatedCategories = [...currentCategories, newCategory];
            await updateDoc(ref, { categories: updatedCategories });
            setCategories(updatedCategories);
            toast.success("Categoria adicionada com sucesso!");
            return newCategory;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao adicionar categoria: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCategory = useCallback(async (restaurantId: string, categoryData: CategoryType) => {
        if (!categoryData.id) {
            toast.error("ID da categoria é necessário para atualizar.");
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentCategories = data.categories || [];
            const categoryIndex = currentCategories.findIndex((c: CategoryType) => c.id === categoryData.id);
            if (categoryIndex === -1) throw new Error("Categoria não encontrada.");

            const updatedCategory = { ...currentCategories[categoryIndex], ...categoryData, updatedAt: new Date() };
            const updatedCategories = [...currentCategories];
            updatedCategories[categoryIndex] = updatedCategory;

            await updateDoc(ref, { categories: updatedCategories });
            setCategories(updatedCategories);
            toast.success("Categoria atualizada com sucesso!");
            return updatedCategory;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao atualizar categoria: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (restaurantId: string, categoryId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { ref, data } = await _getRestaurantDoc(restaurantId);
            const currentCategories = data.categories || [];
            const currentProducts = data.products || [];

            const productsToDelete = currentProducts.filter((p: ProductType) => p.categoryId === categoryId);
            for (const product of productsToDelete) {
                await deleteProduct(restaurantId, product.id);
            }

            const updatedCategories = currentCategories.filter((c: CategoryType) => c.id !== categoryId);
            await updateDoc(ref, { categories: updatedCategories });
            setCategories(updatedCategories);
            toast.success("Categoria e produtos associados foram removidos.");
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            toast.error(`Erro ao remover categoria: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [deleteProduct]);

    return {
        categories,
        loading: loading || productsLoading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    };
};