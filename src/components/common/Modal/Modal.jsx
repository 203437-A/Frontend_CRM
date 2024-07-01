import React from 'react';
import './modal.css';

function Modal({ isOpen, closeModal, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
}

export default Modal;
