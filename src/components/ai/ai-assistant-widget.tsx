"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { RecommendedProductCard } from "../../services/ai/deepseek-service";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: RecommendedProductCard[];
}

export function AiAssistantWidget({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          content: dict.aiAssistant.welcome,
        },
      ]);
    }
  }, [dict, messages.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          locale,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await res.json();

      const aiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        products: data.products,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Извините, сервис временно недоступен. Вы можете просмотреть все товары в нашем каталоге.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: dict.aiAssistant.welcome,
      },
    ]);
  };

  // Helper to render bold markdown in text
  const formatMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-950">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              ✨
            </div>
            <span className="text-xs font-bold tracking-wide">
              {dict.aiAssistant.button}
            </span>
            <span className="bg-white/20 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full">
              {dict.aiAssistant.badge}
            </span>

            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-3.5 px-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm shadow-inner">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight text-white">
                    {dict.aiAssistant.title}
                  </h3>
                  <span className="text-[9px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded-full font-mono uppercase">
                    DeepSeek
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {dict.aiAssistant.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title={dict.aiAssistant.clearChat}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-base transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {formatMarkdown(m.content)}
                </div>

                {/* Recommended Product Cards */}
                {m.products && m.products.length > 0 && (
                  <div className="w-full mt-2.5 space-y-1.5">
                    {m.products.map((prod) => (
                      <Link
                        key={prod.slug}
                        href={`/${locale}/product/${prod.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block bg-white hover:bg-blue-50/50 border border-slate-200 rounded-xl p-2 transition-all hover:border-blue-300 shadow-2xs group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 border border-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">
                              {prod.brand}
                            </span>
                            <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-blue-600">
                              {prod.name}
                            </span>
                            <span className="text-xs font-extrabold text-blue-600 mt-0.5 block">
                              {(prod.price / 100).toLocaleString(locale)} {dict.common.currency}
                            </span>
                          </div>
                          <span className="text-slate-400 group-hover:text-blue-600 text-sm font-bold pr-1">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] bg-white border border-slate-200 rounded-xl px-3 py-2 w-max">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>{dict.aiAssistant.thinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (visible if few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleQuickPrompt(dict.aiAssistant.promptPhone)}
                className="whitespace-nowrap bg-white hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                {dict.aiAssistant.promptPhone}
              </button>
              <button
                onClick={() => handleQuickPrompt(dict.aiAssistant.promptLaptop)}
                className="whitespace-nowrap bg-white hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                {dict.aiAssistant.promptLaptop}
              </button>
              <button
                onClick={() => handleQuickPrompt(dict.aiAssistant.promptHeadphones)}
                className="whitespace-nowrap bg-white hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                {dict.aiAssistant.promptHeadphones}
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dict.aiAssistant.inputPlaceholder}
                disabled={loading}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-xs cursor-pointer flex-shrink-0"
              >
                ➔
              </button>
            </form>
            <p className="text-[9px] text-center text-slate-400">
              {dict.aiAssistant.disclaimer}
            </p>
          </div>

        </div>
      )}
    </>
  );
}
