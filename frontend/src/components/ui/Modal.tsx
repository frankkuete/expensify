"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
    return (
        <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box relative bg-white text-gray-900">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <X className="h-4 w-4" />
                </button>

                <h3 className="font-bold text-lg mb-4">{title}</h3>

                <div className="py-4">
                    {children}
                </div>
            </div>
            {/* Backdrop to close */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
