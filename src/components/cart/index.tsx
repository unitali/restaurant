import { useCart } from "../../contexts/CartContext";

export function Cart() {
    const { cart, removeFromCart, clearCart } = useCart();

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Carrinho de Compras</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id} className="flex items-center justify-between border-b py-2">
                        <div>
                            <span className="font-semibold">{item.name}</span>
                            <span className="ml-2 text-gray-600">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-700 font-semibold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                                className="text-red-500 hover:underline text-xs"
                                onClick={() => removeFromCart(item.id!)}
                            >
                                Remover
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={clearCart}
            >
                Limpar Carrinho
            </button>
        </div>
    );
}
