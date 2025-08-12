import React from 'react';

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
            <div className="bg-teal-50 text-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button
                    id={`button-close-modal-${props.id}`}
                    onClick={props.onClose}
                    className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                >
                    &times;
                </button>
                {props.children}
            </div>
        </div>
    );
}