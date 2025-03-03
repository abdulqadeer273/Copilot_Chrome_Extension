// src/components/FileDownload.tsx
import React from 'react';

const files: { [key: number]: { name: string; url: string }[] } = {
    101: [{ name: 'LinkedIn_Data_Enrichment.zip', url: '/path/to/LinkedIn_Data_Enrichment.zip' }],
    102: [{ name: 'AI_Research.zip', url: '/path/to/AI_Research.zip' }],
    103: [{ name: 'Account_Research.zip', url: '/path/to/Account_Research.zip' }],
    104: [{ name: 'LinkedIn_Targeting.zip', url: '/path/to/LinkedIn_Targeting.zip' }],
    201: [{ name: 'Content_Strategy.zip', url: '/path/to/Content_Strategy.zip' }],
    202: [{ name: 'Content_Creation.zip', url: '/path/to/Content_Creation.zip' }],
    301: [{ name: 'SEO_Optimization.zip', url: '/path/to/SEO_Optimization.zip' }],
    302: [{ name: 'PPC_Campaigns.zip', url: '/path/to/PPC_Campaigns.zip' }]
};

interface FileDownloadProps {
    subcategoryId: number;
    onBack: () => void;
}

const FileDownload: React.FC<FileDownloadProps> = ({ subcategoryId, onBack }) => {
    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: '10px', backgroundColor: '#ddd', padding: '5px' }}>
                ← Back
            </button>
            <h2>Download Files</h2>
            <ul>
                {files[subcategoryId]?.map((file) => (
                    <li key={file.name}>
                        <a href={file.url} download>
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileDownload;
