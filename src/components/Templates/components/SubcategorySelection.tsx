// src/components/SubcategorySelection.tsx
import React, { useState } from 'react';
import FileDownload from './FileDownload';

const subcategories: { [key: number]: { name: string; id: number }[] } = {
  1: [
    { name: 'LinkedIn Data Enrichment (Waterfall)', id: 101 },
    { name: 'AI Research (Not Available in Databases)', id: 102 },
    { name: 'Account Research (Not People)', id: 103 },
    { name: 'LinkedIn Level Targeting in Other Channels', id: 104 }
  ],
  2: [
    { name: 'Content Strategy Research', id: 201 },
    { name: 'Content Creation Workflow', id: 202 }
  ],
  3: [
    { name: 'SEO Optimization', id: 301 },
    { name: 'PPC Campaigns', id: 302 }
  ]
};

interface SubcategorySelectionProps {
  categoryId: number;
  onBack: () => void;
}

const SubcategorySelection: React.FC<SubcategorySelectionProps> = ({ categoryId, onBack }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  return (
    <div>
      {selectedSubcategory === null ? (
        <div>
          <button onClick={onBack} style={{ marginBottom: '10px', backgroundColor: '#ddd', padding: '5px' }}>
            ← Back
          </button>
          <h2>Subcategories</h2>
          {subcategories[categoryId]?.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory.id)}
              style={{ display: 'block', margin: '10px', padding: '10px', backgroundColor: '#2196f3', color: '#fff' }}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      ) : (
        <FileDownload subcategoryId={selectedSubcategory} onBack={() => setSelectedSubcategory(null)} />
      )}
    </div>
  );
};

export default SubcategorySelection;
