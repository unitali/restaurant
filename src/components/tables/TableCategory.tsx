import { FaEdit, FaTrash } from "react-icons/fa";
import type { CategoryType } from "../../types";

interface TableCategoryProps {
  categories: CategoryType[];
  search: string;
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

export function TableCategory(props: TableCategoryProps) {
  const filteredCategories = props.categories.filter(category =>
    category.name.toLowerCase().includes(props.search.toLowerCase())
  );

  if (filteredCategories.length === 0) {
    return (
      <p id="no-categories-message" className="text-gray-500 text-center">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <table id="admin-categories-table"
      className="w-full max-w-2xl md:max-w-none mx-auto px-2 overflow-x-auto">
      <thead>
        <tr className="bg-unitali-blue-600 text-white">
          <th id="category-name-header" className="p-2 text-left">Nome</th>
          <th id="category-description-header" className="p-2 text-left">Descrição</th>
          <th id="category-actions-header" className="p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        {filteredCategories.map((category, idx) => (
          <tr
            key={category.id}
            className={idx % 2 === 0 ? "bg-unitali-blue-50" : "bg-unitali-blue-100"}
          >
            <td id={`category-name-${idx}`} className="p-2 text-left">{category.name}</td>
            <td id={`category-description-${idx}`} className="p-2 text-left">{category.description}</td>
            <td className="p-2 w-16 align-middle">
              <div id={`category-actions-${idx}`}
                className="flex items-center justify-center gap-4 h-full">
                <FaEdit
                  id={`category-edit-${idx}`}
                  type="button"
                  size={18}
                  className="text-unitali-blue-600 hover:text-unitali-blue-500 hover:cursor-pointer"
                  onClick={() => props.onEdit(category)}
                  title="Editar categoria"
                />
                <FaTrash
                  id={`category-delete-${idx}`}
                  type="button"
                  size={18}
                  className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                  onClick={() => props.onDelete(category)}
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