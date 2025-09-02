
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
}

export function ButtonOutline({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`w-full rounded cursor-pointer border border-unitali-blue-600 text-unitali-blue-600 hover:bg-unitali-blue-500 hover:text-white font-bold p-4 ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}