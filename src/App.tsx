/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Search, Users, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { INITIAL_ATTACHED_TOOLS, INITIAL_NEWS } from './data';
import { TechNews, ToolSignal } from './types';

const getBadge = (news: TechNews) => {
  if (news.importance === 'HIGH') {
    return { label: 'New', variant: 'new' };
  }

  if (news.importance === 'MEDIUM') {
    return { label: 'Atualizado', variant: 'updated' };
  }

  return { label: 'Trends', variant: 'muted' };
};

const getStatusDot = (status: ToolSignal['status']) => {
  if (status === 'HIGH_IMPACT') return 'active';
  if (status === 'BETA' || status === 'CRITICAL') return 'alert';
  return 'stable';
};

const formatToolAvatar = (tool: ToolSignal) => {
  if (tool.iconType === 'emoji') return tool.iconName;
  return tool.name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const LogoRadar = () => (
  <svg viewBox="0 0 72 72" className="logo-radar" aria-hidden="true">
    <circle cx="36" cy="36" r="24" fill="rgba(91, 110, 245, 0.08)" />
    <circle className="pulse-ring" cx="36" cy="36" r="16" />
    <circle className="radar-core" cx="36" cy="36" r="7" />
    <circle cx="36" cy="36" r="3" fill="#ffffff" />
    <path d="M36 12v8M36 52v8M12 36h8M52 36h8" stroke="#5B6EF5" strokeWidth="2" strokeLinecap="round" opacity="0.24" />
  </svg>
);

export default function App() {
  const [newsList, setNewsList] = useState<TechNews[]>(() => {
    const saved = localStorage.getItem('techradar_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [followList, setFollowList] = useState<ToolSignal[]>(() => {
    const saved = localStorage.getItem('techradar_following');
    return saved ? JSON.parse(saved) : INITIAL_ATTACHED_TOOLS;
  });

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('techradar_news', JSON.stringify(newsList));
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('techradar_following', JSON.stringify(followList));
  }, [followList]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id],
    );
  };

  const activeFollowers = followList.filter(tool => tool.unread).length;

  return (
    <div className="page-frame">
      <div className="page-shell">
        <header className="topbar">
          <div className="brand">
            <LogoRadar />
            <div className="brand-title">
              <strong>Tech Radar</strong>
              <span>Feed inteligente para ferramentas, alertas e insights.</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-toggle"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(prev => !prev)}
          >
            <Users size={18} />
            Quem você segue
          </button>
        </header>

        <div className="page-grid">
          <main className="feed-column">
            <section className="page-header">
              <div>
                <h1>Últimas descobertas no radar</h1>
                <p>
                  Uma experiência de feed inspirada em redes sociais para navegar por novidades, atualizações e alertas de tecnologia com clareza e foco.
                </p>
              </div>
              <div className="cta-row">
                <span className="cta-pill">
                  <Sparkles size={16} /> Destaques do dia
                </span>
                <span className="status-pill">{activeFollowers} seguindo</span>
              </div>
            </section>

            {newsList.map(item => {
              const badge = getBadge(item);
              const isExpanded = expandedIds.includes(item.id);
              return (
                <article key={item.id} className="feed-item">
                  <div className="feed-item__meta">
                    <span className={`badge badge--${badge.variant}`}>{badge.label}</span>
                    <span className="feed-item__source">{item.source}</span>
                    <span className="feed-item__source">• {item.date}</span>
                  </div>

                  <h2 className="feed-item__title">{item.title}</h2>
                  <p className={`feed-item__summary ${isExpanded ? 'expanded' : ''}`}>{item.summary}</p>

                  <div className={`feed-item__details ${isExpanded ? 'expanded' : ''}`}>
                    <p>{item.body}</p>
                  </div>

                  <div className="feed-item__actions">
                    <button
                      type="button"
                      className="feed-item__button"
                      aria-expanded={isExpanded}
                      onClick={() => handleToggleExpand(item.id)}
                    >
                      {isExpanded ? 'Ver menos' : 'Ver mais'}
                      <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    <span className="feed-item__source">{item.category}</span>
                  </div>
                </article>
              );
            })}
          </main>

          <aside className="sidebar" aria-hidden={!sidebarOpen && window.innerWidth < 900}>
            <section className="sidebar-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h2>Quem você segue</h2>
                  <p>Ferramentas & funcionalidades destacadas no seu radar.</p>
                </div>
                <span className="badge badge--new">{activeFollowers} novas</span>
              </div>

              <ul className="follow-list">
                {followList.map(tool => (
                  <li key={tool.id} className="follow-item">
                    <div className="follow-avatar">{formatToolAvatar(tool)}</div>
                    <div className="follow-details">
                      <p className="follow-name">{tool.name}</p>
                      <p className="follow-subtitle">{tool.summary}</p>
                      <div className="follow-status">
                        <span className={`status-dot ${getStatusDot(tool.status)}`} />
                        {tool.status.replace('_', ' ').toLowerCase()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="sidebar-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h2>Atalhos rápidos</h2>
                  <p>Principais áreas de ação no radar.</p>
                </div>
                <span className="status-pill">Tempo real</span>
              </div>

              <div style={{ display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
                <button className="feed-item__button" type="button">
                  <Search size={16} /> Buscar insights
                </button>
                <button className="feed-item__button" type="button">
                  <ArrowRight size={16} /> Ver painel de sinais
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
