import React, { useState } from "react";

export default function Section({ title, color, children, open = false }) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-3 font-semibold flex justify-between items-center transition ${color} text-[#263238] hover:brightness-95`}
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="p-4 grid gap-4 bg-gray-50">{children}</div>}
    </div>
  );
}
