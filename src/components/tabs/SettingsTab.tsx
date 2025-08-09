import { CompanySettings } from "../companySettings";
import { Settings } from "../settings";

interface SettingsTabProps {
    restaurantId: string;
}

export function SettingsTab({ restaurantId }: SettingsTabProps) {
    return (
        <section className="flex flex-col items-center">
            <div className="flex flex-row gap-8 w-full justify-center">
                <CompanySettings restaurantId={restaurantId} />
                <Settings restaurantId={restaurantId} />
            </div>
        </section>
    );
}
