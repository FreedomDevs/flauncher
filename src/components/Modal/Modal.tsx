import style from "./style.module.css";
import React, { ReactNode } from 'react';

interface ModalProps {
    active: boolean;
    setActive: (active: boolean) => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ active, setActive, children }) => {
    return (
        <div
            className={active ? `${style.modal} ${style.active}` : style.modal}
            onClick={() => setActive(false)}
        >
            <div
                className={active ? `${style.modal__content} ${style.active}` : style.modal__content}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
