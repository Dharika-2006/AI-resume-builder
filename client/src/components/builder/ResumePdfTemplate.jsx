import ResumePreview from './ResumePreview';

/**
 * ResumePdfTemplate
 * - Dedicated export template component for PDF generation
 * - Reuses the exact same visual structure, data, and styling as ResumePreview
 * - Constrained to a fixed width of 794px to match on-screen spacing exactly
 */
export default function ResumePdfTemplate({ data }) {
  return (
    <div
      id="resume-pdf-template-root"
      className="resume-export-theme"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0',
        minHeight: 'auto',
        background: '#020617',
        boxSizing: 'border-box',
      }}
    >
      <ResumePreview data={data} isExport={true} />
    </div>
  );
}
