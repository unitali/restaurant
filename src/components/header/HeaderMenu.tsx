import { useEffect, useState } from "react";
import { FaCartShopping } from 'react-icons/fa6';
import { useCart } from "../../contexts/CartContext";
import { Cart } from "../cart";

export function HeaderMenu() {
    const [openCart, setOpenCart] = useState(false);
    const { cart } = useCart();


    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    useEffect(() => {
        if (openCart && cart.length === 0) {
            setOpenCart(false);
        }
    }, [cart, openCart]);

    return (
        <>
            <header className="bg-gray-800 p-4 flex justify-between items-center top-0 left-0 w-full z-50 fixed">
                <div className="text-white text-lg font-bold">
                    Restaurante Nome
                </div>
                {totalItems > 0 && (
                    <div className="flex items-center space-x-4 relative">
                        <FaCartShopping
                            type="button"
                            onClick={() => setOpenCart(true)}
                            className="text-white cursor-pointer"
                            size={24}
                        />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    </div>
                )}
            </header>

            {openCart && (
                <Cart isOpen={openCart} onClose={() => setOpenCart(false)} />
            )}
        </>
    );
}
