export function CheckBox({
    label,
    name,
    checked,
    onChange,
    disabled,
}: {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <span className="relative">
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className={`peer appearance-none h-8 w-8 border-2 border-teal-500 bg-white rounded checked:bg-teal-500 checked:border-teal-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={disabled}
                />
                <svg
                    className={`absolute left-1 top-1 w-6 h-6 text-white pointer-events-none transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M6 10l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className=" text-gray-700">{label}</span>
        </label>
    );
}