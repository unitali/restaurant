import { FaEdit, FaFileImage, FaTrash } from "react-icons/fa";
import type { ProductType } from "../../types";
import { formatCurrencyBRL } from "../../utils/currency";

interface ProductTableProps {
    products: ProductType[];
    search: string;
    selectedCategory: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ProductTable(props: ProductTableProps) {
    const filteredProducts = props.products.filter(
        (product) =>
            product.name.toLowerCase().includes(props.search.toLowerCase()) &&
            (props.selectedCategory === "" || product.categoryId === props.selectedCategory)
    );

    if (filteredProducts.length === 0) {
        return (
            <p id="no-products-message" className="text-gray-500 text-center">
                Nenhum produto encontrado.
            </p>
        );
    }

    return (
        <table id="admin-products-table" className="w-full text-sm">
            <thead>
                <tr className="bg-teal-500 text-white">
                    <th id="product-image" className="p-4" style={{ width: 32, height: 32 }}></th>
                    <th id="product-name" className="p-2 text-left">Nome</th>
                    <th id="product-description" className="p-2 text-left">Descrição</th>
                    <th id="product-price" className="p-2 text-center">Preço</th>
                    <th id="product-actions" className="p-2 text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map((product, idx) => (
                    <tr
                        key={product.id}
                        className={idx % 2 === 0 ? "bg-gray-100" : "bg-teal-100"}
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
                                    className="text-teal-600 hover:text-teal-800 hover:cursor-pointer"
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