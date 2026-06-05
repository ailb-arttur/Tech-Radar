import React, { useEffect, useState } from 'react';
import { TechNews } from '../types';

function Truncated({ text, lines = 3 }: { text: string; lines?: number }) {
  // simple truncation by characters approximate
  const max = lines * 140;
  if (!text) return null;
  if (text.length <= max) return <span>{text}</span>;
  return <span>{text.slice(0, max).trim()}…</span>;
}

export default function NewsFeed() {
  const [items, setItems] = useState<TechNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/news?limit=10');
        if (!res.ok) throw new Error('network');
        const data = await res.json();
        if (mounted) setItems(data);
      } catch (err) {
        // fallback to window.__INITIAL_NEWS if available
        // @ts-ignore
        if (window && (window as any).__INITIAL_NEWS) {
          // @ts-ignore
          setItems((window as any).__INITIAL_NEWS);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => { mounted = false; };
  }, []);

  const primary = items[0];

  return (
    <div id="news-feed-root" className="bg-white p-6 rounded border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 bg-radial-gradient from-hud-green-glow/5 to-transparent pointer-events-none" />

      {loading && <div className="p-6 text-center text-sm">Carregando notícias…</div>}

      {!loading && primary && (
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {primary.image ? (
              <img src={primary.image} alt="thumb" className="w-36 h-24 object-cover rounded border" />
            ) : (
              <div className="w-36 h-24 bg-slate-100 rounded border flex items-center justify-center text-sm text-text-hud-muted">Imagem</div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-hud-green animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-[#059669] uppercase tracking-wider">Notícia de Destaque</span>
                </div>
                <div className="text-[10px] text-text-hud-muted">{primary.source} — {primary.date}</div>
              </div>

              <h3 className="font-sans text-lg lg:text-xl font-bold text-slate-800 hover:text-[#059669] transition-colors leading-snug tracking-tight mb-2 uppercase">{primary.title}</h3>

              <p className="text-[12.5px] text-text-hud-muted font-light leading-relaxed border-l-2 border-[#10b981] pl-4 py-1 mb-4">
                <Truncated text={primary.excerpt || primary.summary || ''} lines={2} />
              </p>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded mb-4 text-[12px] leading-relaxed text-slate-700 font-sans whitespace-pre-line font-light">
                {expandedId === primary.id ? primary.body : <Truncated text={primary.body} lines={3} />}
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => setExpandedId(prev => (prev === primary.id ? null : primary.id))}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-text-hud-muted hover:text-[#059669] transition-colors"
                  aria-label="Expandir legenda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Render remaining items as small cards */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <span className="text-[10px] font-mono text-[#059669] uppercase font-semibold">Outras atualizações do dia</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {items.slice(1).map(item => (
                <article key={item.id} className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded border border-slate-203 hover:border-hud-green/50 cursor-pointer transition-all duration-200 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="flex items-center justify-between text-[9px] text-[#059669] font-mono mb-1">
                    <span className="tracking-wide uppercase font-bold">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-[11px] text-slate-800 font-semibold group-hover:text-[#059669] font-sans truncate uppercase">{item.title}</h4>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="p-6 text-center text-sm">Nenhuma notícia disponível.</div>
      )}
    </div>
  );
}
