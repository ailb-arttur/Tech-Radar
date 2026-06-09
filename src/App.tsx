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

    const randomIndex = Math.floor(Math.random() * attachedTools.length);
    const targetTool = attachedTools[randomIndex];

    const alertsPreset = [
      {
        summary: 'Alta volatilidade detectada na latência do servidor de API.',
        change: 'Injetado novo log de latência média de 450ms em servidores secundários.',
        weak: 'Usuários reportam picos de timeout de 504 no servidor us-east.'
      },
      {
        summary: 'Rumor de nova atualização de segurança crítica encontrada na branch principal.',
        change: 'Preparação para liberação de hotfix urgente no ecossistema.',
        weak: 'Commit assinado com correção de bypass de validação de certificado local.'
      },
      {
        summary: 'Comunidade relata vazamento de recursos e degradação de performance.',
        change: 'Logs internos indicam instabilidade em wrappers de memória assíncronos.',
        weak: 'Discussões preliminares no Discord oficial acumulam novas reclamações.'
      }
    ];

    const randomAlert = alertsPreset[Math.floor(Math.random() * alertsPreset.length)];

    setAttachedTools(prev => prev.map(t => {
      if (t.id === targetTool.id) {
        return {
          ...t,
          unread: true,
          summary: randomAlert.summary,
          changes: [randomAlert.change, ...t.changes],
          weakSignals: [randomAlert.weak, ...t.weakSignals],
          lastUpdated: 'Agora mesmo (Alerta Táctico)'
        };
      }
      return t;
    }));

    setSimulationLogMessage(`Deteção de oscilação na frequência de ${targetTool.name}! Alerta transmitido para o terminal.`);
    triggerToast(`SINAL_TELEMETRIA: Alguém atualizou ${targetTool.name}! Verifique o console.`);
    playSonarSound();
  };

  // Action: Operator marks a tool as read
  const handleOpenToolDetail = (tool: ToolSignal) => {
    setSelectedToolDetail(tool);
    // Mark as read immediately
    setAttachedTools(prev => prev.map(t => {
      if (t.id === tool.id) {
        return { ...t, unread: false };
      }
      return t;
    }));
  };

  // Filter list by category and search
  const filteredTools = attachedTools.filter(tool => {
    const matchesCategory = selectedToolsFilter === 'ALL' || tool.category === selectedToolsFilter;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeNews = newsList[primaryNewsIdx] || newsList[0];

  return (
    <div id="techradar-dashboard-root" className="min-h-screen bg-background text-text-hud font-sans relative overflow-x-hidden select-none">
      
      {/* GLOWING AMBIENT DECORATION */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-hud-green-glow/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[25%] right-10 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-hud-green-glow/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* MOBILE HUD TELEMETRY ALERT */}
      {showSimulationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-hud-green text-hud-green p-4 rounded shadow-[0_4px_20px_rgba(16,185,129,0.18)] max-w-sm flex items-start gap-3 animate-bounce">
          <Radio className="w-5 h-5 shrink-0 animate-pulse text-hud-green mt-1" />
          <div className="text-xs">
            <p className="font-mono font-bold tracking-widest text-[10px] text-[#059669]">ALERTA DE ATUALIZAÇÃO</p>
            <p className="font-sans text-[13px] text-text-hud mt-1 leading-normal">{toastMessage}</p>
          </div>
          <button onClick={() => setShowSimulationToast(false)} className="text-hud-green-dim hover:text-[#047857] text-xs font-bold font-mono">
            [X]
          </button>
        </div>
      )}

      {/* --- SIDEBAR PANEL --- */}
      <aside id="radar-sidebar" className="hidden lg:flex flex-col h-screen w-72 border-r border-slate-200 bg-white fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-slate-200 flex flex-col gap-1.5 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-hud-green-glow border border-hud-green text-hud-green flex items-center justify-center font-bold text-lg shadow-[0_2px_8px_rgba(16,185,129,0.15)] relative overflow-hidden group">
              <span className="relative z-10 font-mono text-[16px] tracking-tighter text-[#059669]">TR</span>
              <div className="absolute inset-0 bg-hud-green/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="font-mono text-[17px] font-bold text-[#059669] tracking-tight flex items-center gap-1.5">
                TECH RADAR
                <span className="inline-block w-2 h-2 rounded-full bg-hud-green animate-pulse" />
              </h1>
              <span className="font-mono text-[9px] text-text-hud-muted tracking-widest block uppercase">ATUALIZAÇÕES</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4" id="sidebar-action-btn-container">
          <button
            id="sidebar-add-signal-btn"
            onClick={() => {
              setActiveTabCatalog('catalog');
              setShowAddModal(true);
              playSonarSound();
            }}
            className="w-full h-11 flex items-center justify-center gap-2 bg-hud-green hover:bg-[#059669] text-white border border-[#10b981] font-mono text-[11px] font-extrabold tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.25)] rounded cursor-pointer uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            CADASTRAR NOVO SINAL
          </button>
        </div>

        {/* Sidebar Mini Counters Section */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-text-hud-muted uppercase font-semibold border-b border-border-dim/20 pb-1">
            <span>ATIVOS NO PAINEL</span>
            <span className="text-hud-green bg-hud-green/10 px-2 rounded-sm font-bold">{attachedTools.length}</span>
          </div>
        </div>

        {/* Stream of active tools with unread indicators */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
          {attachedTools.length === 0 ? (
            <div className="font-mono text-[11px] text-text-hud-muted text-center py-6 border border-dashed border-slate-350 rounded">
              [ NENHUM_NÓ_ATIVO ]
            </div>
          ) : (
            attachedTools.map(tool => {
              const IconComp = IconComponents[tool.iconName] || Terminal;
              return (
                <div
                  id={`sidebar-tool-${tool.id}`}
                  key={tool.id}
                  onClick={() => handleOpenToolDetail(tool)}
                  className={`flex items-center justify-between px-3 h-10 rounded cursor-pointer border group transition-all duration-300 ${
                    tool.unread 
                      ? 'bg-hud-green/10 border-hud-green/45 hover:border-hud-green' 
                      : 'border-transparent hover:bg-slate-100/80 hover:border-slate-200/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[#059669] group-hover:scale-110 transition-transform">
                      {tool.iconType === 'lucide' ? (
                        <IconComp className="w-4 h-4" />
                      ) : (
                        <span className="text-sm">{tool.iconName}</span>
                      )}
                    </span>
                    <span className="font-mono text-[12px] text-text-hud/85 group-hover:text-text-hud truncate uppercase">
                      {tool.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#059669] group-hover:text-hud-green text-right">
                      {tool.version}
                    </span>
                    {tool.unread && (
                      <span className="w-2 h-2 rounded-full bg-hud-green shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SECTORS NAV FILTER */}
        <nav className="p-4 border-t border-slate-200 bg-slate-50" id="sidebar-categories-nav">
          <div className="px-1.5 pb-2">
            <span className="text-[10px] uppercase tracking-wide text-text-hud-muted font-bold font-mono">Setores do Radar</span>
          </div>
          <div className="space-y-0.5">
            <button
              id="filter-category-all"
              onClick={() => setSelectedToolsFilter('ALL')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[11px] font-mono transition-all duration-200 uppercase ${
                selectedToolsFilter === 'ALL'
                  ? 'text-[#059669] bg-hud-green/10 border border-[#10b981]/30 font-bold'
                  : 'text-text-hud-muted hover:text-text-hud hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-hud-green rounded-full" />
                <span>TODAS AS FERRAMENTAS</span>
              </div>
              <span className="text-[10px] text-text-hud-muted">{attachedTools.length}</span>
            </button>

            {CATEGORIES.map(cat => {
              const activeCount = attachedTools.filter(t => t.category === cat.key).length;
              return (
                <button
                  id={`filter-category-${cat.key}`}
                  key={cat.key}
                  onClick={() => setSelectedToolsFilter(cat.key)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-[10px] font-mono transition-all duration-200 uppercase ${
                    selectedToolsFilter === cat.key
                      ? 'text-[#059669] bg-hud-green/15 border border-[#10b981]/30 font-bold'
                      : 'text-text-hud-muted hover:text-[#059669] hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[9px] text-text-hud-muted bg-slate-100/80 px-1 rounded border border-slate-200/50">
                    {activeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* OPERATOR PANEL */}
        <div id="operator-footer" className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-hud-green/55 overflow-hidden shadow-[0_2px_8px_rgba(16,185,129,0.15)] bg-slate-100 flex items-center justify-center text-[#059669]">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono text-text-hud font-bold truncate tracking-wider uppercase">{operatorName}</p>
              <p className="text-[9px] font-mono text-hud-green-dim tracking-wider uppercase truncate">{operatorLevel}</p>
            </div>
            <button 
              id="toggle-operator-config-btn"
              onClick={() => {
                setShowOperatorConfig(prev => !prev);
                playSonarSound();
              }}
              title="Configurações de Identidade do Operador"
              className="text-[#64748b] hover:text-[#059669] p-1 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Quick inline Operator edit Form */}
          {showOperatorConfig && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border border-slate-200 p-2.5 rounded bg-white flex flex-col gap-2 font-mono text-[10px]"
            >
              <div>
                <label className="text-text-hud-muted block mb-0.5 uppercase tracking-wide">ID do Operador</label>
                <input
                  type="text"
                  maxLength={16}
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[#059669] placeholder:text-slate-400 focus:outline-none focus:border-hud-green"
                />
              </div>
              <div>
                <label className="text-text-hud-muted block mb-0.5 uppercase tracking-wide">Credencial de Acesso</label>
                <select
                  value={operatorLevel}
                  onChange={(e) => setOperatorLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[#059669] focus:outline-none focus:border-hud-green"
                >
                  <option value="NÍVEL_4_CREDENTIAL text-xs uppercase">オペレーター_LEVEL_4</option>
                  <option value="DEVELOPER_COMMUNITY_AUTH">DEV_AUTH_COMMUNITY</option>
                  <option value="INTRUDER_OVERRIDE_ROOT">SUPER_SYS_ROOT</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  setShowOperatorConfig(false);
                  triggerToast("Credenciais atualizadas.");
                }}
                className="bg-hud-green/10 text-[#059669] hover:bg-hud-green/20 py-1 text-center font-bold tracking-widest border border-[#10b981]/30 rounded uppercase cursor-pointer"
              >
                APLICAR
              </button>
            </motion.div>
          )}

          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-mono text-text-hud-muted font-light uppercase">CONEXÃO LOCAL ATIVA</span>
            <button 
              id="shutdown-trigger"
              onClick={() => {
                const conf = window.confirm("Deseja mesmo restaurar o painel para o padrão original?");
                if (conf) {
                  localStorage.clear();
                  setAttachedTools(INITIAL_ATTACHED_TOOLS);
                  setCatalogItems(CATALOG_PRESET_ITEMS);
                  setNewsList(INITIAL_NEWS);
                  setPrimaryNewsIdx(0);
                  setOperatorName('ADMIN_USER');
                  setOperatorLevel('ADMINISTRADOR');
                  triggerToast("Painel restaurado com sucesso!");
                  playSonarSound();
                }
              }}
              title="Restaurar padrão inicial"
              className="text-red-500/70 hover:text-red-400 font-bold transition-all text-[10px] uppercase font-mono cursor-pointer"
            >
              [ LIMPAR ]
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD BODY --- */}
      <main id="main-content" className="flex-1 lg:ml-72 min-h-screen relative flex flex-col">
        
        {/* TOP HUD HEADER */}
        <header id="hud-header" className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200 opacity-98 shadow-sm">
          
          {/* Dashboard Title & Short Explainer */}
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#059669] animate-pulse" />
                <h2 className="font-mono text-xs uppercase tracking-wider text-[#059669] font-bold">
                  RADAR DE ATUALIZAÇÕES
                </h2>
              </div>
              <p className="text-[11px] text-text-hud-muted font-sans mt-0.5">
                Central prática de monitoramento e alertas para ferramentas de desenvolvimento.
              </p>
            </div>
          </div>

          {/* Quick Header Search input */}
          <div id="header-search-container" className="relative max-w-xs w-full mr-4 hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#059669]" />
            <input
              type="text"
              placeholder="Buscar ferramentas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 pl-9 pr-8 py-1.5 rounded text-[11px] font-mono focus:outline-none focus:border-hud-green focus:ring-0 placeholder:text-text-hud-muted/60 text-[#0f172a] tracking-wide"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-text-hud-muted hover:text-[#059669] text-[10px]"
              >
                [X]
              </button>
            )}
          </div>

          {/* Status & Time */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0" id="header-telemetry-stats">
            
            {/* Live simulation control bar */}
            <button
              onClick={triggerLiveSignalSimulator}
              title="Simular novas mudanças em ferramentas"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-mono bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 hover:border-[#10b981]/80 text-[#059669] duration-300 rounded cursor-pointer font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>SIMULAR NOVO SINAL</span>
            </button>

            <div className="flex flex-col items-end shrink-0 select-none">
              <span className="text-[9px] font-mono text-text-hud-muted uppercase tracking-wider">HORA_SISTEMA_BR</span>
              <span id="systime-display" className="text-[13px] font-mono text-[#059669] font-bold tracking-widest">{systemTime || '14:24:25'}</span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            {/* Simulated notification beacon status */}
            <div className="flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-[#059669] animate-pulse cursor-pointer" onClick={() => triggerToast("Sensores de telemetria operacionais e varrendo frequências.")} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-hud-green rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            </div>

          </div>
        </header>

        {/* MAIN BODY AREAGRID */}
        <div className="p-4 lg:p-8 flex-1 max-w-[1440px] w-full mx-auto space-y-6">

          {/* Slogan Banner mobile view */}
          <div className="block lg:hidden bg-white p-5 border border-slate-200 rounded text-center shadow-sm">
            <h1 className="font-mono text-[#059669] text-sm font-bold tracking-widest">RADAR DE FERRAMENTAS</h1>
            <p className="text-[11px] text-text-hud-muted mt-1 leading-relaxed">
              Acompanhe novidades e atualizações das suas APIs, frameworks e IA em um painel unificado.
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                id="mobile-add-btn"
                onClick={() => {
                  setActiveTabCatalog('catalog');
                  setShowAddModal(true);
                  playSonarSound();
                }}
                className="bg-[#10b981] hover:bg-[#059669] text-white border border-[#10b981] font-mono font-extrabold text-[10px] px-3 py-1.5 rounded flex items-center gap-1 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-3 h-3 stroke-[2.5px]" /> ADICIONAR APIS
              </button>
              <button
                id="mobile-simulate-btn"
                onClick={triggerLiveSignalSimulator}
                className="border border-[#10b981]/30 bg-[#10b981]/5 text-[#059669] font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer"
              >
                SIMULAR ALERTA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* --- LEFT HAND COLUMN (NEWS CARD + SUBHEADINGS + FILTER CATEGORIES DISPLAY) --- */}
              <div className="lg:col-span-8 flex flex-col gap-6">
              
                {/* News Feed Component (fetches /api/news) */}
                <div id="news-section">
                  {/* Lazy-loaded NewsFeed component */}
                  <React.Suspense fallback={<div className="bg-white p-6 rounded border border-slate-200">Carregando feed...</div>}>
                    {/* @ts-ignore - dynamic import to keep App build simple */}
                    <NewsFeed />
                  </React.Suspense>
                </div>

              {/* DYNAMIC LIST HEADER AND MOBILE/TABLET CATEGORY SWITCHERS */}
              <div className="flex flex-col gap-4">
                
                {/* Search Bar on smaller viewports */}
                <div className="block md:hidden relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-text-hud-muted" />
                  <input
                    type="text"
                    placeholder="Filtrar ferramentas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-8 py-2 rounded text-xs font-mono text-slate-800 placeholder:text-text-hud-muted/50"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-2 border-[#10b981] pl-4 py-0.5">
                  <div>
                    <h3 className="font-mono text-[14px] font-bold text-slate-800 tracking-wide uppercase">
                      Ferramentas Monitoradas ({filteredTools.length})
                    </h3>
                    <p className="text-[10px] font-mono text-text-hud-muted mt-0.5 uppercase tracking-wide">
                      Exibindo do setor: {selectedToolsFilter === 'ALL' ? 'Todos os setores do radar' : selectedToolsFilter}
                    </p>
                  </div>

                  {/* Sector selector available directly below header list */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedToolsFilter('ALL')}
                      className={`px-2.5 py-1 rounded text-[9.5px] font-mono tracking-wider transition-all cursor-pointer border ${
                        selectedToolsFilter === 'ALL'
                          ? 'bg-[#10b981] text-white border-[#10b981] font-bold'
                          : 'bg-slate-50 border-slate-200 hover:border-[#10b981]/50 text-text-hud-muted'
                      }`}
                    >
                      TODOS
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedToolsFilter(cat.key)}
                        className={`px-2.5 py-1 rounded text-[9.5px] font-mono tracking-wider transition-all cursor-pointer border ${
                          selectedToolsFilter === cat.key
                            ? 'bg-[#10b981] text-white border-[#10b981] font-bold'
                            : 'bg-slate-50 border-slate-200 hover:border-[#10b981]/50 text-text-hud-muted'
                        }`}
                      >
                        {cat.label.slice(0, 10)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- CHIP GRID of matching tools --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tools-main-grid">
                  
                  {/* High-prominence Quick-Add Tool Card in grid */}
                  <div 
                    onClick={() => {
                      setActiveTabCatalog('catalog');
                      setShowAddModal(true);
                      playSonarSound();
                    }}
                    className="bg-[#10b981]/5 hover:bg-[#10b981]/15 border-2 border-dashed border-[#10b981]/50 hover:border-[#10b981] rounded-lg p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group transition-all duration-300 shadow-sm min-h-[160px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#10b981]/15 text-[#059669] flex items-center justify-center border border-[#10b981]/30 group-hover:scale-105 group-hover:bg-[#10b981] group-hover:text-white group-hover:border-none transition-all">
                      <Plus className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[12px] font-extrabold text-[#059669] uppercase tracking-wider">
                        + ADICIONAR_SINAL_NOVO
                      </h4>
                      <p className="text-[11px] text-[#047857] mt-1 pr-1 leading-normal max-w-[220px]">
                        Clique para anexar do catálogo rápido ou cadastrar manualmente de forma prática.
                      </p>
                    </div>
                  </div>

                  {filteredTools.length === 0 ? (
                    <div className="col-span-1 text-center py-12 bg-slate-50 border border-dashed border-slate-200 p-6 rounded flex flex-col items-center justify-center gap-2">
                      <Sliders className="w-8 h-8 text-text-hud-muted animate-spin" />
                      <p className="font-mono text-xs text-text-hud-muted mt-1 uppercase">
                        Nenhuma ferramenta encontrada com os filtros atuais.
                      </p>
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-[10px] font-mono text-[#059669] bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-1 rounded hover:bg-[#10b981]/20"
                        >
                          [ LIMPAR BUSCA ]
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredTools.map(tool => {
                      const IconComp = IconComponents[tool.iconName] || Code;
                      return (
                        <article
                          id={`tool-card-${tool.id}`}
                          key={tool.id}
                          className="bg-white border border-slate-200 rounded p-4 relative glow-border transition-all duration-300 group overflow-hidden cursor-pointer hover:shadow-md"
                          onClick={() => handleOpenToolDetail(tool)}
                        >
                          {/* Unread Glowing Corner indicators */}
                          {tool.unread && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-[#10b981] rounded-bl animate-pulse shadow-[0_2px_8px_rgba(16,185,129,0.4)]" title="Sinal atualizado recente" />
                          )}

                          {/* Quick details */}
                          <div className="flex gap-4 items-start">
                            
                            {/* Graphic icon display container */}
                            <div className="w-11 h-11 shrink-0 bg-slate-50 border border-slate-200 hover:border-hud-green group-hover:border-[#10b981] rounded flex items-center justify-center text-[#059669] relative">
                              {tool.iconType === 'lucide' ? (
                                <IconComp className="w-5 h-5" />
                              ) : (
                                <span className="text-xl">{tool.iconName}</span>
                              )}
                              <div className="absolute inset-0 border border-[#10b981]/15 group-hover:animate-ping opacity-30 pointer-events-none" />
                            </div>

                            {/* Signal label */}
                            <div className="flex-1 min-w-0">
                              
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[9px] font-bold text-[#059669] px-1.5 py-0.2 border border-[#10b981]/10 bg-hud-green/10 rounded">
                                  {tool.status}
                                </span>
                                <span className="font-mono text-[9px] text-text-hud-muted truncate">
                                  {tool.lastUpdated}
                                </span>
                              </div>

                              <h4 className="font-mono text-[14px] font-bold text-slate-850 group-hover:text-[#059669] uppercase tracking-tight truncate">
                                {tool.name}
                              </h4>

                            </div>
                          </div>

                          <p className="font-sans font-light text-[12px] text-text-hud-muted mt-3 line-clamp-2 leading-relaxed border-l border-slate-200 pl-2">
                            {tool.summary}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-[#059669] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              VER: {tool.version}
                            </span>

                            {/* Actions bar for each card */}
                            <div className="flex items-center gap-1.5">
                              
                              {/* Open tool details display */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenToolDetail(tool);
                                }}
                                className="font-mono text-[10px] px-2.5 py-1 text-[#059669] hover:text-white hover:bg-[#10b981] rounded transition-colors uppercase font-bold cursor-pointer"
                              >
                                [ DETALHES ]
                              </button>

                              {/* Trigger Delete confirmation */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToolToDelete(tool);
                                  playSonarSound();
                                }}
                                className="p-1 text-text-hud-muted/60 hover:text-red-500 rounded transition-colors cursor-pointer"
                                title="Remover do painel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>

                          </div>

                        </article>
                      );
                    })
                  )}
                </div>

                 {/* Catalog shortcut invitation banner */}
                 <button
                   id="scan-more-frequencies-btn"
                   onClick={() => {
                     setActiveTabCatalog('catalog');
                     setShowAddModal(true);
                     playSonarSound();
                   }}
                   className="w-full py-4 font-mono text-[11px] font-bold text-[#059669] bg-slate-50 hover:bg-slate-100/70 border border-dashed border-slate-300 rounded-lg hover:border-[#10b981] transition-all duration-300 uppercase tracking-wide cursor-pointer shadow-sm"
                 >
                   [ + INTEGRAR OUTRAS APIS E FERRAMENTAS ]
                 </button>

              </div>

            </div>

            {/* --- RIGHT HAND COLUMN (TACTICAL RADAR HUD & STATUS LOG) --- */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* INTERACTIVE RADAR GRAPHIC BOX */}
              <div id="radar-widget" className="bg-white border border-slate-200 p-5 rounded relative overflow-hidden shadow-sm flex flex-col items-center">
                
                {/* Simulated scanning stats overlay */}
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${isRadarScanning ? 'bg-[#10b981] animate-pulse' : 'bg-orange-500'}`} />
                  <span className="font-mono text-[9px] text-[#059669] tracking-wider uppercase font-bold" id="radar-status-text">
                    {isRadarScanning ? 'RADAR ATIVO' : 'VARREDURA PAUSADA'}
                  </span>
                </div>

                {/* Scanning frequency level toggle */}
                <button
                  onClick={() => {
                    setIsRadarScanning(!isRadarScanning);
                    playSonarSound();
                  }}
                  className="absolute top-3 right-4 font-mono text-[8px] bg-slate-50 hover:bg-[#10b981]/15 px-1.5 py-0.5 rounded border border-slate-200 text-[#059669] cursor-pointer uppercase transition-colors"
                >
                  {isRadarScanning ? '[ PAUSAR ]' : '[ INICIAR ]'}
                </button>

                {/* Radar Stage Grid */}
                <div 
                  id="radar-graphic-container"
                  onClick={() => {
                    playSonarSound();
                    triggerToast("Sonar manual emitido: varrendo assinatura de ruído eletromagnético.");
                  }}
                  className="relative w-48 h-48 border-[1.5px] border-[#10b981]/30 hover:border-[#10b981]/50 rounded-full flex items-center justify-center my-6 group cursor-crosshair transition-all duration-300"
                >
                  
                  {/* Concentric Circle Grids */}
                  <div className="absolute w-[75%] h-[75%] border border-[#10b981]/15 rounded-full" />
                  <div className="absolute w-[50%] h-[50%] border border-[#10b981]/10 rounded-full" />
                  <div className="absolute w-[25%] h-[25%] border border-[#10b981]/15 rounded-full font-mono text-[6px] text-[#059669]/40 flex items-center justify-center font-bold">10nm</div>
                  
                  {/* Crosshairs lines */}
                  <div className="absolute w-full h-[0.5px] bg-[#10b981]/15" />
                  <div className="absolute w-[0.5px] h-full bg-[#10b981]/15" />

                  {/* Sweep gradient radar overlay */}
                  {isRadarScanning && (
                    <div className="absolute inset-0 radar-sweep-animation overflow-hidden rounded-full pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-[#10b981]/15 to-transparent origin-top-left -rotate-[45deg]" />
                    </div>
                  )}

                  {/* Dynamic Blips depicting tracked points */}
                  <div className="absolute top-10 right-14 w-2 h-2 bg-[#10b981] rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" title="Frequência detectada (OpenAI API)">
                    <div className="absolute inset-0 radar-blip-animation bg-[#10b981] rounded-full" />
                  </div>

                  <div className="absolute bottom-12 left-10 w-2 h-2 bg-[#10b981] rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.5)] opacity-70" title="Assinatura de freq estável">
                    <div className="absolute inset-0 radar-blip-animation bg-[#10b981] rounded-full" style={{ animationDelay: '1s' }} />
                  </div>

                  <div className="absolute bottom-8 right-16 w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-90 shadow-[0_2px_5px_rgba(234,179,8,0.5)]" title="Oscilação detectada">
                    <div className="absolute inset-0 radar-blip-animation bg-yellow-500 rounded-full animate-ping" />
                  </div>

                  {/* Interactive touch action helper */}
                  <span className="absolute bottom-1 font-mono text-[8px] text-text-hud-muted tracking-wide text-center uppercase group-hover:text-[#059669] opacity-55 group-hover:opacity-100 transition-all duration-300">
                    Clique para escaneamento manual
                  </span>

                </div>

                {/* Radar Description & Summarized Status */}
                <div className="w-full border-t border-slate-200 pt-4 space-y-3 font-mono">
                  
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#059669] uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Frequência de Busca</span>
                    <span>{lastScanCount} Hz</span>
                  </div>

                  {/* Logs list depicting simulated actions */}
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] space-y-2 h-[150px] overflow-y-auto leading-normal font-light">
                    
                    <p className="border-b border-slate-150 pb-1 flex justify-between">
                      <span className="text-[#059669] font-semibold">[PULSAR]</span>
                      <span className="text-slate-400 font-mono text-[8px]">{systemTime || '14:24:25'}</span>
                    </p>
                    <p className="text-slate-750">{simulationLogMessage}</p>
                    <p className="text-text-hud-muted">
                      Monitoramento ativo: <span className="text-[#059669] font-bold">{attachedTools.length}</span> APIs e ferramentas.
                    </p>
                    <p className="text-[9px] text-slate-500 italic border-t border-slate-150 pt-1">
                      * Informações coletadas de repositórios públicos, fóruns de tecnologia e documentações oficiais.
                    </p>
                  </div>

                  {/* Action block simulated signals */}
                  <div className="pt-2">
                    <button
                      onClick={triggerLiveSignalSimulator}
                      className="w-full bg-[#10b981] text-white hover:bg-[#059669] border border-[#10b981] py-2 text-center text-[11px] font-bold font-mono rounded inline-block transition-colors cursor-pointer uppercase tracking-wider shadow-sm"
                    >
                      SIMULAR ATUALIZAÇÃO
                    </button>
                    <span className="text-[8px] text-center block text-text-hud-muted mt-1 leading-normal uppercase text-slate-400">
                      Gera uma novidade aleatória em uma das ferramentas monitoradas
                    </span>
                  </div>

                </div>

              </div>

              {/* TACTICAL METRICS ACCREDITATIONS & STATISTICS */}
              <div id="stats-widget" className="bg-white p-4 border border-slate-200 rounded space-y-4 font-mono shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">
                  <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
                  <span className="font-mono text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    Métricas Globais
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  
                  {/* Status breakdowns */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-text-hud-muted uppercase text-[9px]">
                      <span>Críticos / Alertas</span>
                      <span className="text-red-500 font-semibold">{attachedTools.filter(t => t.status === 'CRITICAL').length} ativos</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden p-[1px] border border-slate-200">
                      <div 
                        className="bg-red-500 h-full rounded-sm" 
                        style={{ width: `${Math.max(10, Math.min(100, (attachedTools.filter(t => t.status === 'CRITICAL').length / (attachedTools.length || 1)) * 100))}%` }} 
                        id="critical-bar-gauge"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-text-hud-muted uppercase text-[9px]">
                      <span>Mudanças Estáveis</span>
                      <span className="text-[#059669] font-semibold">{attachedTools.filter(t => t.status === 'STABLE').length} estáveis</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden p-[1px] border border-slate-200">
                      <div 
                        className="bg-[#10b981] h-full rounded-sm" 
                        style={{ width: `${Math.max(15, Math.min(100, (attachedTools.filter(t => t.status === 'STABLE').length / (attachedTools.length || 1)) * 100))}%` }} 
                        id="stable-bar-gauge"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-[9px] text-[#047857] leading-relaxed select-text">
                    <p className="font-bold">CONEXÃO REAL:</p>
                    <p className="mt-0.5">
                      Adicione chaves de API reais ao seu arquivo de ambiente local .env para buscar atualizações automáticas de pacotes.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM UTILITY FOOTER */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-text-hud-muted shadow-sm">
          <div>
            <span>TECH RADAR © 2026. ACOMPANHAMENTO PRÁTICO DE ATUALIZAÇÕES.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#059669] uppercase">OPERADOR: {operatorLevel}</span>
            <div className="h-4 w-px bg-slate-300" />
            <button
               onClick={() => triggerToast("Configure o arquivo .env do seu projeto local para conectar com APIs reais em produção.")}
               className="hover:text-[#059669] text-[10px] cursor-pointer"
            >
              [ INFORMAÇÕES ]
            </button>
          </div>
        </footer>

        {/* --- MODAL 1: ADD NEW SIGNAL / CATALOG (MANUAL & POPULAR PRESETS) --- */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="modal-add-container">
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border border-slate-250 max-w-2xl w-full rounded-lg overflow-hidden shadow-xl flex flex-col"
              >
                
                {/* Modal header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#059669]" />
                    <h3 className="font-mono text-xs font-bold tracking-wider text-[#059669] uppercase">
                      INTEGRAR NOVA FERRAMENTA OU API
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      playSonarSound();
                    }}
                    className="text-text-hud-muted hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab selectors */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                  <button
                    onClick={() => {
                      setActiveTabCatalog('catalog');
                      playSonarSound();
                    }}
                    className={`flex-1 py-3 text-center font-mono text-[11px] font-bold tracking-wider transition-colors cursor-pointer ${
                      activeTabCatalog === 'catalog'
                        ? 'bg-[#10b981]/10 text-[#059669] border-b-2 border-[#10b981]'
                        : 'text-text-hud-muted hover:text-[#059669] hover:bg-slate-100'
                    }`}
                  >
                    CATÁLOGO POPULAR
                  </button>
                  <button
                    onClick={() => {
                      setActiveTabCatalog('manual');
                      playSonarSound();
                    }}
                    className={`flex-1 py-3 text-center font-mono text-[11px] font-bold tracking-wider transition-colors cursor-pointer ${
                      activeTabCatalog === 'manual'
                        ? 'bg-[#10b981]/10 text-[#059669] border-b-2 border-[#10b981]'
                        : 'text-text-hud-muted hover:text-[#059669] hover:bg-slate-100'
                    }`}
                  >
                    CRIAR MANUAL DE FORMA SIMPLES
                  </button>
                </div>

                {/* Modal Body scrollable */}
                <div className="p-5 overflow-y-auto max-h-[67vh] space-y-4 bg-white text-slate-800">
                  
                  {/* --- TAB 1: PRESET CATALOG --- */}
                  {activeTabCatalog === 'catalog' && (
                    <div className="space-y-4">
                      
                      <div className="text-center py-2 bg-[#10b981]/5 rounded-lg border border-[#10b981]/10">
                        <span className="font-sans text-[12px] text-slate-800 font-medium">
                          Integre rapidamente serviços, IAs e bibliotecas com um único clique.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {catalogItems.map(preset => {
                          const isAlreadyAttached = attachedTools.some(t => t.id === preset.id);
                          return (
                            <div 
                              key={preset.id}
                              className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                                isAlreadyAttached 
                                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                                  : 'bg-white border-slate-200 hover:border-[#10b981] hover:bg-slate-50/70'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl shrink-0">{preset.iconName}</span>
                                <div className="text-left">
                                  <span className="font-mono text-[12.5px] text-slate-800 font-bold block uppercase tracking-tight">{preset.name}</span>
                                  <span className="font-mono text-[9px] text-[#059669] tracking-wide uppercase font-semibold">SETOR: {preset.category}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddPresetTool(preset)}
                                disabled={isAlreadyAttached}
                                className={`px-3 py-1.5 rounded font-mono text-[9.5px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                                  isAlreadyAttached
                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                    : 'bg-[#10b981] hover:bg-[#059669] text-white'
                                }`}
                              >
                                {isAlreadyAttached ? 'ATIVO' : 'INTEGRAR'}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* --- TAB 2: MANUAL REGISTRATION FORM --- */}
                  {activeTabCatalog === 'manual' && (
                    <form onSubmit={handleAddManualTool} className="space-y-4 text-left font-sans">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Nome da Ferramenta / API *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Gemini SDK, Bun Toolkit"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Versão Inicial Conhecida
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: v1.0.0, v0.42.1"
                            value={manualVersion}
                            onChange={(e) => setManualVersion(e.target.value)}
                            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          />
                        </div>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Setor do Radar
                          </label>
                          <select
                            value={manualCategory}
                            onChange={(e) => setManualCategory(e.target.value as CategoryKey)}
                            className="w-full bg-slate-50 text-slate-850 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat.key} value={cat.key}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Resumo de Mudanças Crítico (Linha Única)
                          </label>
                          <input
                            type="text"
                            placeholder="Breve descrição da novidade do dia"
                            value={manualSummary}
                            onChange={(e) => setManualSummary(e.target.value)}
                            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          />
                        </div>

                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                          Mudanças Recentes / Changelog Histórico (Uma alteração por linha)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Ex: Corrigido vazamento de conexões assíncronas&#10;Melhorado suporte para renderização em WebGL"
                          value={manualChangeLog}
                          onChange={(e) => setManualChangeLog(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                        
                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Previsões &amp; Rumores da Comunidade
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ex: nova v2.0 planejada para meados de agosto"
                            value={manualPrediction}
                            onChange={(e) => setManualPrediction(e.target.value)}
                            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[10px] text-text-hud-muted uppercase block mb-1">
                            Sinais Fracos (Rumores no Reddit, Foruns, Twitter)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ex: Desenvolvedores reclamando de erros de CORS em posts offline"
                            value={manualSignalsMsg}
                            onChange={(e) => setManualSignalsMsg(e.target.value)}
                            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded p-2 text-xs focus:outline-none focus:border-[#10b981]"
                          />
                        </div>

                      </div>

                      <div className="pt-3 flex justify-end gap-3 font-mono">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddModal(false);
                            playSonarSound();
                          }}
                          className="px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded text-[11px] text-slate-500 cursor-pointer"
                        >
                          CANCELAR
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-semibold text-[11px] rounded cursor-pointer uppercase tracking-wider"
                        >
                          SALVAR NOVA FERRAMENTA
                        </button>
                      </div>

                    </form>
                  )}

                </div>

                {/* Footer instructions */}
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-[9px] font-mono text-text-hud-muted uppercase text-center">
                  * Armazenamento seguro e local: Suas personalizações são salvas diretamente no navegador.
                </div>

              </motion.div>

            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL 2: DETAIL EXPANSIVE RADAR DRAWER --- */}
        <AnimatePresence>
          {selectedToolDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="tool-detail-drawer">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white border border-slate-250 max-w-xl w-full rounded-lg overflow-hidden shadow-xl flex flex-col font-mono"
              >
                
                {/* Drawer header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#059669] text-xl">
                      {selectedToolDetail.iconType === 'emoji' ? selectedToolDetail.iconName : '🔒'}
                    </span>
                    <div>
                      <h3 className="text-slate-800 font-bold text-sm tracking-tight uppercase">
                        {selectedToolDetail.name} — Detalhes da Ferramenta
                      </h3>
                      <p className="text-[9px] text-text-hud-muted tracking-wide mt-0.5">Setor: {selectedToolDetail.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedToolDetail(null);
                      playSonarSound();
                    }}
                    className="text-text-hud-muted hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer specifications content */}
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-left leading-relaxed text-[12px] bg-white text-slate-800">
                  
                  {/* Highlight box */}
                  <div className="bg-slate-50 p-4 rounded border border-slate-200 font-mono">
                    <p className="text-[10px] text-[#059669] font-bold uppercase tracking-wider mb-1">ÚLTIMA ATUALIZAÇÃO RELEVANTE</p>
                    <p className="font-sans text-[13px] text-slate-700 font-light leading-relaxed">{selectedToolDetail.summary}</p>
                  </div>

                  {/* Operational Telemetry specification grid */}
                  <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-3 bg-slate-50 px-2 rounded">
                    <div>
                      <span className="text-text-hud-muted uppercase text-[9px] block">Versão Estável</span>
                      <span className="text-[#059669] font-bold text-[13px] mt-0.5 block">{selectedToolDetail.version}</span>
                    </div>
                    <div>
                      <span className="text-text-hud-muted uppercase text-[9px] block">Nível de Alerta</span>
                      <span className="text-amber-600 font-semibold text-[12px] uppercase mt-0.5 block">{selectedToolDetail.status}</span>
                    </div>
                    <div>
                      <span className="text-text-hud-muted uppercase text-[9px] block">Sincronização</span>
                      <span className="text-slate-700 block mt-0.5">{selectedToolDetail.lastUpdated}</span>
                    </div>
                    <div>
                      <span className="text-text-hud-muted uppercase text-[9px] block">Fonte do Feed</span>
                      <span className="text-slate-700 block mt-0.5">Simulação RSS / Histórico</span>
                    </div>
                  </div>

                  {/* List of modifications */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[#059669] border-b border-slate-200 pb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">NOTAS DE LANÇAMENTO (CHANGELOG)</span>
                    </div>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-600 font-sans font-light">
                      {selectedToolDetail.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Previsões e Rumores (Sinais Fracos) */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-1 text-amber-600 border-b border-slate-200 pb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600">Previsões &amp; Rumores da Comunidade</span>
                    </div>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-600 font-sans font-light">
                      {selectedToolDetail.predictions.map((p, i) => (
                        <li key={i} className="italic text-amber-800">{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Sinais fracos colhidos em comunidades */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-1 text-[#059669] border-b border-slate-200 pb-1">
                      <Info className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#059669]">Sinais Fracos Detectados (Reddit / Foruns)</span>
                    </div>
                    <ul className="space-y-1.5 pl-4 list-decimal text-slate-600 font-sans font-light">
                      {selectedToolDetail.weakSignals && selectedToolDetail.weakSignals.length > 0 ? (
                        selectedToolDetail.weakSignals.map((ws, i) => (
                          <li key={i}>{ws}</li>
                        ))
                      ) : (
                        <li>Nenhum comportamento anômalo ou rumor delicado relatado nas comunidades no momento.</li>
                      )}
                    </ul>
                  </div>

                  {/* Alertas de segurança ou obsolescência */}
                  {selectedToolDetail.securityAlerts && selectedToolDetail.securityAlerts.length > 0 && (
                    <div className="space-y-2 border-t border-red-200 pt-3 bg-red-50 p-3 rounded font-mono">
                      <div className="flex items-center gap-1.5 text-red-600 border-b border-red-200 pb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[11px] font-bold tracking-wider uppercase text-red-600">Alertas de Segurança Importantes</span>
                      </div>
                      <ul className="space-y-1 pl-1 text-red-700 font-sans font-normal">
                        {selectedToolDetail.securityAlerts.map((sa, i) => (
                          <li key={i}>{sa}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

                {/* Footer block buttons */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between gap-3 bg-white">
                  <span className="text-[8px] text-text-hud-muted uppercase font-light self-center">
                    Garantia de privacidade ativa: modo offline local.
                  </span>
                  <button
                    onClick={() => {
                      setSelectedToolDetail(null);
                      playSonarSound();
                    }}
                    className="px-6 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white font-semibold text-[11px] rounded transition-all uppercase tracking-wider cursor-pointer"
                  >
                    FECHAR
                  </button>
                </div>

              </motion.div>

            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL 3: CONFIRM DELETE WARNING --- */}
        <AnimatePresence>
          {toolToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="confirm-delete-modal">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-red-200 max-w-sm w-full rounded-lg overflow-hidden shadow-xl font-mono p-5 text-center space-y-4"
              >
                
                <AlertOctagon className="w-12 h-12 text-red-500 mx-auto animate-pulse" />

                <div className="space-y-1">
                  <h4 className="text-red-650 font-bold text-xs tracking-wider uppercase">REMOVER FERRAMENTA</h4>
                  <p className="text-[12.5px] text-slate-800 leading-relaxed font-sans">
                    Você tem certeza que deseja remover <strong>{toolToDelete.name}</strong> do seu painel radar?
                  </p>
                </div>

                <div className="text-[10px] text-red-700 bg-red-50 p-2.5 rounded border border-red-150 font-sans">
                  * Suas alterações locais para esta ferramenta serão perdidas. Você sempre poderá adicioná-la de volta do catálogo.
                </div>

                <div className="flex justify-center gap-3 text-[10px] font-mono">
                  <button
                    onClick={() => {
                      setToolToDelete(null);
                      playSonarSound();
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded cursor-pointer uppercase font-semibold"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer uppercase tracking-wide"
                  >
                    CONFIRMAR REMOÇÃO
                  </button>
                </div>

              </motion.div>

            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
