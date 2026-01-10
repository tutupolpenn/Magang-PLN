import React, { useState } from "react";

export default function PhotoUpload({ formData, setFormData }) {
  const [previews, setPreviews] = useState({
    foto1: null,
    foto2: null,
    foto3: null
  });
  
  const [files, setFiles] = useState({
    foto1: null,
    foto2: null,
    foto3: null
  });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      e.target.value = '';
      return;
    }

    // Simpan file object untuk dikirim ke backend
    setFiles(prev => ({ ...prev, [fieldName]: file }));
    
    // Simpan juga ke formData agar bisa dikirim saat submit
    setFormData(prev => ({
      ...prev,
      [`${fieldName}_file`]: file
    }));
    
    // Buat preview
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [fieldName]: previewUrl }));
    
    e.target.value = '';
  };

  const removePhoto = (fieldName) => {
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName]);
    }
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[`${fieldName}_file`];
      return newData;
    });
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const renderPhotoInput = (fieldName, label) => {
    const hasPhoto = files[fieldName];
    
    return (
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">{label}</label>
        
        {hasPhoto ? (
          <div className="relative group">
            <img 
              src={previews[fieldName]} 
              alt={label}
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => removePhoto(fieldName)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            >
              ✕ Hapus
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              ✓ Siap dikirim ({Math.round(files[fieldName].size / 1024)}KB)
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, fieldName)}
              className="hidden"
              id={fieldName}
            />
            <label 
              htmlFor={fieldName}
              className="cursor-pointer"
            >
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-medium">Pilih foto</p>
                <p className="text-xs text-gray-400 mt-1">Max 10MB (JPG, PNG, GIF, WebP)</p>
              </div>
            </label>
          </div>
        )}
      </div>
    );
  };

  const hasPhotos = files.foto1 || files.foto2 || files.foto3;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          💡 <strong>Info:</strong> Foto akan dikirim bersama data laporan saat Anda klik "Submit Laporan"
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderPhotoInput("foto1", "Foto 1 (Opsional)")}
        {renderPhotoInput("foto2", "Foto 2 (Opsional)")}
        {renderPhotoInput("foto3", "Foto 3 (Opsional)")}
      </div>

      {hasPhotos && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            ✓ {Object.values(files).filter(f => f).length} foto siap dikirim
          </p>
        </div>
      )}
    </div>
  );
}