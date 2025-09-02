import { FaEdit, FaFileImage, FaTrash } from "react-icons/fa";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";

interface TableProductsProps {
    products: ProductType[];
    selectedCategory: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TableProducts(props: TableProductsProps) {
    const products = props.products;

    if (products.length === 0) {
        return (
            <p id="no-products-message" className="text-unitali-blue-500 text-center">
                Nenhum produto encontrado.
            </p>
        );
    }

    return (
        <table id="admin-products-table" className="w-full text-sm">
            <thead>
                <tr className="bg-unitali-blue-600 text-white">
                    <th id="product-image" className="p-4" style={{ width: 32, height: 32 }}></th>
                    <th id="product-name" className="p-2 text-left">Nome</th>
                    <th id="product-description" className="p-2 text-left">Descrição</th>
                    <th id="product-price" className="p-2 text-center">Preço</th>
                    <th id="product-actions" className="p-2 text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, idx) => (
                    <tr
                        key={product.id}
                        className={idx % 2 === 0 ? "bg-unitali-blue-50" : "bg-unitali-blue-100"}
                    >
                        <td id={`product-image-${idx}`} className="p-2" style={{ width: 60, height: 60 }}>
                            {product.image?.url ? (
                                <img
                                    src={product.image.url}
                                    alt={product.name}
                                    className="w-full object-cover rounded"
                                />
                            ) : (
                                <FaFileImage size={40} className="w-full object-cover rounded text-gray-400" />
                            )}
                        </td>
                        <td id={`product-name-${idx}`} className="p-2 text-left">{product.name}</td>
                        <td id={`product-description-${idx}`} className="p-2 text-left">{product.description}</td>
                        <td id={`product-price-${idx}`} className="p-2 w-32 text-center font-bold">{formatCurrencyBRL(product.price)}</td>
                        <td id={`product-actions-${idx}`} className="p-2 w-16 align-middle">
                            <div className="flex items-center justify-center gap-4 h-full">
                                <FaEdit
                                    id={`product-edit-${idx}`}
                                    size={18}
                                    className="text-unitali-blue-600 hover:text-unitali-blue-500 hover:cursor-pointer"
                                    onClick={() => props.onEdit(product.id!)}
                                    title="Editar produto"
                                />
                                <FaTrash
                                    id={`product-delete-${idx}`}
                                    size={18}
                                    className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                    onClick={() => props.onDelete(product.id!)}
                                    title="Excluir produto"
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}