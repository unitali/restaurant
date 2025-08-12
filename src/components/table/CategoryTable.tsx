import { FaEdit, FaTrash } from "react-icons/fa";
import type { CategoryType } from "../../types";

interface CategoryTableProps {
    categories: CategoryType[];
    search: string;
    onEdit: (category: CategoryType) => void;
    onDelete: (category: CategoryType) => void;
}

export function CategoryTable({
    categories,
    search,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredCategories.length === 0) {
        return (
            <p id="no-categories-message" className="text-gray-500 text-center">
                Nenhuma categoria encontrada.
            </p>
        );
    }

    return (
        <table id="admin-categories-table" className="w-full text-sm">
            <thead>
                <tr className="bg-teal-500 text-white">
                    <th id="category-name-header" className="p-2 text-left">Nome</th>
                    <th id="category-description-header" className="p-2 text-left">Descrição</th>
                    <th id="category-actions-header" className="p-2  text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredCategories.map((category, idx) => (
                    <tr
                        key={category.id}
                        className={idx % 2 === 0 ? "bg-gray-100" : "bg-teal-100"}
                    >
                        <td id={`category-name-${idx}`} className="p-2 text-left">{category.name}</td>
                        <td id={`category-description-${idx}`} className="p-2 text-left">{category.description}</td>
                        <td className="p-2 w-16 align-middle">
                            <div className="flex items-center justify-center gap-4 h-full">
                                <FaEdit
                                    id={`edit-category-${idx}`}
                                    type="button"
                                    size={18}
                                    className="text-teal-600 hover:text-teal-800 hover:cursor-pointer"
                                    onClick={() => onEdit(category)}
                                    title="Editar categoria"
                                />
                                <FaTrash
                                    id={`delete-category-${idx}`}
                                    type="button"
                                    size={18}
                                    className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                    onClick={() => onDelete(category)}
                                    title="Excluir categoria"
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}