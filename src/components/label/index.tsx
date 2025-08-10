import { type InputHTMLAttributes, type LabelHTMLAttributes } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

interface LabelCopyProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: string;
    classNameLabel?: string;
    classNameInput?: string;
    id: string;
    labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export function LabelCopy({ ...props }: LabelCopyProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(props.value);
            toast.success("Link copiado com sucesso!");
        } catch {
            toast.error("Erro ao copiar o link.");
        }
    };

    return (
        <button
            type="button"
            className="relative flex-1 mb-2 w-full text-left focus:outline-none cursor-pointer"
            onClick={handleCopy}
            tabIndex={0}
            title="Clique para copiar"
        >
            <label
                id={`label-${props.id}`}
                htmlFor={props.id}
                className={`absolute left-3 top-0 text-gray-400 text-sm ${props.classNameLabel}`}
            >
                {props.label}
            </label>
            <input
                {...props}
                id={props.id}
                type="text"
                disabled
                tabIndex={-1}
                className={`w-full p-3 pt-5 rounded border border-teal-500 focus:outline-none focus:ring-2 pr-10 bg-white pointer-events-none ${props.classNameInput}`}
                onBlur={(e) => {
                    props.onBlur && props.onBlur(e);
                }}
            />
            <FaCopy
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-500 pointer-events-none"
                size={18}
            />
        </button>
    );
}