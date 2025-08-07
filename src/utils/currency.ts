export function formatCurrencyBRL(value: string | number): string {

    const numeric = typeof value === "number" ? value : value.replace(/\D/g, "");

    const number = typeof numeric === "number" ? numeric : parseInt(numeric || "0", 10);
    return (number / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    });
}