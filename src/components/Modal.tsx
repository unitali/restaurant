import React from 'react';
import { FaTimesCircle } from "react-icons/fa";


export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    id: string;
}

export function Modal({ ...props }: ModalProps) {
    if (!props.isOpen) return null;

    return (
        <div
            id={props.id}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div className="bg-unitali-blue-50 text-unitali-blue-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <FaTimesCircle
                    id={`icon-close-modal-${props.id}`}
                    onClick={props.onClose}
                    className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                />
                {props.children}
            </div>
        </div>
    );
}