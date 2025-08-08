import React, { useRef, useState } from 'react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { validateImageFile } from '../../services/imagesServices';

interface ImageUploadProps {
    label: string;
    value?: string;
    onChange: (file: File | null) => void;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    classNameLabel?: string;
}

export function ImageUpload({ ...props }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(props.value || null);
    const [touched, setTouched] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setTouched(true);

        if (file) {
            try {
                validateImageFile(file);

                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);

                props.onChange(file);
            } catch (error) {
                console.error("Erro na validação da imagem:", error);
            }
        }
    };

    const resetImage = () => {
        setPreview(null);
        props.onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        if (!props.disabled) {
            fileInputRef.current?.click();
        }
    };

    const isRequiredError = props.required && touched && !preview && !props.value;

    const containerClasses = `w-full p-3 pt-5 rounded border border-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 ${props.disabled ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-700 text-white"
        } ${isRequiredError ? "border-red-500" : ""}`;

    return (
        <div className="relative flex-1 mb-2">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute left-3 top-0 text-gray-400 text-sm z-10 ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>

            <div className={containerClasses}>
                {preview ? (
                    <div className="relative w-full h-32 flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg border border-gray-500"
                        />
                        {!props.disabled && (
                            <button
                                type="button"
                                onClick={resetImage}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 hover:cursor-pointer transition-colors"
                                aria-label="Remover imagem"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={triggerFileInput}
                        className={`w-full h-32 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-colors ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <FaCamera className="text-gray-400 mb-2" size={24} />
                        <span className="text-gray-400 text-sm">Clique para adicionar imagem</span>
                        <span className="text-gray-500 text-xs mt-1">JPG, PNG, GIF - Max: 5MB</span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={props.disabled}
                id={`input-${props.id}`}
            />

            {isRequiredError && (
                <span className="text-red-500 text-xs absolute left-0 -bottom-5 px-4 font-bold">
                    Campo obrigatório
                </span>
            )}
        </div>
    );
}