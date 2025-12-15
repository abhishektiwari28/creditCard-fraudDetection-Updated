import React from 'react';

const Results = ({ result }) => {
    if (!result) return null;

    const { risk_level, risk_score, prediction, details } = result;

    // Color Mapping
    let colorClass = "bg-green-500";
    let textColor = "text-green-500";
    let borderColor = "border-green-500";

    if (risk_level === 'Fraud') {
        colorClass = "bg-red-600";
        textColor = "text-red-500";
        borderColor = "border-red-500";
    } else if (risk_level === 'High Risk') {
        colorClass = "bg-orange-600";
        textColor = "text-orange-500";
        borderColor = "border-orange-500";
    } else if (risk_level === 'Medium Risk') {
        colorClass = "bg-yellow-500";
        textColor = "text-yellow-500";
        borderColor = "border-yellow-500";
    } else if (risk_level === 'Low Risk') {
        colorClass = "bg-blue-500";
        textColor = "text-blue-500";
        borderColor = "border-blue-500";
    }

    // Width percentage for the bar
    const percentage = Math.min(Math.max(risk_score * 100, 5), 100);

    return (
        <div className={`w-full bg-brand-surface border-l-4 ${borderColor} p-8 rounded-xl shadow-card animate-fade-in border border-brand-border/60`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-brand-text-primary mb-1">Analysis Result</h2>
                    <p className="text-sm text-brand-text-secondary">Risk assessment based on transaction pattern</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${risk_level === 'Fraud' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-dark text-brand-text-primary border border-brand-border'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70 block text-center">Score</span>
                    <span className="text-xl font-bold block text-center leading-none mt-1">{(risk_score * 100).toFixed(1)}%</span>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
                        {risk_level}
                    </span>
                    <div className="h-px flex-1 bg-brand-border/60"></div>
                </div>

                <p className="text-brand-text-secondary mb-6 text-sm leading-relaxed max-w-2xl">{details}</p>

                {/* Progress Bar Container */}
                <div className="w-full bg-brand-dark border border-brand-border rounded-full h-8 relative shadow-inner">
                    {/* Markers for risk levels */}
                    <div className="absolute top-0 bottom-0 left-[20%] w-px bg-brand-border z-10"></div>
                    <div className="absolute top-0 bottom-0 left-[50%] w-px bg-brand-border z-10"></div>
                    <div className="absolute top-0 bottom-0 left-[80%] w-px bg-brand-border z-10"></div>
                    <div className="absolute top-0 bottom-0 left-[95%] w-px bg-brand-border z-10"></div>

                    {/* Fill */}
                    <div
                        className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${percentage}%` }}
                    ></div>

                    {/* Labels under bar */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs font-medium text-brand-text-secondary w-full px-2">
                        <span className="w-[20%] text-center">Safe</span>
                        <span className="w-[30%] text-center">Low</span>
                        <span className="w-[30%] text-center">Medium</span>
                        <span className="w-[15%] text-center">High</span>
                        <span className="w-[5%] text-right">Fraud</span>
                    </div>
                </div>
            </div>

            {risk_level === 'Fraud' && (
                <div className="bg-red-50/50 border border-red-100 rounded-lg p-5 flex items-start gap-3 mt-8">
                    <div className="text-red-500 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-sm text-brand-text-primary">
                        <strong className="block text-red-700 mb-1">Immediate Action Taken</strong>
                        Account has been temporarily frozen to prevent further loss. An automated email alert has been sent to the cardholder for verification.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
