import React from "react";

export default function InputField({ label, type = "text", options = [] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#263238]">{label}</label>
      {type === "select" ? (
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#263238] bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Pilih...</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#263238] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
    </div>
  );
}
