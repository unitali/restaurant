import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
    quantity?: number;
}


export function ButtonPrimary({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`flex justify-center p-4 items-center bg-teal-500 hover:bg-teal-600 text-white font-bold rounded w-full cursor-pointer ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}

export function ButtonPrimaryRemove({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`flex justify-center items-center bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded w-full cursor-pointer ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}

export function ButtonPrimaryPlus({ ...props }: ButtonProps) {
    const [clicked, setClicked] = useState(false);
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-300 !text-gray-400 cursor-not-allowed" : "";

    return (
        <button
            type="button"
            onClick={props.onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
            id="add-to-cart"
            className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 transition-colors duration-150
                ${clicked ? "bg-green-700" : "bg-green-500 hover:bg-green-600"} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {(props.quantity ?? 0) > 0 ? (
                <span className="text-white font-bold">{props.quantity ?? 0}</span>
            ) : (
                <FaPlus size={14} className="text-white" />
            )}
        </button>
    )
}

export function ButtonPrimaryMinus({ ...props }: ButtonProps) {
    const [clicked, setClicked] = useState(false);
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";

    return (
        <button
            id="remove-from-cart"
            type="button"
            onClick={props.onClick}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-colors duration-150
                ${clicked ? "bg-red-700" : "bg-red-500 hover:bg-red-600"} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            <FaMinus size={14} className="text-white" />
        </button>
    )
}

export function ButtonOutline({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`w-full rounded cursor-pointer border border-teal-500 text-teal-500 hover:bg-teal-600 hover:text-white font-bold p-4 ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}

export function ButtonOutlineRemove({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`border border-red-700 text-red-700 hover:border-red-500 hover:text-red-500 font-bold p-3 rounded w-full cursor-pointer ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}
