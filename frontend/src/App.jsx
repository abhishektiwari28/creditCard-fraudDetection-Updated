import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Charts from './components/Charts';
import HistoryView from './components/HistoryView';
import Dashboard from './components/Dashboard'; // [NEW]
import Chatbot from './components/Chatbot';     // [NEW]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default to dashboard
  const [result, setResult] = useState(null);
  const [visData, setVisData] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch history/visualization data on mount and updates
  const fetchVisData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/visualize');
      // response.data is the history list
      setVisData(response.data);
    } catch (error) {
      console.error("Error fetching visualization data", error);
    }
  };

  useEffect(() => {
    fetchVisData();
  }, []);

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setCurrentTransaction(formData);
    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResult(response.data);
      // Refresh history after new prediction
      await fetchVisData();
      // Optionally switch to result view or stay
    } catch (error) {
      console.error("Error analyzing transaction", error);
      alert("Error connecting to validation engine. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text-primary font-sans relative pb-12 selection:bg-brand-primary/10 selection:text-brand-primary">
      {/* Professional Navbar - Solid Blue (Reverted) */}
      <nav className="bg-brand-primary text-white shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FraudGuard AI</h1>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest leading-none">Enterprise Protection</p>
            </div>
          </div>

          {/* Tab Switcher - Integrated in Navbar */}
          <div className="flex space-x-1 bg-indigo-800/50 p-1 rounded-lg">
            {['dashboard', 'analyze', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-8">

        {activeTab === 'dashboard' && (
          <Dashboard visualizationData={visData} />
        )}

        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 gap-8 animate-fade-in">
            {/* Expanded to full width layout as requested (stacking input and result/charts) */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Input Form */}
              <div className="lg:col-span-5 space-y-6">
                <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />
              </div>

              {/* Right: Results & Real-time Charts */}
              <div className="lg:col-span-7 space-y-6">
                {/* Result takes full width of this column */}
                <Results result={result} />

                <Charts visualizationData={visData} currentTransaction={currentTransaction} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-text-primary tracking-tight">Transaction History</h2>
              <button onClick={fetchVisData} className="text-sm bg-white border border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/30 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md">
                Refresh Data
              </button>
            </div>
            <HistoryView historyData={visData} />
          </div>
        )}

      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
