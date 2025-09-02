interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
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