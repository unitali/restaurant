
export function today(): Date {
    return new Date();
}

export function plusDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}