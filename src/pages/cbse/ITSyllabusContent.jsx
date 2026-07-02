import React from 'react'

export default function ITSyllabusContent() {
  return (
    <div style={{
      background: 'rgba(22,27,34,0.85)',
      border: '1px solid #30363d',
      borderRadius: 14,
      padding: '32px clamp(20px, 5vw, 40px)',
      backdropFilter: 'blur(12px)',
      color: '#e6edf3',
      lineHeight: 1.6,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      marginTop: 20
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #21262d' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 12, color: '#56d364' }}>
          CBSE Class 10 Information Technology (402)
        </h1>
        <div style={{ fontSize: '0.9rem', color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase' }}>
          Syllabus 2026–27
        </div>
      </div>

      <p style={{ color: '#8b949e', fontSize: '0.95rem', marginBottom: 32 }}>
        The CBSE Class 10 Information Technology (402) curriculum for the Academic Session 2026–27 is designed to help students develop digital literacy, office productivity skills, database management knowledge, workplace ethics, and employability skills. The syllabus consists of Theory, Practical, Project Work, and Internal Assessment.
      </p>

      {/* Course Overview */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e6edf3', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 4, height: 20, background: '#56d364', borderRadius: 4 }} />
          Course Overview
        </h2>
        <div style={{ background: 'rgba(86,211,100,0.05)', border: '1px solid rgba(86,211,100,0.15)', borderRadius: 12, padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div><strong style={{ color: '#8b949e' }}>Board:</strong> <br/>CBSE</div>
          <div><strong style={{ color: '#8b949e' }}>Class:</strong> <br/>10</div>
          <div><strong style={{ color: '#8b949e' }}>Subject:</strong> <br/>Information Technology (402)</div>
          <div><strong style={{ color: '#8b949e' }}>Session:</strong> <br/>2026–27</div>
          <div><strong style={{ color: '#8b949e' }}>Total Marks:</strong> <br/>100</div>
        </div>
      </div>

      {/* Marks Distribution Table */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 16 }}>Marks Distribution</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 400 }}>
            <thead>
              <tr style={{ background: '#21262d' }}>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #30363d', color: '#e6edf3' }}>Component</th>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #30363d', color: '#e6edf3', textAlign: 'right' }}>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e' }}>Theory</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e', textAlign: 'right' }}>50</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e' }}>Practical Examination</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e', textAlign: 'right' }}>35</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e' }}>Project Work</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e', textAlign: 'right' }}>10</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e' }}>Viva Voce</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', color: '#8b949e', textAlign: 'right' }}>5</td>
              </tr>
              <tr style={{ background: 'rgba(86,211,100,0.05)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#e6edf3' }}>Total</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#e6edf3', textAlign: 'right' }}>100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ height: 1, background: '#21262d', margin: '40px 0' }} />

      {/* Part A */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#56d364', marginBottom: 24 }}>
          Part A – Employability Skills (10 Marks)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { unit: 'Unit 1: Communication Skills – II', items: ['Methods of effective communication', 'Verbal and non-verbal communication', 'Communication barriers', 'Active listening skills', 'Writing formal and informal messages', 'Basic presentation skills'] },
            { unit: 'Unit 2: Self-Management Skills – II', items: ['Self-awareness', 'Stress management', 'Time management', 'Goal setting', 'Personal hygiene', 'Positive attitude and self-confidence'] },
            { unit: 'Unit 3: ICT Skills – II', items: ['Digital devices', 'Operating systems', 'Internet services', 'Cloud computing', 'Online collaboration tools', 'Digital safety and security'] },
            { unit: 'Unit 4: Entrepreneurial Skills – II', items: ['Entrepreneurship', 'Business opportunities', 'Business planning', 'Risk management', 'Financial literacy', 'Innovation and creativity'] },
            { unit: 'Unit 5: Green Skills – II', items: ['Sustainable development', 'Green economy', 'Environmental protection', 'Waste management', 'Energy conservation', 'Eco-friendly workplace practices'] },
          ].map((section, i) => (
            <div key={i} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>{section.unit}</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#8b949e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: '#21262d', margin: '40px 0' }} />

      {/* Part B */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#56d364', marginBottom: 24 }}>
          Part B – Subject Specific Skills (40 Marks)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { unit: 'Unit 1: Digital Documentation (Advanced)', items: ['Working with Styles', 'Creating and Modifying Templates', 'Table of Contents', 'Mail Merge', 'Track Changes', 'Working with Images', 'Page Layout', 'Document Formatting', 'Printing Documents'] },
            { unit: 'Unit 2: Electronic Spreadsheet (Advanced)', items: ['Advanced Formulas', 'Functions', 'Goal Seek', 'Scenarios', 'Macros', 'Linking Worksheets', 'Data Validation', 'Sorting and Filtering', 'Charts', 'Spreadsheet Sharing'] },
            { unit: 'Unit 3: Database Management System', items: ['Introduction to Database', 'DBMS Concepts', 'Tables', 'Records and Fields', 'Primary Key', 'Forms', 'Queries', 'Reports', 'Relationships', 'Database Management using LibreOffice Base'] },
            { unit: 'Unit 4: Maintain Healthy, Safe and Secure Working Environment', items: ['Workplace Safety', 'Health Hazards', 'Fire Safety', 'Emergency Procedures', 'Ergonomics', 'Computer Lab Safety', 'Environmental Protection', 'Workplace Security'] },
          ].map((section, i) => (
            <div key={i} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>{section.unit}</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#8b949e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: '#21262d', margin: '40px 0' }} />

      {/* Other Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>Practical Examination</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#8b949e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Advanced Writer & Calc</li>
            <li>LibreOffice Base</li>
            <li>Mail Merge</li>
            <li>Database Creation (Forms, Reports)</li>
            <li>Spreadsheet Functions & Charts</li>
            <li>Templates & Macros</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>Project Work</h3>
          <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: 0 }}>
            Students are required to complete a project demonstrating practical knowledge of Information Technology. The project should encourage creativity, problem-solving, documentation, and presentation skills.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>Viva Voce</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#8b949e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Practical knowledge</li>
            <li>Understanding of concepts</li>
            <li>Project work</li>
            <li>Software usage</li>
            <li>Database and spreadsheet concepts</li>
          </ul>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div style={{ background: 'rgba(13,17,23,0.5)', border: '1px solid #21262d', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>Learning Outcomes</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#8b949e', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>Create professional documents using word processing software.</li>
          <li>Perform advanced spreadsheet operations and data analysis.</li>
          <li>Design and manage databases.</li>
          <li>Apply workplace health and safety practices.</li>
          <li>Communicate effectively using digital tools.</li>
          <li>Demonstrate employability and entrepreneurial skills.</li>
          <li>Use Information Technology responsibly and securely.</li>
        </ul>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#8b949e', fontStyle: 'italic', textAlign: 'center', opacity: 0.8 }}>
        Official Reference: Students are advised to refer to the latest CBSE Academic Curriculum and Sample Papers for the Academic Session 2026–27 to stay updated with any changes announced by CBSE.
      </div>

    </div>
  )
}
