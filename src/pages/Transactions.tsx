import { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

const mockTransactions = Array.from({ length: 25 }).map((_, i) => ({
  id: `ORD-2023100${i + 1}`,
  date: `2023-10-${String((i % 5) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}`,
  amount: 'Rp 35.000',
  method: i % 3 === 0 ? 'QRIS' : 'Virtual Account',
  status: i % 7 === 0 ? 'Error' : i % 5 === 0 ? 'Pending' : 'Success',
  webhookLog: i % 7 === 0 ? '{\n  "status_code": "500",\n  "transaction_status": "deny",\n  "order_id": "ORD-2023100X"\n}' : '{\n  "status_code": "200",\n  "transaction_status": "settlement",\n  "order_id": "ORD-2023100X"\n}'
}));

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<typeof mockTransactions[0] | null>(null);

  const itemsPerPage = 10;

  const filtered = mockTransactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transactions</h2>
          <p className="text-slate-700 font-medium mt-1">View payment history and webhook logs.</p>
        </div>
        <button className="bg-[#FFE8A1] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
          <Download className="w-5 h-5" strokeWidth={2.5} />
          Export CSV
        </button>
      </div>

      <div className="card-neo overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b-2 border-slate-900 flex flex-col sm:flex-row gap-4 bg-[#BDE0FE]">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input-neo font-bold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-neo px-3 py-2 text-sm font-bold cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900 font-extrabold border-b-2 border-slate-900 text-sm">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {paginated.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#FFE8A1] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-extrabold text-slate-900">{tx.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{tx.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{tx.amount}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{tx.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border-2 border-slate-900 ${
                      tx.status === 'Success' ? 'bg-teal-300 text-slate-900' :
                      tx.status === 'Pending' ? 'bg-yellow-300 text-slate-900' :
                      'bg-rose-300 text-slate-900'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t-2 border-slate-900 flex items-center justify-between text-sm bg-orange-50">
          <span className="font-bold text-slate-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 px-3 border-2 border-slate-900 rounded-lg hover:bg-[#FFE8A1] shadow-[2px_2px_0px_0px_#0f172a] disabled:opacity-50 disabled:cursor-not-allowed bg-white font-bold"
            >
              Prev
            </button>
            <span className="font-extrabold text-slate-900 px-2">{currentPage} / {totalPages || 1}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 px-3 border-2 border-slate-900 rounded-lg hover:bg-[#FFE8A1] shadow-[2px_2px_0px_0px_#0f172a] disabled:opacity-50 disabled:cursor-not-allowed bg-white font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="card-neo w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b-2 border-slate-900 flex items-center justify-between bg-[#FFE8A1]">
              <h3 className="text-lg font-extrabold text-slate-900">Transaction Details</h3>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-slate-900 hover:bg-rose-300 border-2 border-transparent hover:border-slate-900 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-orange-50">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Order ID</p>
                  <p className="font-black text-slate-900 mt-1">{selectedTx.id}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</p>
                  <span className={`inline-block mt-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border-2 border-slate-900 ${
                    selectedTx.status === 'Success' ? 'bg-teal-300 text-slate-900' :
                    selectedTx.status === 'Pending' ? 'bg-yellow-300 text-slate-900' :
                    'bg-rose-300 text-slate-900'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date & Time</p>
                  <p className="font-black text-slate-900 mt-1 text-sm">{selectedTx.date}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Amount</p>
                  <p className="font-black text-slate-900 mt-1 text-sm">{selectedTx.amount}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Webhook Payload Log</p>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border-4 border-slate-800 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                  <pre className="text-xs text-teal-400 font-mono font-bold">
                    {selectedTx.webhookLog}
                  </pre>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2">Use this log to debug payment gateway issues.</p>
              </div>
            </div>
            <div className="p-4 border-t-2 border-slate-900 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedTx(null)}
                className="btn-neo bg-slate-200 text-slate-900 px-6 py-2 rounded-xl text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
