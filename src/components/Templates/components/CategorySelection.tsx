// src/components/CategorySelection.tsx
import React, { useState } from 'react';

const categories = [
  { name: 'AI Productivity Tools', id: 1 },
  { name: 'Social Media Automation', id: 2 },
  { name: 'AI Content Creation', id: 3 }
];

const subcategories: { [key: number]: { name: string; id: number; file: string; }[] } = {
  1: [
    { name: 'AI Research', id: 101, file: '/AI_Research_Assistant_Workflow.zip' },
  ],
  2: [
    { name: 'LinkedIn Automation', id: 201, file: '/Telegram_linkedin_poster.zip' },
  ],
  3: [
    { name: 'AI Newsletter Writer', id: 301, file: '/AI_Newsletter_writer.zip' },
  ]
};

const CategorySelection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  return (
    <div style={styles.container}>
      {selectedCategory === null ? (
        // <div style={styles.buttonContainer}>
        <>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={styles.mainButton}
            >
              {category.name}
            </button>
          ))}
        </>
        // </div>
      ) : (
        <div style={styles.subbuttonContainer}>
          <button onClick={() => setSelectedCategory(null)} style={styles.backButton}>← Back</button>
          <div>
            <h4 style={styles.heading}>{categories[selectedCategory - 1]?.name}</h4>
            <p style={{ marginTop: 0 }}>Select a workflow template to download</p>
          </div>
          {subcategories[selectedCategory]?.map((subcategory) => (
            <div key={subcategory.id} style={styles.subButtonContainer}>
              <h3 style={{ margin: 0, marginBottom: ".5rem" }}>{subcategory.name}</h3>
              <a href={subcategory.file} download>
                <button style={styles.downloadButton}>⬇ Download Template</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 🌟 STYLES
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    // alignItems: 'center',
    // padding: '20px'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '15px'
  },
  subbuttonContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '0',
    marginTop: '0'
  },
  mainButton: {
    width: '280px',
    paddingLeft: '.75rem',
    paddingRight: ".75rem",
    paddingTop: ".5rem",
    paddingBottom: "0.5rem",
    fontSize: '.875rem',
    fontWeight: '600',
    borderRadius: '0.25rem',
    border: '1px solid #14b8a6',
    backgroundColor: '#14b8a6',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '.5rem'
  } as React.CSSProperties,
  subButtonContainer: {
    alignItems: 'center',
    background: "white",
    padding: "1rem",
    borderRadius: "0.2rem"
  },
  subButton: {
    width: '250px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '2px solid #2196f3',
    backgroundColor: '#2196f3',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
  } as React.CSSProperties,
  downloadButton: {
    paddingLeft: '1rem',
    paddingRight: "1rem",
    paddingTop: ".1rem",
    paddingBottom: ".1rem",
    lineHeight: "1rem",
    fontSize: '.75rem',
    borderRadius: '.25rem',
    border: '2px solid #0d9488',
    backgroundColor: '#0d9488',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  backButton: {
    paddingLeft: '1rem',
    paddingRight: "1rem",
    paddingTop: ".5rem",
    paddingBottom: ".5rem",
    lineHeight: "1rem",
    fontSize: '.75rem',
    borderRadius: '.25rem',
    border: '2px solid #0d9488',
    backgroundColor: '#0d9488',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: "max-content"
  } as React.CSSProperties
};

export default CategorySelection;
