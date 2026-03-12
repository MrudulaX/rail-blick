import { useState, useContext, useRef, useEffect } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { sendMessage, DEMO_QUERIES } from '../logic/geminiClient';
import { Send, Bot, User, Loader, ChevronRight, MessageSquare } from 'lucide-react';

function StreamingText({ text, isStreaming }) {
  return (
    <span className="leading-relaxed">
      {text}
      {isStreaming && <span className="cursor-blink text-cyan-400 ml-0.5">▌</span>}
    </span>
  );
}

export default function AssistantPanel({ viewMode }) {
  const CASCADE = useContext(CascadeContext);
  const { activeCascade } = CASCADE;

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const queries = DEMO_QUERIES[viewMode] || DEMO_QUERIES.operator;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(userText) {
    const text = (userText || input).trim();
    if (!text || isStreaming) return;
    setInput('');

    const userMsg = { role: 'user', text, id: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setIsStreaming(true);

    const assistantId = Date.now() + 1;
    setMessages((m) => [...m, { role: 'assistant', text: '', id: assistantId, streaming: true }]);

    await sendMessage(
      text,
      CASCADE,
      viewMode,
      (chunk) => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      },
      (_full) => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, streaming: false } : msg
          )
        );
        setIsStreaming(false);
      },
      (err) => {
        setIsStreaming(false);
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId
              ? { ...msg, text: 'Assistant temporarily unavailable. All analytics still live.', streaming: false, error: true }
              : msg
          )
        );
      }
    );
  }

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg overflow-hidden flex flex-col" style={{ height: '360px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className={`w-3.5 h-3.5 ${isStreaming ? 'text-cyan-400 animate-pulse' : 'text-cyan-600'}`} />
          <span className="text-[10px] font-bold tracking-widest text-gray-500">RAILSENTINEL AI</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
            viewMode === 'operator'
              ? 'bg-cyan-500/15 text-cyan-400'
              : 'bg-orange-500/15 text-orange-400'
          }`}>
            {viewMode.toUpperCase()}
          </span>
        </div>
        {!activeCascade && (
          <span className="text-[9px] text-gray-700">Trigger a scenario first for live context</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <MessageSquare className="w-8 h-8 text-gray-800" />
            <p className="text-[11px] text-gray-700 max-w-xs leading-relaxed">
              Ask about cascades, waitlist probabilities, or scheduling. Use the quick queries below.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-cyan-600" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#1a2030] border border-cyan-900/30 text-gray-200'
                : msg.error
                ? 'bg-red-950/20 border border-red-900/30 text-red-400'
                : 'bg-[#0d0d1a] border border-[#1e1e2e] text-gray-300'
            }`}>
              {msg.role === 'assistant'
                ? <StreamingText text={msg.text} isStreaming={msg.streaming} />
                : msg.text
              }
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-[#1a2030] border border-[#2a3040] flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3 text-gray-500" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick query pills */}
      <div className="px-4 pb-2 pt-1 flex gap-1.5 overflow-x-auto hidden-scrollbar shrink-0">
        {queries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isStreaming}
            className="flex-shrink-0 flex items-center gap-1 text-[9px] px-2.5 py-1.5 bg-[#0d0d1a] border border-[#1e1e2e] hover:border-cyan-900/50 hover:text-cyan-400 text-gray-600 rounded-full transition-all font-bold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-2.5 h-2.5" />
            {q.length > 30 ? q.slice(0, 28) + '…' : q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-1 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={
              viewMode === 'operator'
                ? 'Ask about scheduling, risk, or recovery...'
                : 'Ask about your ticket, alternatives...'
            }
            disabled={isStreaming}
            className="flex-1 bg-[#0d0d1a] border border-[#1e1e2e] focus:border-cyan-900/60 text-gray-300 placeholder-gray-700 text-xs px-3 py-2 rounded font-mono outline-none transition-colors disabled:opacity-40"
          />
          <button
            onClick={() => handleSend()}
            disabled={isStreaming || !input.trim()}
            className="w-9 h-9 bg-cyan-500/15 border border-cyan-900/40 hover:bg-cyan-500/25 hover:border-cyan-700/50 text-cyan-400 rounded flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isStreaming
              ? <Loader className="w-3.5 h-3.5 animate-spin" />
              : <Send className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
