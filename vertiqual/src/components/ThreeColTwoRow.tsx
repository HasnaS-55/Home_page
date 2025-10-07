// src/components/ThreeColTwoRow.tsx
import React, { ReactNode } from "react";

interface ThreeColTwoRowProps {
  children: ReactNode[]; // exactly 6 children
}

export default function ThreeColTwoRow({ children }: ThreeColTwoRowProps) {
  // Split into three columns of two items each
  const cols = [
    children.slice(0, 2),
    children.slice(2, 4),
    children.slice(4, 6),
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cols.map((colItems, colIndex) => (
        // FIXED 600px height container
        <div key={colIndex} className="flex flex-col h-[600px] gap-4">
          {colItems.map((child, idx) => (
            // flex-none prevents auto-stretch; h-[XX%] will be % of 600px
            <div
              key={idx}
              className="w-full rounded-[20px]  text-white flex items-center justify-center"
            >
              {child}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
