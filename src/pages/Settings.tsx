import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  // Form States
  const [general, setGeneral] = useState({ boothName: 'Main Lobby Booth', location: 'Jakarta', price: '35000' });
  const [payment, setPayment] = useState({ provider: 'midtrans', apiKey: 'SB-Mid-server-1234567890', clientKey: 'SB-Mid-client-123456' });
  const [camera, setCamera] = useState({ deviceId: 'default', resolution: '1920x1080', countdown: '3' });

  const handleSave = () => {
    // Simulate API call
    setToast({ show: true, message: 'Settings saved successfully', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-slate-700 font-medium mt-1">Configure your photobooth hardware and integrations.</p>
      </div>

      <div className="card-neo overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b-2 border-slate-900 bg-white overflow-x-auto">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap transition-colors border-b-4 ${activeTab === 'general' ? 'border-amber-400 bg-[#FFE8A1] text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap transition-colors border-b-4 ${activeTab === 'payment' ? 'border-amber-400 bg-[#FFE8A1] text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            Payment Gateway
          </button>
          <button 
            onClick={() => setActiveTab('camera')}
            className={`px-6 py-4 text-sm font-extrabold whitespace-nowrap transition-colors border-b-4 ${activeTab === 'camera' ? 'border-amber-400 bg-[#FFE8A1] text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            Camera & Hardware
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-orange-50/50">
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-teal-400 border-2 border-slate-900 rounded-sm inline-block -rotate-6"></span> General Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Photobooth Name</label>
                  <input 
                    type="text" 
                    value={general.boothName}
                    onChange={(e) => setGeneral({...general, boothName: e.target.value})}
                    className="w-full px-4 py-3 input-neo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={general.location}
                    onChange={(e) => setGeneral({...general, location: e.target.value})}
                    className="w-full px-4 py-3 input-neo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Price per Session (Rp)</label>
                  <input 
                    type="number" 
                    value={general.price}
                    onChange={(e) => setGeneral({...general, price: e.target.value})}
                    className="w-full px-4 py-3 input-neo"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-blue-400 border-2 border-slate-900 rounded-sm inline-block rotate-6"></span> Payment Configuration</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Provider</label>
                  <select 
                    value={payment.provider}
                    onChange={(e) => setPayment({...payment, provider: e.target.value})}
                    className="w-full px-4 py-3 input-neo font-bold cursor-pointer"
                  >
                    <option value="midtrans">Midtrans</option>
                    <option value="sayabayar">SayaBayar</option>
                    <option value="xendit">Xendit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Server Key (API Key)</label>
                  <div className="relative">
                    <input 
                      type={showApiKey ? "text" : "password"} 
                      value={payment.apiKey}
                      onChange={(e) => setPayment({...payment, apiKey: e.target.value})}
                      className="w-full pl-4 pr-12 py-3 input-neo font-mono text-sm tracking-widest"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 hover:text-teal-600 bg-teal-100 p-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[0px_0px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] mt-0.5 transition-all"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" strokeWidth={2.5} /> : <Eye className="w-4 h-4" strokeWidth={2.5} />}
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-2">Keep this key secret. It is used for backend API calls.</p>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Client Key</label>
                  <input 
                    type="text" 
                    value={payment.clientKey}
                    onChange={(e) => setPayment({...payment, clientKey: e.target.value})}
                    className="w-full px-4 py-3 input-neo font-mono text-sm tracking-widest"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-rose-400 border-2 border-slate-900 rounded-sm inline-block -rotate-6"></span> Camera & Hardware</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Select Camera Device</label>
                  <select 
                    value={camera.deviceId}
                    onChange={(e) => setCamera({...camera, deviceId: e.target.value})}
                    className="w-full px-4 py-3 input-neo font-bold cursor-pointer"
                  >
                    <option value="default">Default System Camera</option>
                    <option value="cam1">Logitech C920 HD Pro</option>
                    <option value="cam2">Sony A6000 (Capture Card)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Capture Resolution</label>
                  <select 
                    value={camera.resolution}
                    onChange={(e) => setCamera({...camera, resolution: e.target.value})}
                    className="w-full px-4 py-3 input-neo font-bold cursor-pointer"
                  >
                    <option value="1280x720">720p (1280x720)</option>
                    <option value="1920x1080">1080p (1920x1080)</option>
                    <option value="3840x2160">4K (3840x2160)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Countdown Timer (Seconds)</label>
                  <input 
                    type="number" 
                    value={camera.countdown}
                    onChange={(e) => setCamera({...camera, countdown: e.target.value})}
                    className="w-full px-4 py-3 input-neo"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t-2 border-slate-900 flex justify-end">
            <button 
              onClick={handleSave}
              className="btn-neo bg-teal-400 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Save className="w-5 h-5" strokeWidth={2.5} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="card-neo bg-teal-300 text-slate-900 px-6 py-4 flex items-center gap-4">
            <CheckCircle2 className="w-6 h-6 text-slate-900" strokeWidth={3} />
            <span className="text-md font-extrabold tracking-wide">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 bg-white/50 hover:bg-white border-2 border-slate-900 p-1 rounded-lg transition-colors shadow-[2px_2px_0px_0px_#0f172a] active:shadow-none active:translate-y-0.5 active:translate-x-0.5">
              <X className="w-4 h-4 text-slate-900" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
