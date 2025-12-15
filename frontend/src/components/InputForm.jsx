import React, { useState } from 'react';

const InputForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        trans_date_trans_time: new Date().toISOString(),
        merchant: "fraud_test_merchant",
        category: "grocery_pos",
        amt: 50.0,
        gender: "M",
        state: "NY",
        job: "Software Engineer",
        city_pop: 10000,
        lat: 40.7128,
        long: -74.0060,
        merch_lat: 40.7200,
        merch_lon: -74.0100
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amt' || name === 'lat' || name === 'long' || name === 'merch_lat' || name === 'merch_lon' || name === 'city_pop'
                ? parseFloat(value)
                : value
        }));
    };

    const handleRandomize = () => {
        const categories = ['grocery_pos', 'entertainment', 'gas_transport', 'misc_net', 'shopping_net', 'shopping_pos'];
        const genders = ['M', 'F'];

        const randomData = {
            trans_date_trans_time: new Date().toISOString(),
            merchant: `merchant_${Math.floor(Math.random() * 1000)}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            amt: parseFloat((Math.random() * 500).toFixed(2)),
            gender: genders[Math.floor(Math.random() * genders.length)],
            state: "NY",
            job: "Random Job",
            city_pop: Math.floor(Math.random() * 100000) + 1000,
            lat: parseFloat((30 + Math.random() * 10).toFixed(4)),
            long: parseFloat((-100 + Math.random() * 20).toFixed(4)),
            merch_lat: parseFloat((30 + Math.random() * 10).toFixed(4)),
            merch_lon: parseFloat((-100 + Math.random() * 20).toFixed(4))
        };
        setFormData(randomData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-brand-surface p-8 rounded-2xl shadow-card border border-brand-border/60">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-border/50">
                <div>
                    <h2 className="text-xl font-bold text-brand-text-primary tracking-tight">Transaction Details</h2>
                    <p className="text-sm text-brand-text-secondary mt-1">Enter transaction data for analysis</p>
                </div>
                <button
                    type="button"
                    onClick={handleRandomize}
                    className="text-xs bg-white hover:bg-brand-dark text-brand-text-secondary hover:text-brand-primary border border-brand-border px-4 py-2 rounded-lg transition-all font-medium shadow-sm"
                >
                    Autofill Sample
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Merchant ID</label>
                        <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all" placeholder="e.g. merchant_123" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all">
                            <option value="grocery_pos">Grocery POS</option>
                            <option value="gas_transport">Gas / Transport</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping_pos">Shopping POS</option>
                            <option value="shopping_net">Shopping Net</option>
                            <option value="misc_net">Misc Net</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-brand-text-secondary text-sm font-medium">$</span>
                            <input type="number" name="amt" step="0.01" value={formData.amt} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 pl-7 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all font-medium" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all">
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Job Title</label>
                        <input type="text" name="job" value={formData.job} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">City Population</label>
                        <input type="number" name="city_pop" value={formData.city_pop} onChange={handleChange} className="w-full bg-brand-dark/50 border border-brand-border rounded-lg p-3 text-sm text-brand-text-primary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                    </div>
                </div>

                <div className="bg-brand-dark/30 p-5 rounded-xl border border-brand-border/50">
                    <div className="text-xs text-brand-text-secondary font-bold uppercase tracking-wider mb-4">Location Data (Coordinates)</div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="text-xs font-semibold text-brand-text-primary">User Location</div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Lat" step="0.0001" name="lat" value={formData.lat} onChange={handleChange} className="w-full bg-white border border-brand-border rounded-md px-3 py-2 text-xs text-brand-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                                <input type="number" placeholder="Long" step="0.0001" name="long" value={formData.long} onChange={handleChange} className="w-full bg-white border border-brand-border rounded-md px-3 py-2 text-xs text-brand-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-xs font-semibold text-brand-text-primary">Merchant Location</div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Lat" step="0.0001" name="merch_lat" value={formData.merch_lat} onChange={handleChange} className="w-full bg-white border border-brand-border rounded-md px-3 py-2 text-xs text-brand-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                                <input type="number" placeholder="Long" step="0.0001" name="merch_lon" value={formData.merch_lon} onChange={handleChange} className="w-full bg-white border border-brand-border rounded-md px-3 py-2 text-xs text-brand-text-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 focus:outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-medium text-white transition-all transform active:scale-[0.98] shadow-lg shadow-brand-primary/20 ${isLoading
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:shadow-brand-primary/30'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing...
                        </span>
                    ) : 'Analyze Transaction'}
                </button>
            </form>
        </div>
    );
};

export default InputForm;
