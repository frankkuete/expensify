import api from '../lib/api';

export interface AssetDocument {
    id: string;
    name: string;
    url: string;
    objectId: string;
    objectType: string;
    createdAt: string;
}

export const documentService = {
    upload: async (assetType: string, objectId: string, file: File): Promise<AssetDocument> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/documents/${assetType}/${objectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getDocuments: async (assetType: string, objectId: string): Promise<AssetDocument[]> => {
        const response = await api.get(`/documents/${assetType}/${objectId}`);
        return response.data;
    },

    delete: async (documentId: string): Promise<{ message: string }> => {
        const response = await api.delete(`/documents/${documentId}`);
        return response.data;
    },
};
