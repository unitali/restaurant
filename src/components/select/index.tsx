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
        : "bg-gray-700 text-white";

    return (
        <div className="relative w-full">
            <label
                htmlFor={props.id}
                className={`absolute left-3 top-0 text-gray-400 text-sm ${
                    fixed ? "" : "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm"
                }`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <select
                id={props.id}
                name={props.name}
                className={`w-full p-3 pt-5 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    fixed ? "pt-3" : "peer"
                } ${disabledClasses}`}
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