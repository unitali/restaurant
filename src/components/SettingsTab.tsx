import { CompanySettings, Settings } from ".";

export function SettingsTab() {
    return (
        <section className="flex flex-col items-center">
            <div className="flex flex-row gap-8 w-full justify-center">
                <CompanySettings />
                <Settings />
            </div>
        </section>
    );
}
