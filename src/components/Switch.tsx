interface SwitchProps {
    value: boolean;
    onChange: (val: boolean) => void;
    id: string;
    disabled?: boolean;
}

export function Switch(props: SwitchProps) {
    return (
        <button
            id={`button-${props.id}`}
            type="button"
            className={`flex items-center cursor-pointer focus:outline-none ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !props.disabled && props.onChange(!props.value)}
            aria-pressed={props.value}
            disabled={props.disabled}
        >
            <input
                type="checkbox"
                id={`input-${props.id}`}
                className="sr-only"
                checked={props.value}
                readOnly
                disabled={props.disabled}
            />
            <div className="relative flex items-center">
                <div className={`block w-12 h-6 rounded-full transition-colors ${props.value ? "bg-teal-500" : "bg-gray-200"}`} />
                <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${props.value ? "translate-x-6" : ""}`}
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
                />
            </div>
        </button>
    );
}
