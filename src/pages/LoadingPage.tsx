import { FaSpinner } from "react-icons/fa6";


export function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-6xl text-unitali-blue-600">
                <FaSpinner className="animate-spin" />
            </div>
        </div>
    );
}