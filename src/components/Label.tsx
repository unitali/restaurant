interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
    classNameLabel?: string;
    id: string;
    label: string;
}

export function Label({ id, label, required, classNameLabel, ...props }: LabelProps) {
    return (
        <label
            id={`label-${id}`}
            htmlFor={`input-${id}`}
            className={`absolute p-1 left-3 top-0 text-teal-500 text-sm ${classNameLabel ?? ""}`}
            {...props}
        >
            {label}
            {required && <span className="mx-1">*</span>}
        </label>
    );
}
