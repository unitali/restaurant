import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { today } from "../utils/date";

interface CategoryProps {
  restaurantId: string;
  name: string;
  description?: string;
  products?: any[];
}

export async function addCategoryToRestaurant(props: CategoryProps) {
  if (!props.restaurantId) throw new Error("restaurantId não informado!");

  const restaurantRef = doc(db, "restaurants", props.restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurante não encontrado");
  }

  const newCategory = {
    id: Date.now().toString(),
    name: props.name,
    description: props.description || "",
    createdAt: today(),
    products: props.products || [],
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
