

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    id: string;
    fixed?: boolean;
}


export function TextArea({ id, fixed, ...props }: TextAreaProps) {
    return (
        <div className="relative flex-1">
            <label
                id={`label-${id}`}
                htmlFor={id}
                className={`absolute left-3 top-0 text-teal-500 text-sm p-1 ${fixed ? "peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm" : ""
                    }`}
            >
                {props.label}
            </label>
            <textarea
                value={props.value}
                id={`input-${id}`}
                className={`w-full p-3 pt-5 rounded bg-white text-gray-900 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 ${fixed ? "pt-3" : "peer placeholder-transparent"
                    }`}
                placeholder={fixed ? "" : props.label}
                {...props}
            />
        </div>
    );
}