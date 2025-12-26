"use client";

import { useState, useEffect } from 'react';
import { PropertyType, CreateRealEstateInput, RealEstate, UpdateRealEstateInput } from "@/types/realEstate";
import { DollarSign, Euro, PoundSterling, Loader2 } from "lucide-react";

interface RealEstateFormProps {
    existingProperty?: RealEstate;
    onAdd?: (data: CreateRealEstateInput) => Promise<RealEstate>;
    onUpdate?: (id: string, data: UpdateRealEstateInput) => Promise<RealEstate>;
}

export default function RealEstateForm({ existingProperty, onAdd, onUpdate }: RealEstateFormProps) {
    const isEditMode = !!existingProperty;
    const [formData, setFormData] = useState<CreateRealEstateInput>({
        name: '',
        description: '',
        value: 0,
        currency: 'USD',
        location: '',
        address: '',
        surface: 0,
        yearBuilt: new Date().getFullYear(),
        propertyType: PropertyType.HOUSE,
        rooms: 0,
        bathrooms: 0,
        hasParking: false,
        hasGarden: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Pre-populate form in edit mode, reset in create mode
    useEffect(() => {
        if (existingProperty) {
            setFormData({
                name: existingProperty.name,
                description: existingProperty.description || '',
                value: Number(existingProperty.value),
                currency: existingProperty.currency || 'USD',
                location: existingProperty.location,
                address: existingProperty.address,
                surface: Number(existingProperty.surface),
                yearBuilt: existingProperty.yearBuilt || new Date().getFullYear(),
                propertyType: existingProperty.propertyType,
                rooms: existingProperty.rooms ?? undefined,
                bathrooms: existingProperty.bathrooms ?? undefined,
                hasParking: existingProperty.hasParking ?? false,
                hasGarden: existingProperty.hasGarden ?? false
            });
        } else {
            // Reset to empty form when switching to create mode
            setFormData({
                name: '',
                description: '',
                value: 0,
                currency: 'USD',
                location: '',
                address: '',
                surface: 0,
                yearBuilt: new Date().getFullYear(),
                propertyType: PropertyType.HOUSE,
                rooms: 0,
                bathrooms: 0,
                hasParking: false,
                hasGarden: false
            });
        }
    }, [existingProperty]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        console.log(formData);
        try {
            if (isEditMode && onUpdate && existingProperty) {
                await onUpdate(existingProperty.id, formData);
                setSuccess(true);
            } else if (onAdd) {
                await onAdd(formData);
                setSuccess(true);
                // Reset form only in create mode
                setFormData({
                    name: '',
                    description: '',
                    value: 0,
                    currency: 'USD',
                    location: '',
                    address: '',
                    surface: 0,
                    yearBuilt: new Date().getFullYear(),
                    propertyType: PropertyType.HOUSE,
                    rooms: 0,
                    bathrooms: 0,
                    hasParking: false,
                    hasGarden: false
                });
            }
        } catch (err: any) {
            console.error(err);
            const backendError = err.response?.data?.error;
            if (Array.isArray(backendError)) {
                // Handle Zod issues array
                const messages = backendError.map((issue: any) => issue.message).join(", ");
                setError(`Validation error: ${messages}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError(isEditMode ? "Failed to update property" : "Failed to create property");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrencyIcon = () => {
        switch (formData.currency) {
            case 'EUR': return <Euro className="h-4 w-4 text-gray-500" />;
            case 'GBP': return <PoundSterling className="h-4 w-4 text-gray-500" />;
            default: return <DollarSign className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Property Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Seaside Villa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Description <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Add any additional details about the property..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Estimated Value <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                        <div className="absolute left-3 pointer-events-none">
                            {getCurrencyIcon()}
                        </div>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute right-0 inset-y-0 flex items-center">
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="h-full px-3 bg-gray-50 border-l border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Location (City) <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Surface (m²) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="surface"
                        value={formData.surface}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Type
                    </label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {Object.values(PropertyType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Conditional fields for HOUSE and APARTMENT */}
                {(formData.propertyType === PropertyType.HOUSE || formData.propertyType === PropertyType.APARTMENT) && (
                    <>
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-2">Additional Property Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Year Built <span className="text-gray-500 text-xs">(optional)</span>
                            </label>
                            <input
                                type="number"
                                name="yearBuilt"
                                value={formData.yearBuilt || ''}
                                onChange={handleChange}
                                min="1800"
                                max={new Date().getFullYear() + 1}
                                placeholder="e.g. 2020"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Rooms <span className="text-gray-500 text-xs">(optional)</span>
                            </label>
                            <input
                                type="number"
                                name="rooms"
                                value={formData.rooms || ''}
                                onChange={handleChange}
                                min="0"
                                placeholder="Number of rooms"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Bathrooms <span className="text-gray-500 text-xs">(optional)</span>
                            </label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms || ''}
                                onChange={handleChange}
                                min="0"
                                placeholder="Number of bathrooms"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasParking"
                                        checked={formData.hasParking || false}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium">Has Parking</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasGarden"
                                        checked={formData.hasGarden || false}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium">Has Garden</span>
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </div>


            <button
                type="submit"
                style={submitting ? { opacity: 0.8, pointerEvents: 'none' } : undefined}
                className="btn btn-primary w-full text-white"
            >
                {submitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Property' : 'Create Property')}
            </button>
        </form>
    );
}
