import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { realEstateService } from '@/services/realEstateService';
import { RealEstate, CreateRealEstateInput } from '@/types/realEstate';
import { setAuthToken } from '@/lib/api';

export const useRealEstate = () => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [properties, setProperties] = useState<RealEstate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //useCallback dit : "Garde la même fonction fetchProperties en mémoire 
    //tant que isLoaded, isSignedIn ou getToken ne changent pas."
    const fetchProperties = useCallback(async () => {
        if (!isLoaded || !isSignedIn) return;

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            setAuthToken(token);
            const data = await realEstateService.getAll();
            setProperties(data);
        } catch (err) {
            setError('Failed to fetch properties');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn, getToken]);

    // Initial fetch
    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const addProperty = async (data: CreateRealEstateInput) => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const newProperty = await realEstateService.create(data);
            setProperties(prev => [...prev, newProperty]);
            return newProperty;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deleteProperty = async (id: string) => {
        try {
            const token = await getToken();
            setAuthToken(token);
            await realEstateService.delete(id);
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return {
        properties,
        loading,
        error,
        refetch: fetchProperties,
        addProperty,
        deleteProperty
    };
};
