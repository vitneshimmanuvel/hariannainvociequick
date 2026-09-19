import React from 'react';

/**
 * Authentic Handwritten Signature "A. P H." matching Image 1 exactly
 */
export function PresetSignature() {
  return (
    <div className="py-0.5 inline-block">
      <svg
        viewBox="0 0 170 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: '42px', width: 'auto', display: 'block' }}
      >
        {/* Slanted handwritten 'A' */}
        <path
          d="M 12 38 C 16 26, 24 14, 30 6 C 33 16, 40 28, 46 38"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crossbar of A */}
        <path
          d="M 18 26 Q 30 23, 42 27"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Ink dot after A */}
        <circle cx="53" cy="36" r="2.2" fill="#000000" />

        {/* Fluid cursive 'P' */}
        <path
          d="M 65 6 L 64 38"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 65 7 Q 85 5, 87 18 Q 87 28, 65 28"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fluid cursive 'H' */}
        <path
          d="M 98 6 L 97 38"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 98 21 Q 110 18, 120 22"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 119 6 L 118 38"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Ink dot after H */}
        <circle cx="128" cy="36" r="2.2" fill="#000000" />

        {/* Natural signature flourish line */}
        <path
          d="M 18 41 Q 70 45, 138 40"
          stroke="#000000"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
