import React from "react";
import { formatHours } from "../../utils/hours";

interface InputHoursProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    classNameLabel?: string;
    classNameInput?: string;
    id: string;
    required?: boolean;
    value?: string;
}

export function InputHours({ value = "", onChange, ...props }: InputHoursProps) {
    const [touched, setTouched] = React.useState(false);
    const [rawValue, setRawValue] = React.useState(value.replace(/\D/g, "").slice(0, 8));
    const isRequiredError = props.required && touched && !rawValue;

    React.useEffect(() => {
        setRawValue(value.replace(/\D/g, "").slice(0, 8));
    }, [value]);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
        setRawValue(digits);
        if (onChange) {
            onChange({
                ...e,
                target: {
                    ...e.target,
                    value: digits,
                    name: props.name ?? ""
                }
            });
        }
    }

    return (
        <div className="relative flex-1 mb-2 w-full">
            <label
                id={`label-${props.id}`}
                htmlFor={`input-${props.id}`}
                className={`absolute p-1 left-3 top-0 text-unitali-blue-600 text-sm ${props.classNameLabel}`}
            >
                {props.label}
                {props.required && <span className="mx-1">*</span>}
            </label>
            <input
                {...props}
                id={`input-${props.id}`}
                type="text"
                inputMode="numeric"
                value={formatHours(rawValue)}
                className={`w-full pb-2 ps-4 pt-7 rounded ${props.disabled ? "bg-gray-100 text-gray-400 hover:cursor-not-allowed" : "bg-white text-gray-900"} border focus:outline-none focus:ring-2  ${isRequiredError ? "border-red-500 focus:ring-red-500" : "border-unitali-blue-600 focus:ring-unitali-blue-700"}`}
                onBlur={(e) => {
                    setTouched(true);
                    props.onBlur && props.onBlur(e);
                }}
                onChange={handleInput}
                maxLength={13}
            />
        </div>
    );
}

