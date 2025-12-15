import React from 'react';

const HistoryView = ({ historyData }) => {
    if (!historyData || historyData.length === 0) {
        return <div className="text-center text-slate-500 py-10">No transaction history found.</div>;
    }

    // Reverse to show newest first
    const displayData = [...historyData].reverse();

    const handleDownload = (id) => {
        // Open new window to download
        window.open(`http://localhost:8000/report/${id}`, '_blank');
    };

    return (
        <div className="bg-white rounded-xl border border-brand-border/60 overflow-hidden shadow-card animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-brand-dark/50 border-b border-brand-border/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">ID</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Merchant</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Risk Level</th>
                            <th className="px-6 py-4 text-center font-semibold">Report</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/30">
                        {displayData.map((item) => (
                            <tr key={item.id} className="hover:bg-brand-dark/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-brand-primary">#{item.id}</td>
                                <td className="px-6 py-4 text-brand-text-primary">{item.trans_date_trans_time}</td>
                                <td className="px-6 py-4 font-medium text-brand-text-primary">{item.merchant}</td>
                                <td className="px-6 py-4 text-brand-text-primary font-semibold">${item.amt}</td>
                                <td className="px-6 py-4 capitalize text-brand-text-secondary">{item.category}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.risk_level === 'Fraud' ? 'bg-red-50 text-red-600 border-red-100' :
                                            item.risk_level === 'High Risk' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                item.risk_level === 'Medium Risk' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                    item.risk_level === 'Low Risk' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}
                                    >
                                        {item.risk_level || (item.is_fraud ? "FRAUD" : "SAFE")}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleDownload(item.id)}
                                        className="text-brand-primary hover:text-brand-primary-dark transition-colors p-2 rounded-lg hover:bg-brand-primary/10"
                                        title="Download Report"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryView;
