import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    classNameLabel?: string;
    classNameInput?: string;
    id: string;
    required?: boolean;
}

export function Input({ ...props }: InputProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [touched, setTouched] = React.useState(false);

    const isPassword = props.type === "password";
    const allowedTypes = ["text", "password"];
    const inputType = isPassword && showPassword ? "text" : allowedTypes.includes(props.type || "") ? props.type : "text";
    const isRequiredError = props.required && touched && !props.value;

    return (
        <div className="relative flex-1 mb-2">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute left-3 top-0 text-gray-400 text-sm ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <input
                value={props.value}
                {...props}
                id={`input-${props.id}`}
                type={inputType}
                className={`w-full p-3 pt-5 rounded ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-black"} border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.classNameInput} ${isPassword ? "pr-10" : ""} ${isRequiredError ? "border-red-500" : ""}`}
                onBlur={(e) => {
                    setTouched(true);
                    props.onBlur && props.onBlur(e);
                }}
            />
            {isPassword && (
                <button
                    id={`show-${props.id}`}
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword((v) => !v)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
            {isRequiredError && (
                <span id={`error-${props.id}`} className="text-red-500 text-xs absolute left-0 -bottom-5 px-4 font-bold">Campo obrigatório</span>
            )}
        </div>
    );
}

interface InputColorProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    classNameLabel?: string;
    classNameInput?: string;
    id: string;
    required?: boolean;
}

export function InputColor({ ...props }: InputColorProps) {
    const [touched, setTouched] = React.useState(false);
    const isRequiredError = props.required && touched && !props.value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e);
    };

    return (
        <div className="relative flex-1 mb-2">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute left-3 top-0 text-gray-400 text-sm ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <div
                className={`flex items-center w-full p-1 pt-4 rounded 
                    ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-black"}
                    border border-teal-500 focus-within:ring-2 focus-within:ring-teal-500 
                    ${props.classNameInput} ${isRequiredError ? "border-red-500" : ""}`}
            >
                <input
                    type="color"
                    value={props.value}
                    name={props.name}
                    onChange={handleChange}
                    disabled={props.disabled}
                    className={`w-10 h-10 rounded mr-3 bg-transparent ${props.disabled ? "hover:cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ minWidth: 40 }}
                    tabIndex={-1}
                />
                <input
                    {...props}
                    id={`input-${props.id}`}
                    type="text"
                    value={props.value}
                    name={props.name}
                    onChange={handleChange}
                    disabled={props.disabled}
                    className={`flex-1 bg-transparent outline-none border-none p-0 m-0 ${props.disabled ? "hover:cursor-not-allowed" : "cursor-text"} ${isRequiredError ? "border-red-500" : ""}`}
                    onBlur={(e) => {
                        setTouched(true);
                        props.onBlur && props.onBlur(e);
                    }}
                />
            </div>
            {isRequiredError && (
                <span id={`error-${props.id}`} className="text-red-500 text-xs absolute left-0 -bottom-5 px-4 font-bold">Campo obrigatório</span>
            )}
        </div>
    );
}