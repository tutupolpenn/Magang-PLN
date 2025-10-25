import React from "react";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  options = [],
  required = false,
  readOnly = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#263238]">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={readOnly}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#263238] bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Pilih...</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={onChange}
          className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#263238] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
    </div>
  );
}
