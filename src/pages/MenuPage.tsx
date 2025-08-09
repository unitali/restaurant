import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeaderMenu, ProductCarousel, } from "../components";
import { fetchCategoriesByRestaurantId } from "../services/categoriesService";
import { fetchProductsByRestaurantId } from "../services/productsService";
import type { CategoryType, ProductType } from "../types";
import { LoadingPage } from "./LoadingPage";
import { CartProvider } from "../contexts/CartContext";

export function MenuPage() {
  const { restaurantId } = useParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (restaurantId) {
        const [products, categories] = await Promise.all([
          fetchProductsByRestaurantId(restaurantId),
          fetchCategoriesByRestaurantId(restaurantId),
        ]);
        setProducts(products);
        setCategories(categories);
      }
      setLoading(false);
    }
    if (restaurantId) fetchData();
  }, [restaurantId]);

  if (loading) return <LoadingPage />;

  // Destaques: os 3 primeiros produtos (ajuste conforme sua lógica de destaque)
  const featuredProducts = products.slice(0, 3);

  return (
    <CartProvider>
      <HeaderMenu />
      <main className="max-w-xl w-full mx-auto px-2">
        <section className="my-6">
          <h2 className="text-xl font-bold mb-2">Destaques</h2>
          <ProductCarousel
            products={featuredProducts}
            autoSlide
            slideInterval={3000}
          />
        </section>
        {categories.map((category) => {
          const productsOfCategory = products.filter(
            (p) => p.categoryId === category.id
          );
          if (productsOfCategory.length === 0) return null;
          return (
            <section key={category.id} className="my-8">
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <ProductCarousel products={productsOfCategory} />
            </section>
          );
        })}
      </main>
    </CartProvider>
  );
}
