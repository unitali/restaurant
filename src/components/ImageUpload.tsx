import React, { useEffect, useRef, useState } from 'react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { validateImageFile } from '../hooks/imagesServices';
import type { ImageState } from '../types';
interface ImageUploadProps {
    id: string;
    disabled?: boolean;
    required?: boolean;
    classNameLabel?: string;
    initialUrl?: string | null;
    onStateChange?: (state: ImageState) => void;
    value?: string;
    onChange?: (file: File | null) => void;
    label?: string;
}

export function ImageUpload(props: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(props.initialUrl || props.value || null);
    const [preview, setPreview] = useState<string | null>(props.initialUrl || props.value || null);
    const [touched, setTouched] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        setOriginalPreview(props.initialUrl || props.value || null);
        setPreview(props.initialUrl || props.value || null);
        setFile(null);
        setRemoved(false);
    }, [props.initialUrl, props.value]);

    useEffect(() => {
        if (props.onStateChange) {
            props.onStateChange({
                file,
                removed,
                dirty: removed || !!file,
                previewUrl: preview
            });
        }
    }, [file, removed, preview, props.onStateChange]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const f = event.target.files?.[0] || null;
        setTouched(true);
        if (!f) return;

        try {
            await validateImageFile(f);
        } catch (err) {
            const errorMsg =
                err instanceof Error
                    ? err.message
                    : typeof err === "string"
                        ? err
                        : "Erro desconhecido ao validar imagem";
            toast.error(errorMsg);
            console.error("Validação da imagem falhou:", err);

            setPreview(originalPreview);
            setFile(null);
            setRemoved(false);

            if (fileInputRef.current) fileInputRef.current.value = '';
            if (props.onChange) props.onChange(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(f);

        setFile(f);
        setRemoved(false);
        if (props.onChange) props.onChange(f);
    };

    const resetImage = () => {
        setTouched(true);
        if (props.initialUrl && !file) {
            setRemoved(true);
            setPreview(null);
        } else {
            setFile(null);
            if (props.initialUrl) {
                setPreview(props.initialUrl);
                setRemoved(false);
            } else {
                setPreview(null);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (props.onChange) props.onChange(null);
    };

    const triggerFileInput = () => {
        if (!props.disabled) fileInputRef.current?.click();
    };

    const effectivePreview = removed ? null : preview;
    const isRequiredError = props.required && touched && !effectivePreview && !file && !props.initialUrl;

    const containerClasses =
        `w-full p-3 pt-5 rounded border border-teal-500 focus-within:outline-none
     focus-within:ring-2 focus-within:ring-teal-500
     ${props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 text-teal-600"}
     ${isRequiredError ? "border-red-500" : ""}`;

    return (
        <div className="relative flex-1 mb-2">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute left-3 top-0 text-teal-500 text-sm z-10 ${props.classNameLabel || ""}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>

            <div className={containerClasses}>
                {effectivePreview ? (
                    <div className="relative w-full h-32 flex items-center justify-center">
                        <img
                            id={`preview-${props.id}`}
                            src={effectivePreview}
                            alt="Preview"
                            className={`max-w-full max-h-full object-contain rounded-lg border border-teal-600 ${props.disabled ? 'opacity-50' : ''}`}
                        />
                        {!props.disabled && (
                            <button
                                id={`remove-${props.id}`}
                                type="button"
                                onClick={resetImage}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                                aria-label="Remover imagem"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}

                    </div>
                ) : (
                    <div
                        id={`dropzone-${props.id}`}
                        onClick={triggerFileInput}
                        className={`w-full h-32 border-2 border-dashed border-teal-500 rounded-lg flex flex-col items-center justify-center hover:border-teal-600 transition-colors
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <FaCamera id={`camera-${props.id}`} className="text-gray-400 mb-2" size={24} />
                        <span id={`text-${props.id}`} className="text-teal-600 text-sm">
                            Clique para adicionar imagem
                        </span>
                        <span id={`info-${props.id}`} className="text-gray-500 text-xs mt-1">
                            JPG, PNG, WEBP - Max: 5MB
                        </span>
                    </div>
                )}
            </div>

            <input
                id={`input-${props.id}`}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={props.disabled}
            />
        </div>
    );
}