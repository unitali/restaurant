export function formatCurrencyBRL(value: string | number): string {
    const number = typeof value === "number" ? value : parseFloat(value.replace(",", "."));
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    });
}

export function replaceStringInNumber(value: string): number {
    const numeric = Number(value.replace(/\D/g, "")) / 100;
    return isNaN(numeric) ? 0 : Number(numeric.toFixed(2));
}