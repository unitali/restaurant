import type { ModalProps } from "..";
import type { ProductType } from "../../types";

interface ProductModalProps extends ModalProps {
    product?: ProductType;
}


export function ProductModal({ ...props }: ProductModalProps) {
    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button
                    onClick={props.onClose}
                    className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-white text-2xl"
                >
                    &times;
                </button>
                {props.children}
            </div>
        </div>
    );
}