

export function formatHours(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length >= 1) formatted += digits.slice(0, 2);
    if (digits.length >= 3) formatted += ":" + digits.slice(2, 4);
    if (digits.length >= 4) formatted += " - ";
    if (digits.length >= 5) formatted += digits.slice(4, 6);
    if (digits.length >= 7) formatted += ":" + digits.slice(6, 8);
    return formatted;
}