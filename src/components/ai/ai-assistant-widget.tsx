"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { RecommendedProductCard } from "../../services/ai/deepseek-service";
import { Price } from "../ui/price";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: RecommendedProductCard[];
}

const iconButton =
  "w-8 h-8 rounded-sm text-ink-3 hover:text-ink hover:bg-paper-2 inline-flex items-center justify-center transition-colors duration-180 cursor-pointer";

const quickPrompt =
  "whitespace-nowrap h-8 px-3 rounded-sm border border-line bg-surface text-[12px] text-ink-2 hover:border-ink hover:text-ink transition-colors duration-180 cursor-pointer";

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
  const formatMarkdown = (text: string, inverse = false) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className={inverse ? "font-medium" : "font-medium text-ink"}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group inline-flex items-center gap-2.5 h-11 pl-3 pr-4 rounded-sm bg-ink text-ink-inverse hover:bg-signal transition-colors duration-180 shadow-float cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <span
              className="w-1.5 h-1.5 bg-signal group-hover:bg-white transition-colors duration-180 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium">{dict.aiAssistant.button}</span>
            <span className="label text-ink-inverse/70">{dict.aiAssistant.badge}</span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-paper border border-line rounded-lg shadow-float flex flex-col overflow-hidden reveal">

          {/* Header */}
          <div className="px-4 h-14 border-b border-line flex items-center justify-between bg-paper shrink-0">
            <div className="flex flex-col gap-1 min-w-0">
              <h3 className="flex items-center gap-2 leading-none">
                <span className="wordmark text-[18px]" aria-hidden="true">
                  zento
                </span>
                <span className="sr-only">{dict.aiAssistant.title}</span>
                <span className="label text-ink-3">{dict.aiAssistant.badge}</span>
              </h3>
              <p className="label text-ok flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-ok shrink-0" aria-hidden="true" />
                {dict.aiAssistant.status}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleClearChat}
                title={dict.aiAssistant.clearChat}
                aria-label={dict.aiAssistant.clearChat}
                className={iconButton}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7M10 11v5M14 11v5" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close"
                className={iconButton}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-[13px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {m.role === "user" ? (
                  <div className="bg-ink text-ink-inverse rounded-sm px-3 py-2 max-w-[85%] leading-relaxed">
                    {formatMarkdown(m.content, true)}
                  </div>
                ) : (
                  <div className="border-l-2 border-ink pl-3 text-ink-2 leading-relaxed max-w-[92%]">
                    {formatMarkdown(m.content)}
                  </div>
                )}

                {/* Recommended Product Cards */}
                {m.products && m.products.length > 0 && (
                  <div className="w-full mt-3 rule-grid grid-cols-1 rounded-sm overflow-hidden">
                    {m.products.map((prod) => (
                      <Link
                        key={prod.slug}
                        href={`/${locale}/product/${prod.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 p-2.5 bg-paper hover:bg-surface transition-colors duration-180"
                      >
                        <div className="plate w-12 h-12 rounded-xs shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="label block truncate">{prod.brand}</span>
                          <span className="text-[13px] font-medium text-ink block truncate decoration-1 underline-offset-4 group-hover:underline">
                            {prod.name}
                          </span>
                          <Price amount={prod.price} currency={dict.common.currency} locale={locale} size="sm" className="mt-0.5" />
                        </div>
                        <span className="arrow text-ink-3 group-hover:text-ink pr-1" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="label flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-signal animate-pulse shrink-0" aria-hidden="true" />
                <span>{dict.aiAssistant.thinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (visible if few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-line flex gap-1.5 overflow-x-auto shrink-0">
              <button onClick={() => handleQuickPrompt(dict.aiAssistant.promptPhone)} className={quickPrompt}>
                {dict.aiAssistant.promptPhone}
              </button>
              <button onClick={() => handleQuickPrompt(dict.aiAssistant.promptLaptop)} className={quickPrompt}>
                {dict.aiAssistant.promptLaptop}
              </button>
              <button onClick={() => handleQuickPrompt(dict.aiAssistant.promptHeadphones)} className={quickPrompt}>
                {dict.aiAssistant.promptHeadphones}
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 border-t border-line bg-paper shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dict.aiAssistant.inputPlaceholder}
                disabled={loading}
                className="field h-10 pr-11"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label={dict.aiAssistant.button}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xs bg-ink text-ink-inverse hover:bg-signal disabled:opacity-30 disabled:hover:bg-ink inline-flex items-center justify-center transition-colors duration-180 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="label text-center mt-2 normal-case tracking-normal text-[10px]">
              {dict.aiAssistant.disclaimer}
            </p>
          </div>

        </div>
      )}
    </>
  );
}
