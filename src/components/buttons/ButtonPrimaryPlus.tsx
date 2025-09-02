import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
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
            className={`w-5 h-5 rounded-full flex items-center justify-center ml-2 transition-colors duration-150
                ${clicked ? "bg-green-700" : "bg-green-500 hover:bg-green-600"} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            <FaPlus size={10} className="text-white" />
        </button>
    )
}