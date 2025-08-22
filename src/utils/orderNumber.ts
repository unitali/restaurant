import { today } from "./date";

export function createOrderNumber() {
    const now = today();
    const orderNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

    return orderNumber;
}