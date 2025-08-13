import { CompanySettings, Settings } from ".";

export function SettingsTab() {
    return (
        <section className="flex flex-col items-center w-full">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:max-w-none mx-auto px-2 justify-center">
                <CompanySettings />
                <Settings />
            </div>
        </section>
    );
}
