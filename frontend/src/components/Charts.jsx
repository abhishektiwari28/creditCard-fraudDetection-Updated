import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Charts = ({ visualizationData, currentTransaction }) => {
    // If no data, center on a default location (e.g., US center) or 0,0
    const defaultCenter = [39.8283, -98.5795]; // center of USA
    const defaultZoom = 4;

    if (!visualizationData || visualizationData.length === 0) {
        return (
            <div className="bg-brand-surface p-6 rounded-xl shadow-sm border border-brand-border h-96 flex items-center justify-center">
                <p className="text-brand-text-secondary text-sm">No transaction history to visualize yet.</p>
            </div>
        );
    }

    // Determine filter for safe vs fraud
    // Assuming visualizationData has lat, long, is_fraud
    // We treat lat/long as numeric

    // Center the map. If current transaction exists, center there.
    const center = currentTransaction 
        ? [currentTransaction.lat, currentTransaction.long] 
        : defaultCenter;

    return (
        <div className="bg-brand-surface p-4 rounded-xl shadow-sm border border-brand-border h-[500px] flex flex-col">
            <h3 className="text-brand-text-primary font-bold mb-2">Transaction Locations</h3>
            <div className="flex-1 w-full rounded-lg overflow-hidden border border-brand-border relative z-0">
                 {/* 
                   MapContainer needs a defined height. The parent flex-1 handles it, 
                   but we need to ensure the container style is set 
                 */}
                <MapContainer center={center} zoom={defaultZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Render History Points */}
                    {visualizationData.map((txn, idx) => {
                        const isFraud = txn.is_fraud;
                        const color = isFraud ? '#ef4444' : '#22c55e'; // red-500 : green-500
                        const radius = isFraud ? 6 : 4;

                        // Avoid rendering if lat/long are missing
                        if (txn.lat === undefined || txn.long === undefined) return null;

                        return (
                            <CircleMarker 
                                key={`hist-${idx}`}
                                center={[txn.lat, txn.long]}
                                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.7, weight: 1 }}
                                radius={radius}
                            >
                                <Popup>
                                    <div>
                                        <p className="font-bold">{isFraud ? 'Fraudulent' : 'Safe'} Transaction</p>
                                        <p>Amount: ${txn.amount}</p>
                                        <p>Time: {new Date(txn.timestamp).toLocaleString()}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}

                    {/* Render Current Transaction Point */}
                    {currentTransaction && currentTransaction.lat !== undefined && (
                        <CircleMarker
                            center={[currentTransaction.lat, currentTransaction.long]}
                            pathOptions={{ color: '#4f46e5', fillColor: '#ffffff', fillOpacity: 1, weight: 3 }}
                            radius={8}
                        >
                            <Popup>
                                <div>
                                    <p className="font-bold text-brand-primary">Current Transaction</p>
                                    <p>Amount: ${currentTransaction.amount}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )}
                </MapContainer>
            </div>
            <div className="flex gap-4 mt-3 justify-center text-sm text-brand-text-secondary">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-success opacity-70"></span> Safe
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-danger opacity-80"></span> Fraud
                </div>
                 <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-white border-2 border-brand-primary"></span> Current
                </div>
            </div>
        </div>
    );
};

export default Charts;
