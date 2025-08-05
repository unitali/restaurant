import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function createRestaurant(restaurantId: string) {
  const data = {
    name: "Meu Restaurante",
    address: "Rua Exemplo, 123",
    phone: "(11) 99999-9999",
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, restaurantId, "company"), data);
  console.log("Restaurante criado!");
}
