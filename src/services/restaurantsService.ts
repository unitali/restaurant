import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { RestaurantType } from "../types";
import { today } from "../utils/date";

export const fetchRestaurants = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export async function fetchRestaurantById(restaurantId: string) {
  const restaurantRef = doc(db, "restaurants", restaurantId);
  const restaurantSnap = await getDoc(restaurantRef);

  if (!restaurantSnap.exists()) {
    throw new Error("Restaurant not found");
  }
  return restaurantSnap.data().company;
}

export async function createRestaurant(props: RestaurantType) {
  const data = {
    company: {
      name: props.name,
      address: props.address,
      phone: props.phone,
      createdAt: props.createdAt || today(),
      status: props.status || "active",
    },
    categories: [],
    settings: [],
    orders: [],
  };

  const docRef = await addDoc(collection(db, "restaurants"), data);
  localStorage.setItem("restaurantId", docRef.id);
  return docRef.id;
}