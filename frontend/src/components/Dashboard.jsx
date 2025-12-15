import React from 'react';

const Dashboard = ({ visualizationData }) => {
    const total = visualizationData.length;
    const fraud = visualizationData.filter(d => d.risk_level === 'Fraud').length;
    const high = visualizationData.filter(d => d.risk_level === 'High Risk').length;
    const medium = visualizationData.filter(d => d.risk_level === 'Medium Risk').length;
    const low = visualizationData.filter(d => d.risk_level === 'Low Risk').length;
    const safe = visualizationData.filter(d => d.risk_level === 'Risk Free').length;

    const recentHighRisks = visualizationData
        .filter(d => d.risk_level === 'Fraud' || d.risk_level === 'High Risk')
        .slice(-5)
        .reverse();

    const StatCard = ({ title, value, colorClass, bgClass, borderClass }) => (
        <div className={`p-5 rounded-2xl border ${borderClass} ${bgClass} shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md`}>
            <h4 className={`${colorClass} text-xs font-bold uppercase tracking-wider mb-2 opacity-80`}>{title}</h4>
            <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4 tracking-tight">Live Dashboard</h2>

            {/* Stats Cards - Soft & Modern */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard title="Total Analyzed" value={total} colorClass="text-brand-text-primary" bgClass="bg-white" borderClass="border-brand-border" />
                <StatCard title="Confirmed Fraud" value={fraud} colorClass="text-red-600" bgClass="bg-red-50/50" borderClass="border-red-100" />
                <StatCard title="High Risk" value={high} colorClass="text-orange-600" bgClass="bg-orange-50/50" borderClass="border-orange-100" />
                <StatCard title="Medium Risk" value={medium} colorClass="text-yellow-600" bgClass="bg-yellow-50/50" borderClass="border-yellow-100" />
                <StatCard title="Low Risk" value={low} colorClass="text-blue-600" bgClass="bg-blue-50/50" borderClass="border-blue-100" />
                <StatCard title="Risk Free" value={safe} colorClass="text-emerald-600" bgClass="bg-emerald-50/50" borderClass="border-emerald-100" />
            </div>

            {/* Recent Alerts - Cleaner Table */}
            <div className="bg-white border border-brand-border/60 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-brand-text-primary">Recent High Priority Alerts</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-brand-dark/50 border-b border-brand-border/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold rounded-tl-lg">ID</th>
                                <th className="px-6 py-4 font-semibold">Merchant</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Time</th>
                                <th className="px-6 py-4 font-semibold">Risk Level</th>
                                <th className="px-6 py-4 font-semibold rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/30">
                            {recentHighRisks.length > 0 ? recentHighRisks.map((item, idx) => (
                                <tr key={idx} className="hover:bg-brand-dark/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-brand-primary">#{item.id}</td>
                                    <td className="px-6 py-4 text-brand-text-primary font-medium">{item.merchant}</td>
                                    <td className="px-6 py-4 text-brand-text-primary font-semibold">${item.amt}</td>
                                    <td className="px-6 py-4">{new Date(item.trans_date_trans_time).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.risk_level === 'Fraud' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                            {item.risk_level.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.action_taken === "Card Blocked & Email Sent" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 border border-red-100 text-red-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                Blocked
                                            </span>
                                        ) : item.action_taken === "Flagged for Review" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-100 text-orange-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                Flagged
                                            </span>
                                        ) : (
                                            <span className="text-xs text-brand-border">--</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-brand-text-secondary">
                                        No high priority alerts recently. System is secure.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
