import { useState } from "react";
import { CartDelivery, CartPayment, CartProducts, CartSummary, Modal } from ".";



function ModalHeader({ children }: { children: React.ReactNode }) {
    return <div className="border-b px-6 py-4 text-xl font-bold">{children}</div>;
}

function ModalContent({ children }: { children: React.ReactNode }) {
    return <div className="px-6 py-4">{children}</div>;
}

interface ModalCheckoutProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModalCheckout(props: ModalCheckoutProps) {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <Modal
            id="checkout-modal"
            isOpen={props.isOpen}
            onClose={props.onClose}>
            <ModalHeader>
                {step === 1 && "Carrinho"}
                {step === 2 && "Entrega"}
                {step === 3 && "Pagamento"}
                {step === 4 && "Finalizar Pedido"}
            </ModalHeader>
            <ModalContent>
                {step === 1 && <CartProducts onNext={nextStep} />}
                {step === 2 && <CartDelivery onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <CartPayment onNext={nextStep} onBack={prevStep} />}
                {step === 4 && <CartSummary onBack={prevStep} />}
            </ModalContent>
        </Modal>
    );
}
