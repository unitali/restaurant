import { CompanyOpeningHours, Settings, SettingsDelivery } from ".";

export function SettingsTab() {
    return (
        <section className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 w-full md:max-w-none mx-auto px-2 justify-center">
                <div>
                    <CompanyOpeningHours />
                    <Settings />
                </div>
                <div>
                    <SettingsDelivery />
                </div>
            </div>
        </section>
    );
}
