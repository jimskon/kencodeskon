'use client';

import React from 'react';

const mockAssignments = [
  { id: 'assignment-1', title: 'Array Practice', ideUrl: 'http://138.28.162.111:3001?file=assignment-1' },
  { id: 'assignment-2', title: 'Sorting Algorithms', ideUrl: 'http://138.28.162.111:3001?file=assignment-2' },
  { id: 'assignment-3', title: 'Build a Calculator', ideUrl: 'http://138.28.162.111:3001?file=assignment-3' },
];

export default function DashboardPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to the Dashboard</h1>
      <p style={{ marginBottom: '2rem' }}>Select an assignment to open it in the IDE:</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {mockAssignments.map(assignment => (
          <a 
            key={assignment.id} 
            href={assignment.ideUrl} 
            style={{
              display: 'block',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              textDecoration: 'none',
              backgroundColor: '#1f2937',
              width: '200px',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)'
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1f2937')}
          >
            <strong>{assignment.title}</strong>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>Click to open in IDE</p>
          </a>
        ))}
      </div>
    </main>
  );
}
