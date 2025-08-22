interface SwitchProps {
    value: boolean;
    onChange: (val: boolean) => void;
}

export function Switch(props: SwitchProps) {
    return (
        <button
            type="button"
            className="flex items-center cursor-pointer focus:outline-none"
            onClick={() => props.onChange(!props.value)}
            aria-pressed={props.value}
        >
            <input type="checkbox" className="sr-only" checked={props.value} readOnly />
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
