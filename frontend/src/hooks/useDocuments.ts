import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { documentService, AssetDocument } from '../services/documentService';
import { setAuthToken } from '../lib/api';

export const useDocuments = (assetType: string, objectId: string) => {
    const [documents, setDocuments] = useState<AssetDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isLoaded, isSignedIn, getToken } = useAuth();

    const fetchDocuments = useCallback(async () => {
        if (!isLoaded || !isSignedIn || !objectId) return;

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            setAuthToken(token);
            const data = await documentService.getDocuments(assetType, objectId);
            setDocuments(data);
        } catch (err) {
            setError('Failed to fetch documents');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn, getToken, assetType, objectId]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const uploadDocument = async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            setAuthToken(token);
            const newDoc = await documentService.upload(assetType, objectId, file);
            setDocuments(prev => [...prev, newDoc]);
            return newDoc;
        } catch (err) {
            setError('Failed to upload document');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            setAuthToken(token);
            await documentService.delete(documentId);
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        } catch (err) {
            setError('Failed to delete document');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        documents,
        loading,
        error,
        uploadDocument,
        deleteDocument,
        refreshDocuments: fetchDocuments
    };
};
