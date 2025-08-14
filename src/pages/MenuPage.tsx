import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard, ProductCarousel, BannerMenu } from "../components";
import { CartProvider } from "../contexts/CartContext";
import { RestaurantProvider, useRestaurant } from "../contexts/RestaurantContext";
import type { CategoryType, ProductType } from "../types";
import { LoadingPage } from "./LoadingPage";

export function MenuPage() {
  const { restaurantId } = useParams();

  return (
    <RestaurantProvider restaurantId={restaurantId!}>
      <CartProvider>
        <div className="w-full max-w-2xl mx-auto">
          <BannerMenu />
          <Nav />
          <MenuContent />
        </div>
      </CartProvider>
    </RestaurantProvider>
  );
}

function Nav() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const { restaurant } = useRestaurant();
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setProducts(Array.isArray(restaurant?.products) ? restaurant!.products : []);
    setCategories(Array.isArray(restaurant?.categories) ? restaurant!.categories : []);
  }, [restaurant]);

  const scrollToCategory = (id: string) => {
    const ref = categoryRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="w-full max-w-2xl mx-auto bg-white z-40 shadow p-2 flex gap-4 overflow-x-auto sticky top-0">
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
  );
}

function MenuContent() {
  const { restaurant, loading } = useRestaurant();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setProducts(Array.isArray(restaurant?.products) ? restaurant!.products : []);
    setCategories(Array.isArray(restaurant?.categories) ? restaurant!.categories : []);
  }, [restaurant]);

  if (loading) return <LoadingPage />;
  if (!restaurant) return null;

  const featuredProducts = products.slice(0, 3);



  return (
    <main className="w-full mx-auto p-2 max-w-2xl bg-gray-50">
      <section className="my-6">
        <h2 className="text-xl font-bold mb-2">Destaques</h2>
        <ProductCarousel products={featuredProducts} />

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
            {products.length === 0 && <p className="text-gray-500">Nenhum produto cadastrado</p>}
            {products.length > 0 && products.map((product) => <ProductCard key={product.id} product={product} />)}
          </section>
        );
      })}
    </main>
  );
}
