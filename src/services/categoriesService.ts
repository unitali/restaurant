import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ProductType } from "../types";
import { today } from "../utils/date";

interface CategoryProps {
  restaurantId: string;
  id?: string;
  name: string;
  description: string;
  products: ProductType[];
}

export const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export async function fetchCategoryById(categoryId: string) {
  const snapshot = await getDocs(collection(db, "categories"));
  const category = snapshot.docs.find(doc => doc.id === categoryId);
  if (category) {
    return { id: category.id, ...category.data() };
  } else {
    throw new Error("Category not found");
  }
}

export async function addCategoryToRestaurant({ ...props }: CategoryProps) {
  const restaurantRef = doc(db, "restaurants", props.restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurante não encontrado");
  }

  const restaurantData = restaurantSnap.data();
  const categories = restaurantData.categories || [];

  const newCategory = {
    id: Date.now().toString(),
    name: props.name,
    description: props.description || "",
    createdAt: today(),
    products: [],
  };

  await updateDoc(restaurantRef, {
    categories: [...categories, newCategory],
  });

  return newCategory.id;
}
