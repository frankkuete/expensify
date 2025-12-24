"use client";

import { useState } from 'react';
import { PropertyType, CreateRealEstateInput, RealEstate } from "@/types/realEstate";

interface RealEstateFormProps {
    onAdd: (data: CreateRealEstateInput) => Promise<RealEstate>;
}

export default function RealEstateForm({ onAdd }: RealEstateFormProps) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await onAdd(formData);
            setSuccess(true);
            // Reset form
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
        } catch (err) {
            console.error(err);
            setError("Failed to create property");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">Property created successfully!</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Value</label>
                    <input type="number" name="value" value={formData.value} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Surface (m²)</label>
                    <input type="number" name="surface" value={formData.surface} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full border rounded p-2">
                        {Object.values(PropertyType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Property'}
            </button>
        </form>
    );
}
