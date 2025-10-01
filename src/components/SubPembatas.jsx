import React, { useState } from 'react';
import InputField from './InputField';

// Menerima props 'values' dan 'onChange' dari komponen induk
export default function SubPembatas({ title, namePrefix, values, onChange }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 font-semibold bg-yellow-400 text-[#263238] flex justify-between items-center hover:bg-yellow-300 transition"
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="p-4 grid gap-4 bg-gray-50">
          <InputField 
            label="Phasa R" 
            name={`${namePrefix}R`} 
            value={values[`${namePrefix}R`]} 
            onChange={onChange} 
          />
          <InputField 
            label="Phasa S" 
            name={`${namePrefix}S`} 
            value={values[`${namePrefix}S`]} 
            onChange={onChange} 
          />
          <InputField 
            label="Phasa T" 
            name={`${namePrefix}T`} 
            value={values[`${namePrefix}T`]} 
            onChange={onChange} 
          />
        </div>
      )}
    </div>
  );
}