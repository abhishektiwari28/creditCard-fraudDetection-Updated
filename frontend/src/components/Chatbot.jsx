import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I am your Fraud Assistant. Ask me about transactions or stats.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chat', { query: userMsg });
            setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-brand-primary hover:bg-brand-primary-dark text-white p-4 rounded-full shadow-lg shadow-brand-primary/30 transition-transform hover:scale-105 flex items-center justify-center animate-fade-in"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="bg-white border border-brand-border w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col h-[32rem] animate-fade-in-up overflow-hidden ring-1 ring-black/5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark p-4 flex justify-between items-center text-white shadow-md">
                        <h3 className="font-bold flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">🤖</div>
                            AI Fraud Assistant
                        </h3>
                        <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-dark/30 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-brand-primary text-white rounded-br-none'
                                    : 'bg-white text-brand-text-primary border border-brand-border/60 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-brand-text-secondary border border-brand-border/60 p-3 rounded-2xl rounded-bl-none text-sm animate-pulse shadow-sm">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-brand-border bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your question..."
                            className="flex-1 bg-brand-dark text-brand-text-primary rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm border border-transparent focus:border-brand-primary transition-all placeholder:text-brand-text-secondary/50"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-brand-primary hover:bg-brand-primary-dark text-white p-2.5 rounded-full transition-colors shadow-sm flex-shrink-0 disabled:opacity-50"
                            disabled={!input.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
