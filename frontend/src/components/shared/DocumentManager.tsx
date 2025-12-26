import React, { useState, useRef } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { FileText, Trash2, Upload, ExternalLink, Loader2, X } from 'lucide-react';

interface DocumentManagerProps {
    assetType: string;
    objectId: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ assetType, objectId }) => {
    const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments(assetType, objectId);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadDocument(file);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Documents
                </h3>
                <button
                    onClick={handleUploadClick}
                    disabled={loading || isUploading}
                    className="btn btn-sm btn-primary text-white flex gap-2 items-center"
                >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white border rounded-lg overflow-hidden">
                {documents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No documents attached yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {documents.map((doc) => (
                            <li key={doc.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-700 truncate" title={doc.name}>
                                        {doc.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                        title="View document"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <button
                                        onClick={() => deleteDocument(doc.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                        title="Delete document"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {(loading && documents.length === 0) && (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
};
