
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}


export function ButtonPrimary({ ...props }: ButtonProps) {
    return (
        <button
            id={props.id}
            type={props.type}
            onClick={props.onClick}
            className={`flex justify-center items-center bg-teal-500 hover:bg-teal-600 text-white font-bold p-3 rounded w-full cursor-pointer ${props.className}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}

        </button>
    )
}

export function ButtonPrimaryRemove({ ...props }: ButtonProps) {
    return (
        <button
            id={props.id}
            type={props.type}
            onClick={props.onClick}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded w-1/3 cursor-pointer ${props.className}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}

export function ButtonOutline({ ...props }: ButtonProps) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className={`border border-teal-500 text-teal-500 hover:bg-teal-600 hover:text-white font-bold p-3 rounded w-1/3 cursor-pointer ${props.className}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}

export function ButtonOutlineRemove({ ...props }: ButtonProps) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className={`border border-red-700 text-red-700 hover:border-red-500 hover:text-red-500 font-bold p-3 rounded w-1/3 cursor-pointer ${props.className}`}
            disabled={props.disabled || props.loading}
        >
            {props.children}
        </button>
    )
}
