// src/pages/Templates.tsx
import CategoryButtons from './components/CategorySelection';

const Templates = () => {
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "large", fontWeight: "bold", marginBottom: 0 }}>n8n Workflow Templates</p>
                <p style={{ marginTop: 0 }}>Select a category to get started</p>
            </div>
            <CategoryButtons />
        </div>
    );
};

export default Templates;
