import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { RestaurantType } from "../types";

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
