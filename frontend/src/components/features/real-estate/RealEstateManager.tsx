"use client";

import { useState, useEffect } from "react";
import { useRealEstate } from "@/hooks/useRealEstate";
import RealEstateForm from "./RealEstateForm";
import RealEstateList from "./RealEstateList";
import { Modal } from "@/components/ui/Modal";
import { Plus, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { CreateRealEstateInput, UpdateRealEstateInput, RealEstate } from "@/types/realEstate";

import { DocumentManager } from "@/components/shared/DocumentManager";

export default function RealEstateManager() {
    const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useRealEstate();
    const [isInternalOpen, setIsInternalOpen] = useState(false);
    const [documentAsset, setDocumentAsset] = useState<RealEstate | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingProperty, setEditingProperty] = useState<RealEstate | null>(null);

    const handleAdd = async (data: CreateRealEstateInput) => {
        const result = await addProperty(data);
        setIsInternalOpen(false);
        setSuccessMessage("Property created successfully!");
        return result;
    };

    const handleDeleteClick = async (id: string) => {
        setDeleteConfirmId(id);
    };

    const handleEdit = (property: RealEstate) => {
        setEditingProperty(property);
        setIsInternalOpen(true);
    };

    const handleShowDocuments = (property: RealEstate) => {
        setDocumentAsset(property);
    };

    const handleUpdate = async (id: string, data: UpdateRealEstateInput) => {
        const result = await updateProperty(id, data);
        setIsInternalOpen(false);
        setEditingProperty(null);
        setSuccessMessage("Property updated successfully!");
        return result;
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmId) {
            try {
                await deleteProperty(deleteConfirmId);
                setDeleteConfirmId(null);
                setSuccessMessage("Property deleted successfully!");
            } catch (err) {
                console.error('Failed to delete property:', err);
                setDeleteConfirmId(null);
                setErrorMessage("Failed to delete property. Please try again.");
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmId(null);
    };

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Auto-dismiss error message after 3 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const propertyToDelete = properties.find(p => p.id === deleteConfirmId);

    return (
        <div className="space-y-8">
            {/* Success notification */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {/* Error notification */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">{errorMessage}</span>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setEditingProperty(null);
                        setIsInternalOpen(true);
                    }}
                    className="btn btn-primary text-white"
                >
                    <Plus className="h-5 w-5" />
                    New Property
                </button>

                <Modal
                    title={editingProperty ? "Edit Property" : "Add New Property"}
                    isOpen={isInternalOpen}
                    onClose={() => {
                        setIsInternalOpen(false);
                        setEditingProperty(null);
                    }}
                >
                    <RealEstateForm
                        existingProperty={editingProperty || undefined}
                        onAdd={editingProperty ? undefined : handleAdd}
                        onUpdate={editingProperty ? handleUpdate : undefined}
                    />
                </Modal>
            </div>

            {/* Documents Modal */}
            <Modal
                title={`Documents - ${documentAsset?.name}`}
                isOpen={documentAsset !== null}
                onClose={() => setDocumentAsset(null)}
            >
                {documentAsset && (
                    <DocumentManager
                        assetType="real_estate"
                        objectId={documentAsset.id}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Deletion"
                isOpen={deleteConfirmId !== null}
                onClose={handleCancelDelete}
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-gray-900 font-medium">
                                Are you sure you want to delete this property?
                            </p>
                            {propertyToDelete && (
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-semibold">{propertyToDelete.name}</span> in {propertyToDelete.location}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCancelDelete}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Delete Property
                        </button>
                    </div>
                </div>
            </Modal>

            <RealEstateList
                properties={properties}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onShowDocuments={handleShowDocuments}
            />
        </div>
    );
}
