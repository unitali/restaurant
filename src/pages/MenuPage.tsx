import { useRef, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { HeaderMenu, ModalCheckout, ProductCard, ProductCarousel } from "../components";
import { OrderProvider, useOrder } from "../contexts/OrderContext";
import { RestaurantProvider, useRestaurant } from "../contexts/RestaurantContext";
import type { CategoryType, ProductType } from "../types";
import { formatCurrencyBRL } from "../utils/currency";
import { LoadingPage } from "./LoadingPage";

export function MenuPage() {
  const { restaurantId } = useParams();

  return (
    <RestaurantProvider restaurantId={restaurantId!}>
      <OrderProvider>
        <div className="w-full max-w-2xl mx-auto">
          <MenuContent />
        </div>
      </OrderProvider>
    </RestaurantProvider>
  );
}

function MenuContent() {
  const { restaurant, loading } = useRestaurant();
  const { cart, total } = useOrder();
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isAnyProductModalOpen, setIsAnyProductModalOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const products: ProductType[] = Array.isArray(restaurant?.products) ? restaurant!.products : [];
  const categories: CategoryType[] = Array.isArray(restaurant?.categories) ? restaurant!.categories : [];

  const scrollToCategory = (id: string) => {
    const ref = categoryRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) return <LoadingPage />;
  if (!restaurant) return null;

  const featuredProducts = products.slice(0, 3);

  const handleOpenCart = () => {
    setIsOpenCart(true);
    setIsAnyProductModalOpen(false);
  };

  return (
    <>
      <HeaderMenu />
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
      <main className="w-full mx-auto p-2 max-w-2xl bg-gray-50 relative">
        <section className="my-6">
          <h2 className="text-xl font-bold mb-2">Destaques</h2>
          <ProductCarousel
            products={featuredProducts}
            setIsAnyProductModalOpen={setIsAnyProductModalOpen}
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
                  if (category.id) categoryRefs.current[category.id] = el;
                }}
              >
                {category.name}
              </h3>
              {productsOfCategory.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  setIsAnyProductModalOpen={setIsAnyProductModalOpen}
                />
              ))}
            </section>
          );
        })}

        <ModalCheckout isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} />

        {cart && cart.length > 0 && !isAnyProductModalOpen && !isOpenCart && (
          <nav
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md flex justify-center"
            style={{ pointerEvents: "auto" }}
          >
            <button
              className="bg-red-600 text-white font-bold px-6 py-3 shadow-lg transition hover:bg-red-700 w-full flex items-center justify-center gap-2"
              onClick={handleOpenCart}
            >
              <FaShoppingBasket className="text-xl mx-2" />
              <span>{`Ver Carrinho (${formatCurrencyBRL(total)})`}</span>
            </button>
          </nav>
        )}
      </main>
    </>
  );
}
