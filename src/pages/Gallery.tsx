import { useState } from 'react';
import { Download, Trash2, HardDrive, Settings2, CheckSquare, Square } from 'lucide-react';

const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
  id: `photo-${i}`,
  url: `https://picsum.photos/seed/photo${i}/400/${300 + (i % 3) * 100}`,
  date: `2023-10-${String((i % 5) + 1).padStart(2, '0')}`,
  size: '2.4 MB'
}));

export default function Gallery() {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [cleanupDays, setCleanupDays] = useState('14');

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPhotos(newSelection);
  };

  const selectAll = () => {
    if (selectedPhotos.size === mockPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(mockPhotos.map(p => p.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gallery & Storage</h2>
          <p className="text-slate-700 font-medium mt-1">Manage saved photos and server storage capacity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Monitor & Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-neo p-6 bg-[#FFE8A1]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-xl flex items-center justify-center text-slate-900 -rotate-3">
                <HardDrive className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Storage Monitor</h3>
                <p className="text-sm font-bold text-slate-700">Local Server SSD</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-extrabold">
                <span className="text-slate-900">85 GB Used</span>
                <span className="text-slate-700">100 GB Total</span>
              </div>
              <div className="w-full bg-white border-2 border-slate-900 rounded-full h-4 overflow-hidden shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="bg-rose-400 h-full border-r-2 border-slate-900" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-rose-600 font-black mt-2 uppercase tracking-wide">Warning: Storage is reaching capacity.</p>
            </div>
          </div>

          <div className="card-neo p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#BDE0FE] border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-xl flex items-center justify-center text-slate-900 rotate-3">
                <Settings2 className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Auto-Cleanup</h3>
                <p className="text-sm font-bold text-slate-600">Cron Job Settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-2">Delete photos older than</label>
                <select 
                  value={cleanupDays}
                  onChange={(e) => setCleanupDays(e.target.value)}
                  className="w-full input-neo px-4 py-3 text-sm font-bold cursor-pointer"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                  <option value="never">Never (Not Recommended)</option>
                </select>
              </div>
              <button className="w-full bg-teal-400 text-slate-900 px-4 py-3 rounded-xl text-sm font-bold btn-neo mt-2">
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="lg:col-span-2 card-neo overflow-hidden flex flex-col h-[800px]">
          {/* Toolbar */}
          <div className="p-4 border-b-2 border-slate-900 bg-[#C8F0EE] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={selectAll}
                className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-white hover:bg-slate-900 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-slate-900 transition-all"
              >
                {selectedPhotos.size === mockPhotos.length ? (
                  <CheckSquare className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <Square className="w-5 h-5" strokeWidth={2.5} />
                )}
                Select All
              </button>
              <span className="text-sm font-bold text-slate-700">
                {selectedPhotos.size} selected
              </span>
            </div>
            
            {selectedPhotos.size > 0 && (
              <div className="flex items-center gap-2">
                <button className="bg-white border-2 border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none">
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  Download
                </button>
                <button className="bg-rose-400 border-2 border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none">
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Masonry Grid (Simulated with columns) */}
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            <div className="columns-2 md:columns-3 gap-6 space-y-6">
              {mockPhotos.map((photo) => {
                const isSelected = selectedPhotos.has(photo.id);
                return (
                  <div 
                    key={photo.id} 
                    className={`relative group break-inside-avoid rounded-2xl overflow-hidden border-4 cursor-pointer transition-all ${isSelected ? 'border-teal-400 shadow-[6px_6px_0px_0px_#2dd4bf]' : 'border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a]'}`}
                    onClick={() => toggleSelection(photo.id)}
                  >
                    <img 
                      src={photo.url} 
                      alt="Gallery item" 
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-teal-400/30' : 'group-hover:bg-slate-900/10'}`} />
                    
                    {/* Checkbox */}
                    <div className={`absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all border-2 ${
                      isSelected ? 'bg-teal-400 text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : 'bg-white text-transparent group-hover:text-slate-300 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                    }`}>
                      <CheckSquare className="w-5 h-5" strokeWidth={3} />
                    </div>

                    {/* Meta */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900 border-t-2 border-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-bold">{photo.date}</p>
                      <p className="text-teal-400 font-extrabold">{photo.size}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
