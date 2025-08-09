import { FaSpinner } from "react-icons/fa6";


export function LoadingPage() {
    return (
        <div className="flex items-center justify-center">
            <div className="text-6xl text-teal-500">
                <FaSpinner className="animate-spin" />
            </div>
        </div>
    );
}