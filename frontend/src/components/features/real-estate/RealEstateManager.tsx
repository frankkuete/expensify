"use client";

import { useState } from "react";
import { useRealEstate } from "@/hooks/useRealEstate";
import RealEstateForm from "./RealEstateForm";
import RealEstateList from "./RealEstateList";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { CreateRealEstateInput } from "@/types/realEstate";

export default function RealEstateManager() {
    const { properties, loading, error, addProperty, deleteProperty } = useRealEstate();
    const [isInternalOpen, setIsInternalOpen] = useState(false);

    const handleAdd = async (data: CreateRealEstateInput) => {
        const result = await addProperty(data);
        setIsInternalOpen(false);
        return result;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsInternalOpen(true)}
                    className="btn btn-primary text-white"
                >
                    <Plus className="h-5 w-5" />
                    New Property
                </button>

                <Modal
                    title="Add New Property"
                    isOpen={isInternalOpen}
                    onClose={() => setIsInternalOpen(false)}
                >
                    <RealEstateForm onAdd={handleAdd} />
                </Modal>
            </div>

            <RealEstateList
                properties={properties}
                loading={loading}
                error={error}
                onDelete={deleteProperty}
            />
        </div>
    );
}
