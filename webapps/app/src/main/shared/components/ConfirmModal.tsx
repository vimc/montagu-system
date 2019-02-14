import * as React from "react";


export interface ConfirmModalProps {
    show: boolean;
    title: string;
    text: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal : React.StatelessComponent<ConfirmModalProps> = (props: ConfirmModalProps) =>  {

    const displayClassName = props.show ? "modal-background modal-show" : "modal-background modal-hide";

    return (
        <div className={displayClassName}>
            <div className="modal-main px-3 py-3">
                <div className={"mb-2 font-weight-bold"}>{props.title}</div>
                <div className={"mb-2"}>{props.text}</div>
                <div className={"modal-buttons"}>
                    <button id="confirm-publish-btn" className={"btn submit mr-3"} onClick={props.onConfirm}>
                        Yes
                    </button>
                    <button id="cancel-publish-btn" className={"btn btn-default"} onClick={props.onClose}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}