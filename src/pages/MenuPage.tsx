import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

export function MenuPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const restDoc = await getDoc(doc(db, "restaurants", restaurantId!));
      if (restDoc.exists()) {
        const restData = { id: restDoc.id, ...restDoc.data() };
        setRestaurant(restData);

        const productsSnap = await getDocs(collection(db, `restaurants/${restDoc.id}/categories`));
        const productsList = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(productsList);
      }
    }
    if (restaurantId) fetchData();
  }, [restaurantId]);

  const handleSendWhatsApp = () => {
    const items = products.map(p => `${p.name} - €${p.price}`).join("\n");
    const url = `https://wa.me/${restaurant.phone}?text=${encodeURIComponent(items)}`;
    window.open(url, "_blank");
  };

  if (!restaurant) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      {products.map((p) => (
        <div key={p.id}>
          <p>{p.name} - €{p.price}</p>
        </div>
      ))}
      <button onClick={handleSendWhatsApp}>Enviar Pedido</button>
    </div>
  );
}
