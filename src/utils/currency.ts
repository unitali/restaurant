export function formatCurrencyBRL(value: string | number): string {
    const number = typeof value === "number" ? value : parseFloat(value.replace(",", "."));
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    });
}