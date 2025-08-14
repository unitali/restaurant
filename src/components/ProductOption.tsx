import { useState } from "react";
import { Input } from "./Input";

interface ProductOptionProps {
    id: string;
    title: string;
}

export function ProductOption(props: ProductOptionProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b">
            <button
                className="w-full text-left flex justify-between items-center py-2 focus:outline-none"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={`acordeon-content-${props.id}`}
            >
                <span className="text-lg font-semibold">{props.title}</span>
                <span className="ml-2">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <div
                    id={`acordeon-content-${props.id}`}
                    className="py-2 animate-fade-in"
                >
                    <Input
                        id={`product-option-${props.id}`}
                        label="Enter product option"
                    />
                </div>
            )}
        </div>
    );
}
