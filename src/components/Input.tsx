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
                className={`absolute left-3 top-0 text-unitali-blue-600 text-sm p-1 ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <div
                className={`flex items-center w-full ps-3 pt-5 rounded 
                    ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-black"}
                    border border-unitali-blue-600 focus-within:ring-2 focus-within:ring-unitali-blue-500
                    ${props.classNameInput} ${isRequiredError ? "border-red-500" : ""}`}
            >
                <input
                    type="color"
                    value={props.value}
                    name={props.name}
                    onChange={handleChange}
                    disabled={props.disabled}
                    className={`w-10 h-10 rounded pb-1 mr-3 bg-transparent ${props.disabled ? "hover:cursor-not-allowed" : "cursor-pointer"}`}
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
        </div>
    );
}