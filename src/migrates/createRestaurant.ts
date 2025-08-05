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

  // Cria um documento com ID único na coleção "restaurants"
  const docRef = await addDoc(collection(db, "restaurants"), data);
  console.log("Restaurante criado com ID:", docRef.id);
}
