<fieldset>
            <legend className="block text-lg font-semibold mb-4">Pilih Jenis Perbaikan</legend>

            {/* ===================== OPTION 1: GANTI TRAFO ======================== */}
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="gantiTrafo"
                name="perbaikan"
                value="gantiTrafo"
                checked={jenisPerbaikan === "gantiTrafo"}
                onChange={handleJenisPerbaikanChange}
                className="w-5 h-5 text-blue-500"
              />
              <label htmlFor="gantiTrafo" className="cursor-pointer">Ganti Trafo</label>
            </div>

            {jenisPerbaikan === "gantiTrafo" && (
              <div className="mt-3 ml-8 space-y-3 md:w-1/2">
                <input 
                  type="text" 
                  name="merk" 
                  placeholder="Merk Trafo" 
                  value={gantiTrafoData.merk} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="noSeri" 
                  placeholder="Nomor Seri" 
                  value={gantiTrafoData.noSeri} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="kapasitas" 
                  placeholder="Kapasitas (kVA)" 
                  value={gantiTrafoData.kapasitas} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="tahun" 
                  placeholder="Tahun Buat" 
                  value={gantiTrafoData.tahun} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Name Plate
                  </label>
                  <input 
                    type="file" 
                    name="fotoNamePlate" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                  />
                  {gantiTrafoData.fotoNamePlate && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      ✓ File: {gantiTrafoData.fotoNamePlate.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ====================== OPTION 2: GANTI TRAFO MOBILE ======================= */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="gantiTrafoMobile" 
                  name="perbaikan" 
                  value="gantiTrafoMobile" 
                  checked={jenisPerbaikan === "gantiTrafoMobile"} 
                  onChange={handleJenisPerbaikanChange} 
                  className="w-5 h-5 text-blue-500" 
                />
                <label htmlFor="gantiTrafoMobile" className="cursor-pointer">Ganti Trafo Mobile</label>
              </div>

              {jenisPerbaikan === "gantiTrafoMobile" && (
                <input 
                  type="text" 
                  placeholder="Kapasitas (kVA)" 
                  value={kapasitasMobile} 
                  onChange={(e) => setKapasitasMobile(e.target.value)} 
                  className="border p-2 rounded-md md:w-1/2 shadow-sm mt-3 ml-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              )}
            </div>

            {/* ====================== OPTION 3: KOPEL TRAFO SEBELAH ======================= */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="kopelTrafoSebelah" 
                  name="perbaikan" 
                  value="kopelTrafoSebelah" 
                  checked={jenisPerbaikan === "kopelTrafoSebelah"} 
                  onChange={handleJenisPerbaikanChange} 
                  className="w-5 h-5 text-blue-500" 
                />
                <label htmlFor="kopelTrafoSebelah" className="cursor-pointer">Kopel Trafo Sebelah</label>
              </div>

              {jenisPerbaikan === "kopelTrafoSebelah" && (
                <div className="space-y-3 mt-3 ml-8">
                  {trafoList.map((trafo, index) => (
                    <div key={index} className="flex items-center gap-2 w-full md:w-1/2">
                      <input 
                        type="text" 
                        placeholder={`Trafo ${index + 1}`} 
                        value={trafo} 
                        onChange={(e) => updateTrafo(index, e.target.value)} 
                        className="flex-1 border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                      {trafoList.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTrafo(index)} 
                          className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="Hapus trafo"
                        >
                          <HiOutlineTrash className="text-xl" />
                        </button>
                      )}
                    </div>
                  ))}

                  {trafoList.length < 5 && (
                    <button 
                      type="button" 
                      onClick={addTrafo} 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border transition-colors"
                    >
                      <HiOutlinePlusCircle className="text-xl" />
                      Tambah Trafo
                    </button>
                  )}
                </div>
              )}
            </div>
          </fieldset>
