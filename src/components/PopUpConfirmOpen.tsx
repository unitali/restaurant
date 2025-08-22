import { ButtonOutline, ButtonPrimary, Modal, type ModalProps } from ".";
import { LoadingPage } from "../pages/LoadingPage";

interface ConfirmModalProps extends ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    message: string;
    loading?: boolean;
    title: string;
}


export function PopUpConfirmOpen(props: ConfirmModalProps) {
    return (
        <Modal
            id="confirm-modal"
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            {props.loading ? (
                <LoadingPage />
            ) : (
                <div className=" px-6 py-4">
                    <h2 className="text-xl font-bold mb-4">{props.title}</h2>
                    <p className="pb-8">
                        {props.message}
                    </p>
                    <div className="flex justify-end gap-4 m-4">
                        <ButtonOutline
                            id="cancel"
                            className="button"
                            onClick={props.onClose}
                            children="Cancelar" />
                        <ButtonPrimary
                            id="confirm"
                            onClick={props.onConfirm}
                            disabled={props.loading}
                            children={"Confirmar"}
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
}
