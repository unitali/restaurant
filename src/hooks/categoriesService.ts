import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { CategoryType } from '../types';
import { today } from "../utils/date";
import { deleteProduct } from "./productsService";



export async function addCategory(restaurantId: string, category: CategoryType) {
  if (!restaurantId) throw new Error("restaurantId não informado!");

  const restaurantRef = doc(db, "restaurants", restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurante não encontrado");
  }

  const newCategory = {
    id: Date.now().toString(),
    name: category.name,
    description: category.description,
    createdAt: today()
  };

  await updateDoc(restaurantRef, {
    categories: arrayUnion(newCategory),
  });

  return newCategory.id;
}

export async function fetchCategoriesByRestaurantId(restaurantId: string) {
  if (!restaurantId) throw new Error("restaurantId não informado!");

  const restaurantRef = doc(db, "restaurants", restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurante não encontrado");
  }

  const data = restaurantSnap.data();
  return data.categories || [];
}

export const deleteCategory = async (restaurantId: string, categoryId: string) => {
  if (!restaurantId || !categoryId) throw new Error("restaurantId ou categoryId não informado!");

  const restaurantRef = doc(db, "restaurants", restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurante não encontrado");
  }
  const data = restaurantSnap.data();
  const categories = data.categories || [];
  const products = data.products || [];

  const updatedCategories = categories.filter((c: { id: string }) => c.id !== categoryId);

  const productsToDelete = products.filter((p: { categoryId: string }) => p.categoryId === categoryId);
  for (const p of productsToDelete) {
    await deleteProduct(restaurantId, p.id);
  }

  await updateDoc(restaurantRef, {
    categories: updatedCategories
  });
};

export const updateCategory = async (restaurantId: string, category: CategoryType) => {
    if (!restaurantId || !category.id) throw new Error("restaurantId ou categoryId não informado!");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
        throw new Error("Restaurante não encontrado");
    }

    const data = restaurantSnap.data();
    const categories = data.categories || [];
    const categoryIndex = categories.findIndex((c: CategoryType) => c.id === category.id);

    if (categoryIndex === -1) {
        throw new Error("Categoria não encontrada");
    }

    const cleanCategory = Object.entries(category).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;
        acc[key] = value;
        return acc;
    }, {} as Record<string, any>);

    categories[categoryIndex] = { ...categories[categoryIndex], ...cleanCategory };

    await updateDoc(restaurantRef, { categories });

    return categories[categoryIndex];
};
