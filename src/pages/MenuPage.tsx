import { useParams } from "react-router-dom";
import { Footer, HeaderMenu, ProductCarousel, Slider } from "../components";
import { CartProvider } from "../contexts/CartContext";
import { RestaurantProvider, useRestaurant } from "../contexts/RestaurantContext";
import type { CategoryType, ProductType } from "../types";
import { LoadingPage } from "./LoadingPage";
import { useState, useEffect, useRef } from "react";

export function MenuPage() {
  const { restaurantId } = useParams();

  return (
    <RestaurantProvider restaurantId={restaurantId!}>
      <CartProvider>
        <HeaderMenu />
        <MenuContent />
        <Footer />
      </CartProvider>
    </RestaurantProvider>
  );
}

function MenuContent() {
  const { restaurant, loading } = useRestaurant();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Cria refs para cada categoria
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setProducts(Array.isArray(restaurant?.products) ? restaurant!.products : []);
    setCategories(Array.isArray(restaurant?.categories) ? restaurant!.categories : []);
  }, [restaurant]);

  if (loading) return <LoadingPage />;
  if (!restaurant) return null;

  const featuredProducts = products.slice(0, 3);

  const scrollToCategory = (id: string) => {
    const ref = categoryRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav className="fixed top-15 left-1/2 -translate-x-1/2 w-full bg-white z-40 shadow p-2 flex gap-4 overflow-x-auto">
        {categories
          .filter(category =>
            products.some(product => product.categoryId === category.id)
          )
          .map((category) => (
            <button
              key={category.id}
              className="text-teal-700 font-semibold px-3 py-1 rounded hover:bg-teal-50 transition cursor-pointer"
              onClick={() => category.id && scrollToCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
      </nav>
      <main className="w-full mx-auto px-2 pt-28 pb-2 md:pb-12">
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
              <h3
                className="text-lg font-semibold mb-2 scroll-mt-30"
                ref={(el: HTMLHeadingElement | null) => {
                  if (category.id !== undefined) {
                    categoryRefs.current[category.id as string] = el;
                  }
                }}
              >
                {category.name}
              </h3>
              <ProductCarousel products={productsOfCategory} />
            </section>
          );
        })}
      </main>
    </>
  );
}
