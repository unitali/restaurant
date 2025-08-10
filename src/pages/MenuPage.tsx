import { useParams } from "react-router-dom";
import { HeaderMenu, ProductCarousel, Slider } from "../components";
import { CartProvider } from "../contexts/CartContext";
import { RestaurantProvider, useRestaurant } from "../contexts/RestaurantContext";
import type { CategoryType, ProductType } from "../types";
import { LoadingPage } from "./LoadingPage";
import { useState, useEffect } from "react";

export function MenuPage() {
  const { restaurantId } = useParams();

  return (
    <RestaurantProvider restaurantId={restaurantId!}>
      <CartProvider>
        <MenuContent />
      </CartProvider>
    </RestaurantProvider>
  );
}

function MenuContent() {
  const { restaurant, loading } = useRestaurant();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    setProducts(Array.isArray(restaurant?.products) ? restaurant!.products : []);
    setCategories(Array.isArray(restaurant?.categories) ? restaurant!.categories : []);
  }, [restaurant]);

  if (loading) return <LoadingPage />;
  if (!restaurant) return null;

  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <HeaderMenu />
      <main className="max-w-xl w-full mx-auto px-2 pt-20">
        <section className="my-6">
          <h2 className="text-xl font-bold mb-2">Destaques</h2>
          <Slider
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
    </>
  );
}
