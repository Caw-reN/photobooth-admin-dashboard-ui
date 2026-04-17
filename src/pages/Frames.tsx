import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Plus, Trash2, Check, Settings2, Wand2, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { frameApi, STORAGE_URL } from '../services/frameApi';


export default function Frames() {
  const [frames, setFrames] = useState<any[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<typeof initialFrames[0] | null>(null);
  
  interface PhotoArea {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  const [photoAreas, setPhotoAreas] = useState<PhotoArea[]>([{ id: '1', x: 10, y: 10, width: 80, height: 60 }]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('1');
  const [interaction, setInteraction] = useState<{ type: string, startX: number, startY: number, startArea: PhotoArea, areaId: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const responseData = await frameApi.getAll();

        const dataDariAPI = responseData.data.map((item: any) => ({
          id: item.id,
          name: item.id,
          resolution: 'Original',
          active: item.is_active,
          image: STORAGE_URL + item.image_path,
          coordinates: item.coordinates
        }));
        setFrames(dataDariAPI);
      } catch (error) {
        console.error("Gagal mengambil data dari API", error);
      }
    };
    fetchFrames();
  }, []);




  useEffect(() => {
    if (!interaction) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const dx = ((e.clientX - interaction.startX) / rect.width) * 100;
      const dy = ((e.clientY - interaction.startY) / rect.height) * 100;

      let newArea = { ...interaction.startArea };

      if (interaction.type === 'move') {
        newArea.x = Math.max(0, Math.min(100 - newArea.width, newArea.x + dx));
        newArea.y = Math.max(0, Math.min(100 - newArea.height, newArea.y + dy));
      } else {
        if (interaction.type.includes('w')) {
          const maxDx = newArea.width - 5;
          const actualDx = Math.min(dx, maxDx);
          const finalDx = Math.max(-newArea.x, actualDx);
          newArea.x += finalDx;
          newArea.width -= finalDx;
        }
        if (interaction.type.includes('e')) {
          newArea.width = Math.max(5, Math.min(100 - newArea.x, newArea.width + dx));
        }
        if (interaction.type.includes('n')) {
          const maxDy = newArea.height - 5;
          const actualDy = Math.min(dy, maxDy);
          const finalDy = Math.max(-newArea.y, actualDy);
          newArea.y += finalDy;
          newArea.height -= finalDy;
        }
        if (interaction.type.includes('s')) {
          newArea.height = Math.max(5, Math.min(100 - newArea.y, newArea.height + dy));
        }
      }

      setPhotoAreas(prev => prev.map(a => a.id === interaction.areaId ? {
        ...a,
        x: Math.round(newArea.x * 10) / 10,
        y: Math.round(newArea.y * 10) / 10,
        width: Math.round(newArea.width * 10) / 10,
        height: Math.round(newArea.height * 10) / 10,
      } : a));
    };

    const handleMouseUp = () => setInteraction(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction]);

  const handleMouseDown = (e: React.MouseEvent, type: string, areaId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedAreaId(areaId);
    const area = photoAreas.find(a => a.id === areaId);
    if (!area) return;
    setInteraction({
      type,
      startX: e.clientX,
      startY: e.clientY,
      startArea: { ...area },
      areaId
    });
  };

  const addArea = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setPhotoAreas([...photoAreas, { id: newId, x: 20, y: 20, width: 40, height: 40 }]);
    setSelectedAreaId(newId);
  };

  const removeArea = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newAreas = photoAreas.filter(a => a.id !== id);
    setPhotoAreas(newAreas);
    if (selectedAreaId === id && newAreas.length > 0) {
      setSelectedAreaId(newAreas[0].id);
    } else if (newAreas.length === 0) {
      setSelectedAreaId('');
    }
  };

  const updateArea = (id: string, field: keyof PhotoArea, value: number) => {
    setPhotoAreas(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const autoDetectAreas = async () => {
    if (!selectedFrame) return;
    setIsDetecting(true);
    
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedFrame.image;
      });

      const scale = Math.min(150 / img.width, 150 / img.height);
      const w = Math.floor(img.width * scale);
      const h = Math.floor(img.height * scale);
      
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h).data;
      const visited = new Uint8Array(w * h);
      const newAreas: PhotoArea[] = [];

      const isHole = (x: number, y: number) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return false;
        const i = (y * w + x) * 4;
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];
        const a = imgData[i+3];
        return a < 50 || (r > 240 && g > 240 && b > 240);
      };

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (!visited[y * w + x] && isHole(x, y)) {
            let minX = x, maxX = x, minY = y, maxY = y;
            const queue = [[x, y]];
            visited[y * w + x] = 1;
            let areaPixels = 0;

            while (queue.length > 0) {
              const [cx, cy] = queue.shift()!;
              areaPixels++;
              if (cx < minX) minX = cx;
              if (cx > maxX) maxX = cx;
              if (cy < minY) minY = cy;
              if (cy > maxY) maxY = cy;

              const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
              for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const idx = ny * w + nx;
                  if (!visited[idx] && isHole(nx, ny)) {
                    visited[idx] = 1;
                    queue.push([nx, ny]);
                  }
                }
              }
            }

            const boundingBoxArea = (maxX - minX + 1) * (maxY - minY + 1);
            const rectangularity = areaPixels / boundingBoxArea;
            
            if (boundingBoxArea > (w * h * 0.02) && rectangularity > 0.6) {
              newAreas.push({
                id: Math.random().toString(36).substr(2, 9),
                x: Number(((minX / w) * 100).toFixed(1)),
                y: Number(((minY / h) * 100).toFixed(1)),
                width: Number((((maxX - minX + 1) / w) * 100).toFixed(1)),
                height: Number((((maxY - minY + 1) / h) * 100).toFixed(1))
              });
            }
          } else {
            visited[y * w + x] = 1;
          }
        }
      }

      if (newAreas.length > 0) {
        newAreas.sort((a, b) => a.y - b.y);
        setPhotoAreas(newAreas);
        setSelectedAreaId(newAreas[0].id);
      } else {
        alert("Could not automatically detect transparent/white areas. Please add manually.");
      }
    } catch (err) {
      console.error("Auto-detect failed:", err);
      alert("Failed to analyze image.");
    } finally {
      setIsDetecting(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
console.log("File yang di-drop:", acceptedFiles); 

    if (acceptedFiles.length === 0) {
      alert("Format tidak didukung! Pastikan file adalah PNG.");
      return;
    }
    
    const file = acceptedFiles[0];
    setRawFile(file); 

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        
        const img = new Image();
        img.onload = () => {
          const tempId = "temp_" + Date.now(); 
          const newFrame = {
            id: tempId,
            name: file.name.replace(/\.[^/.]+$/, ""),
            resolution: `${img.width}x${img.height}`,
            active: true,
            image: dataUrl, 
            coordinates: []
          };
          
          setFrames(prev => [newFrame, ...prev]);
          setSelectedFrame(newFrame);
          setPhotoAreas([{ id: '1', x: 10, y: 10, width: 80, height: 60 }]); // Default 1 area
          setSelectedAreaId('1');
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxSize: 5242880 // 5MB
  });

  const toggleFrame = (id: number) => {
    setFrames(frames.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const handleDeleteFrame = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrames(prev => prev.filter(f => f.id !== id));
    if (selectedFrame?.id === id) {
      setSelectedFrame(null);
      setPhotoAreas([]);
    }
  };

  const handleSaveFrame = async () => {
    if (!selectedFrame) {
      alert("Pilih frame dulu dari daftar sebelah kiri!");
      return;
    }
    
    if (String(selectedFrame.id).startsWith("temp_") && !rawFile) {
      alert("Error: File gambar fisik hilang. Silakan refresh dan upload ulang file PNG.");
      return;
    }

    if (photoAreas.length === 0) {
      alert("Silakan tambahkan minimal 1 kotak Photo Area terlebih dahulu.");
      return;
    }

    setIsSaving(true); 

    const formData = new FormData();
    formData.append('name', selectedFrame.name);
    formData.append('coordinates', JSON.stringify(photoAreas)); 
    formData.append('is_active', selectedFrame.active ? '1' : '0');
    
    if (rawFile) {
      formData.append('image', rawFile);
      console.log("File siap dikirim:", rawFile.name); 
    }

    console.log("=== ISI FORMDATA SEBELUM DIKIRIM ===");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]); 
    }
    console.log("====================================");

    // 5. Tembak API via Service yang tadi kita buat
    try {
      const responseData = await frameApi.create(formData);
      
      alert("Mantap! Data berhasil disimpan ke database!");
      
      const savedData = responseData.data;
      const newFrameData = {
        id: savedData.id,
        name: savedData.name,
        active: savedData.is_active,
        image: STORAGE_URL + savedData.image_path,
        coordinates: savedData.coordinates
      };

      setFrames(prev => prev.map(f => f.id === selectedFrame.id ? newFrameData : f));
      setSelectedFrame(newFrameData);
      setRawFile(null); 

    } catch (error: any) {
      console.error("Gagal menyimpan:", error.response || error);
      alert("Gagal menyimpan data ke server. Cek console log.");
    } finally {
      setIsSaving(false); // Matikan efek loading
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frames & Templates</h2>
          <p className="text-slate-700 font-medium mt-1">Manage your photobooth overlays and photo areas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List & Uploader */}
        <div className="lg:col-span-1 space-y-6">
          {/* Uploader */}
          <div 
            {...getRootProps()} 
            className={`border-4 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white hover:border-teal-400 hover:bg-orange-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-yellow-300 rounded-xl flex items-center justify-center text-slate-900 mx-auto mb-4 border-2 border-slate-900 neo-tag rotate-3">
              <Upload className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">PNG transparent only (Max 5MB)</p>
          </div>

          {/* Frame List */}
          <div className="card-neo overflow-hidden">
            <div className="p-4 border-b-2 border-slate-900 bg-yellow-300 font-bold text-slate-900">
              Available Frames
            </div>
            <div className="divide-y-2 divide-slate-900">
              {frames.map((frame) => (
                <div 
                  key={frame.id} 
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${selectedFrame?.id === frame.id ? 'bg-yellow-300' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedFrame(frame)}
                >
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0D2A4A]">
                    <img src={frame.image} alt={frame.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{frame.name}</h4>
                    <p className="text-xs font-bold text-slate-600">{frame.resolution}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFrame(frame.id); }}
                      className={`w-10 h-5 rounded-full relative transition-colors border-2 border-slate-900 ${frame.active ? 'bg-teal-400' : 'bg-slate-200'}`}
                    >
                      <div className={`w-3.5 h-3.5 bg-white border-2 border-slate-900 rounded-full absolute top-[1px] transition-all ${frame.active ? 'left-[22px]' : 'left-[1px]'}`} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteFrame(frame.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-transparent hover:border-red-200"
                      title="Delete Frame"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Coordinate Mapper & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedFrame ? (
            <div className="card-neo p-6 relative">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={handleSaveFrame}
                  disabled={isSaving}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Database'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex-1 w-full flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Frame Name</label>
                  <input
                    type="text"
                    value={selectedFrame.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setSelectedFrame({ ...selectedFrame, name: newName });
                      if (!(selectedFrame as any).isDraft) {
                        setFrames(frames.map(f => f.id === selectedFrame.id ? { ...f, name: newName } : f));
                      }
                    }}
                    className="text-2xl font-black text-slate-900 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0D2A4A] focus:shadow-[4px_4px_0px_0px_#0D2A4A] rounded-xl px-4 py-3 w-full focus:outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter frame name..."
                  />
                  <p className="text-sm font-bold text-slate-600 mt-4 leading-relaxed">Adjust the transparent windows and map them to their corresponding photo area. These coordinates will be used when capturing.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Mapper */}
                <div className="space-y-4 bg-slate-100 p-6 rounded-2xl border border-slate-200 overflow-auto max-h-[800px] flex justify-center items-start">
                  <div 
                    ref={containerRef}
                    className="relative select-none inline-block shadow-sm border border-slate-300 rounded overflow-hidden"
                    style={{
                      backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgfQEhD/o8Ew8gQo2BQMwA3gGjNqAEjI4zQ1IAhO2A0zYyGGUZIAwD1qB0/v+5+sQAAAABJRU5ErkJggg==")'
                    }}
                  >
                    {/* Background Frame */}
                    <img src={selectedFrame.image} alt="Frame" className="w-full max-w-[500px] h-auto block opacity-50 pointer-events-none" referrerPolicy="no-referrer" />
                    
                    {/* Photo Area Overlays */}
                    {photoAreas.map((area, index) => {
                      const isSelected = area.id === selectedAreaId;
                      return (
                        <div 
                          key={area.id}
                          className={`absolute border-2 ${isSelected ? 'border-indigo-500 bg-indigo-500/10 z-20' : 'border-slate-400 bg-slate-400/10 z-10 hover:border-indigo-300'} cursor-move transition-colors`}
                          style={{
                            left: `${area.x}%`,
                            top: `${area.y}%`,
                            width: `${area.width}%`,
                            height: `${area.height}%`,
                          }}
                          onMouseDown={(e) => handleMouseDown(e, 'move', area.id)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md pointer-events-none">
                            {index + 1}
                          </div>
                          {/* Resize handles */}
                          {isSelected && (
                            <>
                              {/* Edge hit areas (invisible for easier grabbing) */}
                              <div className="absolute -top-2 left-2 right-2 h-4 cursor-ns-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'n', area.id)} />
                              <div className="absolute -bottom-2 left-2 right-2 h-4 cursor-ns-resize z-10" onMouseDown={(e) => handleMouseDown(e, 's', area.id)} />
                              <div className="absolute top-2 bottom-2 -left-2 w-4 cursor-ew-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'w', area.id)} />
                              <div className="absolute top-2 bottom-2 -right-2 w-4 cursor-ew-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'e', area.id)} />

                              {/* Corner handles (visible) */}
                              <div 
                                className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'nw', area.id)}
                              />
                              <div 
                                className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'ne', area.id)}
                              />
                              <div 
                                className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'sw', area.id)}
                              />
                              <div 
                                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'se', area.id)}
                              />

                              {/* Edge handles (visible midpoints) */}
                              <div 
                                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-ns-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'n', area.id)}
                              />
                              <div 
                                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-ns-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 's', area.id)}
                              />
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-ew-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'w', area.id)}
                              />
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-ew-resize z-20" 
                                onMouseDown={(e) => handleMouseDown(e, 'e', area.id)}
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  <div className="bg-yellow-300 p-4 rounded-[24px] border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0D2A4A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                        Photo Areas
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <button 
                          onClick={autoDetectAreas}
                          disabled={isDetecting}
                          className="text-xs bg-white text-slate-900 p-2 rounded-xl font-bold flex items-center gap-1 btn-neo disabled:opacity-50"
                        >
                          {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          Auto Detect
                        </button>
                        <button 
                          onClick={addArea}
                          className="text-xs bg-teal-400 text-slate-900 p-2 rounded-xl font-bold flex items-center gap-1 btn-neo"
                        >
                          <Plus className="w-4 h-4" /> Add Area
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                      {photoAreas.map((area, index) => {
                        const isSelected = area.id === selectedAreaId;
                        return (
                          <div 
                            key={area.id} 
                            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_#0D2A4A]' : 'bg-slate-50 border-slate-900 shadow-[2px_2px_0px_0px_#0D2A4A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#0D2A4A]'}`}
                            onClick={() => setSelectedAreaId(area.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-extrabold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                Area {index + 1}
                              </span>
                              <button 
                                onClick={(e) => removeArea(area.id, e)}
                                className="text-slate-900 hover:text-white hover:bg-rose-500 bg-rose-100 border-2 border-slate-900 transition-colors p-1.5 rounded-lg shadow-[2px_2px_0px_0px_#0D2A4A] hover:shadow-[0px_0px_0px_0px_#0D2A4A] hover:translate-y-[2px] hover:translate-x-[2px]"
                                title="Remove Area"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {isSelected && (
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1 uppercase">X Pos (%)</label>
                                  <input 
                                    type="number" 
                                    value={area.x}
                                    onChange={(e) => updateArea(area.id, 'x', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 input-neo text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1 uppercase">Y Pos (%)</label>
                                  <input 
                                    type="number" 
                                    value={area.y}
                                    onChange={(e) => updateArea(area.id, 'y', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 input-neo text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1 uppercase">Width (%)</label>
                                  <input 
                                    type="number" 
                                    value={area.width}
                                    onChange={(e) => updateArea(area.id, 'width', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 input-neo text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-extrabold text-slate-700 mb-1 uppercase">Height (%)</label>
                                  <input 
                                    type="number" 
                                    value={area.height}
                                    onChange={(e) => updateArea(area.id, 'height', Number(e.target.value))}
                                    className="w-full px-2 py-1.5 input-neo text-xs"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {photoAreas.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4">No photo areas added.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0D2A4A]">
                    <h4 className="text-sm font-extrabold text-slate-900 mb-2">Preview Simulation</h4>
                    <p className="text-xs text-slate-900 font-semibold mb-4">This is how the final photo will look with a sample webcam capture.</p>
                    <div className="bg-slate-100 rounded-xl overflow-hidden relative w-full border border-slate-300 shadow-inner flex justify-center py-4">
                      <div className="relative inline-block w-full max-w-[120px] shadow-sm border border-slate-300">
                        {/* Frame Overlay (used for sizing) */}
                        <img src={selectedFrame.image} alt="Frame" className="w-full h-auto block pointer-events-none relative z-10" referrerPolicy="no-referrer" />
                        
                        {/* Mock Webcams */}
                        {photoAreas.map((area, index) => (
                          <img 
                            key={area.id}
                            src={`https://picsum.photos/seed/webcam${index}/150/200`} 
                            alt={`Webcam ${index + 1}`} 
                            className="absolute object-cover z-0" 
                            style={{
                              left: `${area.x}%`,
                              top: `${area.y}%`,
                              width: `${area.width}%`,
                              height: `${area.height}%`,
                            }}
                            referrerPolicy="no-referrer" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-neo bg-orange-50 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-16 h-16 bg-yellow-300 rounded-2xl flex items-center justify-center text-slate-900 mb-4 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0D2A4A] -rotate-6">
                <ImageIcon className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">No Frame Selected</h3>
              <p className="text-slate-700 font-semibold mt-2 max-w-sm">Select a frame from the list to map coordinates and preview the final result.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
