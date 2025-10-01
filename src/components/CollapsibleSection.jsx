import React, { useState } from 'react';

export default function CollapsibleSection({ title, color, children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-4 py-3 font-semibold flex justify-between items-center transition ${color} text-[#263238] hover:brightness-95`}
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-4 grid gap-4 bg-gray-50">{children}</div>}
    </div>
  );
}