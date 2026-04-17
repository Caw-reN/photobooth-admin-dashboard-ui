import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle2, AlertTriangle, Wifi, CreditCard, HardDrive } from 'lucide-react';

const data = [
  { name: '08:00', sessions: 4 },
  { name: '10:00', sessions: 12 },
  { name: '12:00', sessions: 25 },
  { name: '14:00', sessions: 18 },
  { name: '16:00', sessions: 30 },
  { name: '18:00', sessions: 45 },
  { name: '20:00', sessions: 38 },
  { name: '22:00', sessions: 15 },
];

const recentTransactions = [
  { id: 'ORD-20231001-001', status: 'Success', time: '10:23 AM', amount: 'Rp 35.000' },
  { id: 'ORD-20231001-002', status: 'Success', time: '10:45 AM', amount: 'Rp 35.000' },
  { id: 'ORD-20231001-003', status: 'Pending', time: '11:02 AM', amount: 'Rp 35.000' },
  { id: 'ORD-20231001-004', status: 'Error', time: '11:15 AM', amount: 'Rp 35.000' },
  { id: 'ORD-20231001-005', status: 'Success', time: '11:30 AM', amount: 'Rp 35.000' },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
        <p className="text-slate-700 font-medium mt-1">Monitor your photobooth performance and system status.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-neo bg-[#C8F0EE] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-700">Revenue This Month</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">Rp 12.450.000</h3>
            </div>
            <div className="w-12 h-12 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-xl flex items-center justify-center text-slate-900 -rotate-3">
              <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-teal-700 font-extrabold bg-teal-100 px-2 py-0.5 rounded-md border border-teal-700">+15%</span>
            <span className="text-slate-700 font-bold ml-2">vs last month</span>
          </div>
        </div>

        <div className="card-neo bg-[#BDE0FE] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-700">Successful Sessions</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">356</h3>
            </div>
            <div className="w-12 h-12 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-xl flex items-center justify-center text-slate-900 rotate-3">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-700 font-extrabold bg-blue-100 px-2 py-0.5 rounded-md border border-blue-700">+8%</span>
            <span className="text-slate-700 font-bold ml-2">vs last month</span>
          </div>
        </div>

        <div className="card-neo bg-[#FDA4AF] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-700">Error Rate</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">1.2%</h3>
            </div>
            <div className="w-12 h-12 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-xl flex items-center justify-center text-slate-900 -rotate-3">
              <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-rose-800 font-extrabold bg-rose-200 px-2 py-0.5 rounded-md border border-rose-800">-0.5%</span>
            <span className="text-slate-700 font-bold ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-neo p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-teal-100 border-2 border-slate-900 flex items-center justify-center text-slate-900">
            <Wifi className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">Internet Connection</p>
            <p className="text-xs text-teal-600 font-bold">Online & Stable</p>
          </div>
        </div>
        <div className="card-neo p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-slate-900">
            <CreditCard className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">Payment Gateway</p>
            <p className="text-xs text-blue-600 font-bold">Active (Midtrans)</p>
          </div>
        </div>
        <div className="card-neo p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-yellow-200 border-2 border-slate-900 flex items-center justify-center text-slate-900">
            <HardDrive className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">Local Storage</p>
            <p className="text-xs text-yellow-600 font-bold">85% Used (Warning)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card-neo p-6">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Activity Today</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px 0px #0f172a', fontWeight: 'bold' }}
                />
                <Bar dataKey="sessions" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Table */}
        <div className="card-neo p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-slate-900">Recent Transactions</h3>
            <button className="text-sm text-slate-900 bg-white border-2 border-slate-900 px-3 py-1 rounded-lg font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-900 hover:bg-[#FFE8A1] transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#0f172a]">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{tx.id}</p>
                  <p className="text-xs font-bold text-slate-600">{tx.time} • {tx.amount}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-wider rounded-md border-2 border-slate-900 ${
                  tx.status === 'Success' ? 'bg-teal-300 text-slate-900' :
                  tx.status === 'Pending' ? 'bg-yellow-300 text-slate-900' :
                  'bg-rose-300 text-slate-900'
                }`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
