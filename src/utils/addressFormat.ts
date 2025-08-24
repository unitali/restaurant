import type { AddressType } from "../types";

export function addressFormat(address: AddressType) {
    return `${address.street}, ${address.number} - ${address.neighborhood}\n` +
        `${address.city ? `- Cidade: ${address.city}\n` : ""}` +
        `${address.reference ? `- Referência: ${address.reference}\n` : ""}` +
        `${address.zipCode ? `- CEP: ${address.zipCode}\n` : ""}`;
}