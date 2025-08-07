import { ButtonOutlineRemove, ButtonPrimaryRemove, Modal, type ModalProps } from "..";
import { LoadingPage } from "../../pages/LoadingPage";


interface ConfirmModalProps extends ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    value: string;
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
                    <p className="pb-8">
                        {`Tem certeza que deseja excluir o item `}
                        <strong className="font-semibold">{props.value}</strong>
                        {`?`}
                    </p>
                    <div className="flex justify-end gap-4 m-4">
                        <ButtonOutlineRemove
                            className="button"
                            onClick={props.onCancel}
                            children="Cancelar" />
                        <ButtonPrimaryRemove
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