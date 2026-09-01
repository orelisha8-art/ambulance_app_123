import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { cn } from "../lib/utils.js";

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "היי, אני עוזר ה-AI של helpMe. איך אפשר לעזור עד שהצוות מגיע?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "לא הצלחתי להתחבר כרגע. נסה שוב בעוד רגע." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="עוזר AI"
        className="fixed bottom-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-portal-purple to-portal-blue text-white shadow-[0_0_24px_-4px_rgba(157,107,255,0.7)] transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-30 flex max-h-[60vh] w-[min(320px,calc(100vw-3rem))] animate-in fade-in slide-in-from-bottom-4 flex-col overflow-hidden rounded-xl border border-portal-purple/30 bg-card/95 shadow-[0_20px_60px_-10px_rgba(157,107,255,0.4)] backdrop-blur-xl duration-300">
          <div className="flex items-center justify-between border-b-2 border-portal-green/50 bg-neutral-900 px-4 py-3 font-bold text-white">
            <span className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-portal-green" />
              עוזר AI
            </span>
            <button onClick={() => setOpen(false)} className="transition-colors hover:text-portal-green">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] animate-in fade-in whitespace-pre-wrap rounded-lg border px-3 py-2 text-sm",
                  m.role === "user"
                    ? "self-end border-portal-blue/40 bg-portal-blue/15 text-foreground"
                    : "self-start border-portal-green/30 bg-portal-green/10 text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex max-w-[85%] animate-in fade-in items-center gap-1 self-start rounded-lg border border-portal-green/30 bg-portal-green/10 px-3 py-2.5 text-sm text-foreground">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-green [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-green [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-portal-green [animation-delay:300ms]" />
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t p-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="הקלד/י הודעה..."
              className="h-9 border-none shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 border-none bg-gradient-to-br from-portal-green to-portal-blue text-neutral-900 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
