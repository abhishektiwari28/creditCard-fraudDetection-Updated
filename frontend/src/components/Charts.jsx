import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Charts = ({ visualizationData, currentTransaction }) => {
    // visualizationData is a list of transactions
    // We'll plot Long vs Lat to show geographical distribution

    if (!visualizationData || visualizationData.length === 0) {
        return (
            <div className="bg-brand-surface p-6 rounded-xl shadow-sm border border-brand-border h-64 flex items-center justify-center">
                <p className="text-brand-text-secondary text-sm">No transaction history to visualize yet.</p>
            </div>
        );
    }

    const fraudPoints = visualizationData.filter(d => d.is_fraud).map(d => ({ x: d.long, y: d.lat }));
    const safePoints = visualizationData.filter(d => !d.is_fraud).map(d => ({ x: d.long, y: d.lat }));

    const currentPoint = currentTransaction ? [{ x: currentTransaction.long, y: currentTransaction.lat }] : [];

    const data = {
        datasets: [
            {
                label: 'Safe',
                data: safePoints,
                backgroundColor: 'rgba(34, 197, 94, 0.6)', // brand-success
                pointRadius: 4,
            },
            {
                label: 'Fraud',
                data: fraudPoints,
                backgroundColor: 'rgba(239, 68, 68, 0.8)', // brand-danger
                pointRadius: 6,
            },
            {
                label: 'Current',
                data: currentPoint,
                backgroundColor: '#ffffff',
                pointBorderColor: '#4f46e5', // brand-primary
                pointBorderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
            }
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: { color: '#e2e8f0' }, // slate-200
                ticks: { color: '#64748b' }, // slate-500
                title: { display: true, text: 'Longitude', color: '#64748b' }
            },
            y: {
                grid: { color: '#e2e8f0' },
                ticks: { color: '#64748b' },
                title: { display: true, text: 'Latitude', color: '#64748b' }
            }
        },
        plugins: {
            legend: {
                labels: { color: '#1e293b' } // slate-800
            },
            title: {
                display: true,
                text: 'Transaction Locations',
                color: '#1e293b',
                font: { size: 14, weight: 'bold' }
            },
        },
    };

    return (
        <div className="bg-brand-surface p-4 rounded-xl shadow-sm border border-brand-border">
            <Scatter options={options} data={data} />
            <p className="text-xs text-brand-text-secondary mt-3 text-center">
                *Geographical distribution of analyzed transactions.
            </p>
        </div>
    );
};

export default Charts;
