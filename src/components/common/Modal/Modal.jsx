import React from 'react';

function Modal({ isOpen, closeModal, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="relative bg-white p-5 rounded-lg w-4/5 max-w-lg shadow-lg">
                {children}
            </div>
        </div>
    );
}

export default Modal;
