import { FaShoppingBasket } from "react-icons/fa";
import { useOrder } from "../../contexts/OrderContext";
import { formatCurrencyBRL } from "../../utils/currency";

export function ButtonCartMenu({ handleOpenCart }: { handleOpenCart: () => void }) {
    const { total } = useOrder();
    return (
        <nav
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl flex justify-center cursor-pointer"
        >
            <button
                className="bg-red-600 text-white font-bold px-6 py-3 shadow-lg transition hover:bg-red-700 w-full flex items-center justify-center gap-2"
                onClick={handleOpenCart}
            >
                <FaShoppingBasket className="text-xl mx-2" />
                <span>{`Ver Carrinho (${formatCurrencyBRL(total)})`}</span>
            </button>
        </nav>
    )
}