import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchRestaurants = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export async function fetchRestaurantById(id: string) {
  const snapshot = await getDocs(collection(db, "restaurants"));
  const restaurant = snapshot.docs.find(doc => doc.id === id);
  if (restaurant) {
    return { id: restaurant.id, ...restaurant.data() };
  } else {
    throw new Error("Restaurant not found");
  }
}
