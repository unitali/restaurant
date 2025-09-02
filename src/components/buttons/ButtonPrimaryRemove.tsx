
import React from "react";

interface ButtonPrimaryRemoveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
}

export function ButtonPrimaryRemove({ ...props }: ButtonPrimaryRemoveProps) {
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