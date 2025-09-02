interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    id: string;
}

export function ButtonPrimary({ ...props }: ButtonProps) {
    const disabledStyle = props.disabled || props.loading ? "opacity-60 !bg-gray-200 !text-gray-400 cursor-not-allowed" : "";
    return (
        <button
            id={`button-${props.id}`}
            type={props.type}
            onClick={props.onClick}
            className={`flex justify-center p-4 items-center bg-unitali-blue-600 hover:bg-unitali-blue-500 text-white font-bold rounded w-full cursor-pointer ${props.className} ${disabledStyle}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}












