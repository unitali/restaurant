import { useState } from "react";
import { FaMinus } from "react-icons/fa";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
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
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 transition-colors duration-150
                ${clicked ? "bg-red-700" : "bg-red-500 hover:bg-red-600"} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            <FaMinus size={10} className="text-white" />
        </button>
    )
}