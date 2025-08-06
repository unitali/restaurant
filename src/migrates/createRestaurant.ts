import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Restaurant } from "../types/restaurantsTypes";

export async function createRestaurant(props: Restaurant) {
  const data = {
    name: props.name,
    address: props.address,
    phone: props.phone,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "restaurants"), data);
  return docRef.id;
}
