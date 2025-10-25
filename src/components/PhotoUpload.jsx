import React, { useState, useEffect } from "react";

export default function PhotoUpload({ value = [], onChange }) {
  const [photos, setPhotos] = useState([
    { file: null, url: "", desc: "" },
    { file: null, url: "", desc: "" },
    { file: null, url: "", desc: "" },
  ]);

  // Sync ke parent setiap kali photos berubah
  useEffect(() => {
    if (onChange) {
      // kirim ke parent dalam bentuk array
      onChange(photos);
    }
  }, [photos, onChange]);

  const handlePhotoChange = (index, file) => {
    if (!file) return;
    const newPhotos = [...photos];
    newPhotos[index].file = file;
    newPhotos[index].url = URL.createObjectURL(file);
    setPhotos(newPhotos);
  };

  const handleDescChange = (index, desc) => {
    const newPhotos = [...photos];
    newPhotos[index].desc = desc;
    setPhotos(newPhotos);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    if (newPhotos[index].url) {
      URL.revokeObjectURL(newPhotos[index].url);
    }
    newPhotos[index] = { file: null, url: "", desc: "" };
    setPhotos(newPhotos);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="block">
            <span className="sr-only">Choose photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(index, e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>

          {photo.url && (
            <div className="relative">
              <img
                src={photo.url}
                alt={`upload-${index}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                X
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Deskripsi foto"
            value={photo.desc}
            onChange={(e) => handleDescChange(index, e.target.value)}
            className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      ))}
    </div>
  );
}
