import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { RestaurantType } from "../types";

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

export async function createRestaurant(props: RestaurantType) {
  const data = {
    name: props.name,
    address: props.address,
    phone: props.phone,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "restaurants"), data);
  return docRef.id;
}
