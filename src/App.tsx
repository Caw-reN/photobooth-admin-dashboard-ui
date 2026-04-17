/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, Receipt, Images, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Home from './pages/Home';
import Frames from './pages/Frames';
import Transactions from './pages/Transactions';
import Gallery from './pages/Gallery';
import SystemSettings from './pages/Settings';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Overview' },
    { path: '/frames', icon: ImageIcon, label: 'Frames' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/gallery', icon: Images, label: 'Gallery' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-[#FFE8A1] border-r-2 border-slate-900 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 border-b-2 border-slate-900">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 card-neo bg-teal-400 flex items-center justify-center -rotate-6">
            <span className="text-slate-900 font-extrabold text-lg">P</span>
          </div>
          Photobooth
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border-2",
                isActive 
                  ? "bg-teal-400 text-slate-900 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] translate-x-[-2px] translate-y-[-2px]" 
                  : "bg-white/50 text-slate-700 border-transparent hover:bg-white hover:border-slate-900 hover:shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-slate-900" : "text-slate-500")} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t-2 border-slate-900 bg-white">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 card-neo bg-rose-300 flex items-center justify-center text-slate-900 font-extrabold text-lg">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Admin User</span>
            <span className="text-xs text-slate-500 font-semibold">admin@photobooth.id</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-orange-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frames" element={<Frames />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
