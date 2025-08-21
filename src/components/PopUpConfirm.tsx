import { ButtonOutlineRemove, ButtonPrimaryRemove, Modal, type ModalProps } from ".";
import { LoadingPage } from "../pages/LoadingPage";


interface ConfirmModalProps extends ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    loading?: boolean;
}

export function ConfirmModal({ ...props }: ConfirmModalProps) {
    return (
        <Modal
            id="confirm-modal"
            isOpen={props.isOpen}
            onClose={props.onCancel}
        >
            {props.loading ? (
                <LoadingPage />
            ) : (
                <div className=" px-6 py-4">
                    <h2 className="text-xl font-bold mb-4">Atenção: essa ação não poderá ser desfeita!</h2>
                    <p className="pb-8">
                        {props.message}
                    </p>
                    <div className="flex justify-end gap-4 m-4">
                        <ButtonOutlineRemove
                            id="cancel"
                            className="button"
                            onClick={props.onCancel}
                            children="Cancelar" />
                        <ButtonPrimaryRemove
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