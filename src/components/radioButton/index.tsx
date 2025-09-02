
interface RadioButtonProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export function RadioButton(props: RadioButtonProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <span className="relative">
                <input
                    type="radio"
                    id={`${props.name}-${props.checked ? 'checked' : 'unchecked'}`}
                    name={props.name}
                    checked={props.checked}
                    onChange={props.onChange}
                    className={`peer appearance-none h-8 w-8 border-2 border-unitali-blue-600 bg-white rounded-full checked:bg-unitali-blue-600 checked:border-unitali-blue-600 transition-colors ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={props.disabled}
                />
                <span
                    className={`absolute left-2 top-2 w-4 h-4 rounded-full bg-white pointer-events-none transition-opacity ${props.checked ? 'bg-unitali-blue-600 opacity-100' : 'transparent opacity-0'}`}
                />
            </span>
            <span className="text-gray-700">{props.label}</span>
        </label>
    );
}