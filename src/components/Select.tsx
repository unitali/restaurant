interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: Array<{ label: string; value: string }>;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
    id: string;
    name: string;
    fixed?: boolean;
}

export function Select({ fixed, ...props }: SelectProps) {
    const disabledClasses = props.disabled
        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        : "bg-white text-gray-700 cursor-pointer";

    return (
        <div className="relative w-full">
            <label
                htmlFor={props.id}
                className="absolute left-3 top-1 text-unitali-blue-600 text-sm"
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <select
                id={props.id}
                name={props.name}
                className={`w-full p-3 pt-6 rounded ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-black"} border border-unitali-blue-500 focus:outline-none focus:ring-2 focus:ring-unitali-blue-500 ${disabledClasses}`}
                onChange={props.onChange}
                value={props.value}
                disabled={props.disabled}
                required={props.required}
            >
                {props.options.map((opt, index) => (
                    <option
                        id={`select-option-${index}`}
                        key={index}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}