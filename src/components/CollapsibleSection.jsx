import { useState } from "react";

export default function CollapsibleSection({ title, color, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-lg mb-4 ${color}`}>
      {/* Tombol judul section */}
      <button
        type="button" // 🔑 penting: biar tidak trigger submit
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 font-semibold text-left"
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Konten collapsible */}
      {isOpen && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
}
