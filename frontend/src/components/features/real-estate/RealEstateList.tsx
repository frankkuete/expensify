"use client";

import { RealEstate } from "@/types/realEstate";

interface RealEstateListProps {
    properties: RealEstate[];
    loading: boolean;
    error: string | null;
    onDelete: (id: string) => Promise<void>;
}

export default function RealEstateList({ properties, loading, error, onDelete }: RealEstateListProps) {

    if (loading) return <div>Loading real estate assets...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Real Estate Assets</h2>
            {properties.length === 0 ? (
                <p>No properties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                        <div key={property.id} className="border p-4 rounded shadow hover:shadow-lg transition">
                            <h3 className="font-semibold text-lg">{property.name}</h3>
                            <p className="text-sm text-gray-500">{property.location}</p>
                            <p className="font-bold mt-2">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency }).format(property.value)}
                            </p>
                            <div className="mt-4 flex justify-between">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.propertyType}</span>
                                <button
                                    onClick={() => onDelete(property.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
