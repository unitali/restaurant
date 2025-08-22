import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ButtonPrimary } from ".";
import type { PlanType } from "../types";

interface PlanCardProps {
    plan: PlanType;
    index?: number;
}

export function PlanCard({ plan, index }: PlanCardProps) {
    const setSelectedPlan = (selectedPlan: PlanType) => {
        // Implement the logic to handle plan selection
        console.log("Selected Plan:", selectedPlan);
    };

    const isBestSeller = index === 1;

    return (
        <div
            key={plan.name}
            className={"bg-white rounded shadow p-3 flex flex-col items-center justify-between pt-5 relative transition-all duration-300 min-h-[440px]"
            }
        >
            {isBestSeller && (
                <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-200 text-green-800 text-md font-semibold px-4 py-1 rounded-full shadow"
                    style={{ zIndex: 2 }}
                >
                    Mais Vendido
                </span>
            )}
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-lg font-bold mb-10">{plan.price}</p>
            <ul className="w-full mb-10">
                {Object.entries(plan.features).map(([feature, hasFeature]) => (
                    <li key={feature} className="flex items-center gap-2 py-1">
                        {hasFeature ? (
                            <FaCheckCircle className="text-green-600" />
                        ) : (
                            <FaTimesCircle className="text-red-500" />
                        )}
                        <span className={hasFeature ? "text-gray-800" : "text-gray-400 line-through"}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
            <ButtonPrimary
                id={`subscribe-${plan.name.toLowerCase()}`}
                onClick={() => setSelectedPlan(plan)}
            >
                Assinar
            </ButtonPrimary>
        </div>
    );
}
