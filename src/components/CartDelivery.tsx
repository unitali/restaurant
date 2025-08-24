import { useState, useEffect } from "react";
import { ButtonOutline, ButtonPrimary, Input, RadioButton } from ".";
import { useOrder } from "../contexts/OrderContext";
import type { AddressType } from "../types";


export function CartDelivery({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { addDeliveryAddress, deliveryAddress } = useOrder();
    const [isDelivery, setIsDelivery] = useState(false);

    const [address, setAddress] = useState<AddressType | null>(
        isDelivery ? (deliveryAddress ?? {
            street: "",
            number: "",
            neighborhood: "",
            reference: "",
            zipCode: ""
        }) : null
    );

    useEffect(() => {
        if (isDelivery) {
            setAddress(deliveryAddress ?? {
                street: "",
                number: "",
                neighborhood: "",
                reference: "",
                zipCode: ""
            });
        } else {
            setAddress(null);
        }
    }, [isDelivery, deliveryAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...(prev ?? {
                street: "",
                number: "",
                neighborhood: "",
                reference: "",
                zipCode: ""
            }),
            [name]: value,
        }));
    };

    const handleNext = () => {
        if (isDelivery && address) {
            addDeliveryAddress(address);
        } else {
            addDeliveryAddress(null);
        }
        onNext();
    };

    const isFilled =
        address !== null &&
        address.street.trim() &&
        address.number.trim() &&
        address.neighborhood.trim();

    return (
        <div>
            <div className="flex flex-col gap-2 mb-4">
                <RadioButton
                    label="Retirar no local"
                    name="delivery-type"
                    checked={!isDelivery}
                    onChange={() => setIsDelivery(false)}
                />
                <RadioButton
                    label="Entregar no endereço"
                    name="delivery-type"
                    checked={isDelivery}
                    onChange={() => setIsDelivery(true)}
                />
            </div>
            <div className="flex flex-col gap-4">
                {isDelivery && address && (
                    <>
                        <Input
                            id="delivery-street"
                            name="street"
                            label="Rua"
                            value={address.street}
                            onChange={handleChange}
                            required
                            className="mb-2"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input
                                id="delivery-number"
                                name="number"
                                label="Número"
                                value={address.number}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                id="delivery-state"
                                name="neighborhood"
                                label="Bairro"
                                value={address.neighborhood}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                id="delivery-reference"
                                name="reference"
                                label="Referência"
                                value={address.reference || ""}
                                onChange={handleChange}
                            />
                            <Input
                                id="delivery-zipCode"
                                name="zipCode"
                                label="CEP"
                                value={address.zipCode || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                <div className="flex gap-2">
                    <ButtonOutline
                        id="delivery-back"
                        onClick={onBack}
                        children="Voltar"
                    />
                    <ButtonPrimary
                        id="delivery-next"
                        onClick={handleNext}
                        disabled={isDelivery ? !isFilled : false}
                        children="Continuar"
                    />
                </div>
            </div>
        </div>
    );
}