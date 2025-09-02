import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    classNameLabel?: string;
    classNameInput?: string;
    id: string;
    required?: boolean;
}

export function InputPassword({ ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [touched, setTouched] = React.useState(false);
    const inputType = showPassword ? "text" : "password";
    const isRequiredError = props.required && touched && !props.value;

    return (
        <div className="relative flex-1 mb-2 w-full">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute p-1 left-3 top-0 text-unitali-blue-600 text-sm ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <input
                value={props.value}
                {...props}
                id={`input-${props.id}`}
                type={inputType}
                className={`w-full pb-2 ps-4 pt-7 rounded ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-gray-900"} border focus:outline-none focus:ring-2  ${isRequiredError ? "border-red-500 focus:ring-red-500" : "border-unitali-blue-600 focus:ring-unitali-blue-700"}`}
                onBlur={(e) => {
                    setTouched(true);
                    props.onBlur && props.onBlur(e);
                }}
            />
            <button
                id={`show-${props.id}`}
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword((v) => !v)}
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
    );
}
