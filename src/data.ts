import { ToolSignal, TechNews, Category } from './types';

export const CATEGORIES: Category[] = [
  { key: 'AI_ASSISTANTS', label: 'Assistentes de IA', iconName: 'Bot' },
  { key: 'API_ENDPOINTS', label: 'APIs & Endpoints', iconName: 'Cpu' },
  { key: 'FRAMEWORKS', label: 'Frameworks & Libs', iconName: 'Terminal' },
  { key: 'SECURITY_HQ', label: 'Segurança & Acessos', iconName: 'Shield' },
  { key: 'DATABASES_DEV', label: 'Bancos de Dados', iconName: 'Database' }
];

export const INITIAL_ATTACHED_TOOLS: ToolSignal[] = [
  {
    id: 'openai-api',
    name: 'OpenAI API',
    iconType: 'lucide',
    iconName: 'Cpu',
    category: 'AI_ASSISTANTS',
    version: 'v4.2.0',
    status: 'HIGH_IMPACT',
    lastUpdated: 'Hoje, 10:45',
    summary: 'Limite de requisições por minuto (RPM) duplicado no Tier 4.',
    changes: [
      'RPM aumentou de 5.000 para 10.000 no Tier 4.',
      'TTFT 15% mais rápido no GPT-4o.',
      'Melhorias no suporte a áudio nativo.'
    ],
    predictions: [
      'Lançamento iminente do GPT-4.5.',
      'Redução de preços para tokens de entrada.'
    ],
    weakSignals: [
      'Relatos de instabilidade leve no WebSocket às 15h.',
      'Ajustes silenciosos de moderação de termos.'
    ],
    securityAlerts: [
      'Nenhum alerta crítico. Troque as chaves a cada 90 dias.'
    ],
    unread: true
  },
  {
    id: 'langchain',
    name: 'LangChain',
    iconType: 'lucide',
    iconName: 'Terminal',
    category: 'FRAMEWORKS',
    version: 'v0.3.18',
    status: 'STABLE',
    lastUpdated: 'Ontem, 16:30',
    summary: 'Otimização de memória para agentes recorrentes e carregamento rápido.',
    changes: [
      'Nova API simples para memória persistente.',
      'Tempo de importação 22% menor em serverless.',
      'Logs automáticos no LangSmith.'
    ],
    predictions: [
      'Remoção de warnings antigos de deprecation.',
      'Integração nativa com novos modelos Locais.'
    ],
    weakSignals: [
      'Warnings incômodos ao usar versões antigas do Python.',
      'Leve pico de RAM com mais de 5 agentes em loop.'
    ],
    securityAlerts: [
      'Correção de segurança para input não higienizado no executor local.'
    ],
    unread: true
  },
  {
    id: 'cursor-ide',
    name: 'Cursor IDE',
    iconType: 'lucide',
    iconName: 'Code',
    category: 'DATABASES_DEV',
    version: 'v0.46.2',
    status: 'BETA',
    lastUpdated: 'Há 3 dias',
    summary: 'Modo Agente multi-arquivos ativo para edição simultânea.',
    changes: [
      'Agente pode alterar múltiplos arquivos simultaneamente.',
      'Busca semântica local otimizada para repositórios grandes.',
      'Novo painel de contagem de tokens usados.'
    ],
    predictions: [
      'Geração de código em background com modelos locais.',
      'Execução segura de comandos sugeridos no terminal.'
    ],
    weakSignals: [
      'Uso alto de CPU ao indexar repositórios gigantes.',
      'Incompatibilidade pontual com HMR de Svelte.'
    ],
    securityAlerts: [
      'Configure seu .cursorrules para não enviar chaves privadas de segredo.'
    ],
    unread: false
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    iconType: 'lucide',
    iconName: 'Globe',
    category: 'FRAMEWORKS',
    version: 'v15.2.0-rc',
    status: 'BETA',
    lastUpdated: 'Há 5 dias',
    summary: 'Turbopack integrado para builds locais rápidos.',
    changes: [
      'Turbopack atinge 99% de compatibilidade web.',
      'Suporte a Partial Prerendering (PPR) por rota.',
      'Novo mecanismo automático de cache de requisições.'
    ],
    predictions: [
      'Lançamento estável nas próximas semanas.',
      'Server Actions como padrão sugerido para rotas de formulário.'
    ],
    weakSignals: [
      'Discussões sobre vazamento de memória em rotas dinâmicas.',
      'Conflitos ao definir headers de CORS complexos.'
    ],
    securityAlerts: [
      'Correção de segurança na injeção de parâmetros de redirecionamento (afeta <v15.1.0).'
    ],
    unread: false
  }
];

export const CATALOG_PRESET_ITEMS: ToolSignal[] = [
  {
    id: 'huggingface',
    name: 'Hugging Face',
    iconType: 'emoji',
    iconName: '🤗',
    category: 'AI_ASSISTANTS',
    version: 'v0.28.0',
    status: 'STABLE',
    lastUpdated: 'Há 2 dias',
    summary: 'Deploy simplificado do Llama 3 no Spaces com um clique.',
    changes: [
      'Interface visual de deploy rápido para instâncias acessíveis.',
      'Compressão de modelos pesados para download local acelerado.'
    ],
    predictions: [
      'Execução local de modelos leves via WebGPU no navegador.'
    ],
    weakSignals: [
      'Dúvidas sobre limites de banda nos planos gratuitos.'
    ],
    securityAlerts: [
      'Ativação de varreduras contra arquivos nocivos via Safetensors.'
    ],
    unread: true
  },
  {
    id: 'supabase',
    name: 'Supabase',
    iconType: 'emoji',
    iconName: '⚡',
    category: 'DATABASES_DEV',
    version: 'v2.45.0',
    status: 'STABLE',
    lastUpdated: 'Há 1 dia',
    summary: 'Melhorias de desempenho no PGVector para buscas semânticas.',
    changes: [
      'Indexação de vetores 3x mais rápida.',
      'Webhooks integrados para monitorar múltiplas tabelas.'
    ],
    predictions: [
      'Ambiente PostgreSQL offline simplificado rodando via WASM.'
    ],
    weakSignals: [
      'Instabilidades na reconexão de sockets em redes móveis.'
    ],
    securityAlerts: [
      'Atenção: A chave service_role nunca deve ser exposta no frontend.'
    ],
    unread: true
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    iconType: 'emoji',
    iconName: '🎨',
    category: 'AI_ASSISTANTS',
    version: 'v6.2',
    status: 'HIGH_IMPACT',
    lastUpdated: 'Há 6 dias',
    summary: 'Novo editor web nativo substituindo o uso do Discord.',
    changes: [
      'Ferramentas de Inpainting e Outpainting direto no navegador.',
      'Fidelidade aprimorada para criação de textos e logotipos.'
    ],
    predictions: [
      'Suporte a modelos de geração de animações 3D curtas.'
    ],
    weakSignals: [
      'Fila de processamento lenta em horários de pico comercial.'
    ],
    securityAlerts: [],
    unread: false
  },
  {
    id: 'vercel',
    name: 'Vercel CLI',
    iconType: 'emoji',
    iconName: '▲',
    category: 'API_ENDPOINTS',
    version: 'v39.1.5',
    status: 'STABLE',
    lastUpdated: 'Ontem',
    summary: 'Medição de performance em tempo real no console local.',
    changes: [
      'Pre-build avisa sobre rotas dinâmicas quebradas antes do deploy.',
      'Suporte a monorepos muito grandes aprimorado.'
    ],
    predictions: [
      'Deploy instantâneo sem delay de cold-start para Rust.'
    ],
    weakSignals: [
      'Erros estéticos de alinhamento com algumas fontes mono.'
    ],
    securityAlerts: [],
    unread: false
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    iconType: 'emoji',
    iconName: '🌀',
    category: 'AI_ASSISTANTS',
    version: 'v3.5-Medium',
    status: 'STABLE',
    lastUpdated: 'Há 4 dias',
    summary: 'Modelo ajustado para GPUs de consumo geral (8GB VRAM).',
    changes: [
      'Correções em distorções físicas de mãos e rostos.',
      'Geração 20% mais rápida usando TensorRT.'
    ],
    predictions: [
      'Lançamento de pack especializado em renderizações realistas.'
    ],
    weakSignals: [
      'Fidelidade de colares variável com certos agendadores Euler.'
    ],
    securityAlerts: [
      'Baixe apenas modelos compactos ou seguros no formato .safetensors.'
    ],
    unread: true
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    iconType: 'emoji',
    iconName: '📘',
    category: 'FRAMEWORKS',
    version: 'v5.9.1',
    status: 'STABLE',
    lastUpdated: 'Há 10 dias',
    summary: 'Compilação mais rápida e checagem de tipos otimizada.',
    changes: [
      'Checagem de tipos complexos 15% mais rápida.',
      'Mensagens de erro mais diretas e compreensíveis no VS Code.'
    ],
    predictions: [
      'Novos utilitários de tipo para JSON dinâmico.'
    ],
    weakSignals: [
      'Rigidez excessiva em linters antigos mudando para strict.'
    ],
    securityAlerts: [],
    unread: false
  },
  {
    id: 'docker',
    name: 'Docker Engine',
    iconType: 'emoji',
    iconName: '🐳',
    category: 'SECURITY_HQ',
    version: 'v27.4.0',
    status: 'STABLE',
    lastUpdated: 'Há 8 dias',
    summary: 'Rápida inicialização de contêineres e segurança extra isolada.',
    changes: [
      'Cache de camadas em paralelo acelera o tempo de carga.',
      'Segurança de isolamento do daemon Linux robustecida.'
    ],
    predictions: [
      'Rodar bundles de WebAssembly diretamente do CLI tradicional.'
    ],
    weakSignals: [
      'Consumo elevado de bateria no Docker Desktop para macOS.'
    ],
    securityAlerts: [
      'Correção importante relacionada a privilégios em namespaces.'
    ],
    unread: false
  },
  {
    id: 'auth0',
    name: 'Auth0 Auth',
    iconType: 'emoji',
    iconName: '🔒',
    category: 'SECURITY_HQ',
    version: 'v3.7.1',
    status: 'CRITICAL',
    lastUpdated: 'Há 2 dias',
    summary: 'Patch de segurança crítico contra brecha de fluxo OAuth.',
    changes: [
      'Correção urgente do fluxo PKCE contra desvios de redirecionamento.',
      'Validação de tokens JWT otimizada em rotas protegidas.'
    ],
    predictions: [
      'Adoção de Passkeys como padrão de segurança para todos os logins.'
    ],
    weakSignals: [
      'Usuários relatando problemas de CORS ao usar Cloudflare Workers.'
    ],
    securityAlerts: [
      'ALERT: Atualize suas dependências locais para evitar sequestro de seção!'
    ],
    unread: true
  }
];

export const INITIAL_NEWS: TechNews[] = [
  {
    id: 'news-1',
    title: 'OpenAI lança GPT-4.5 com raciocínio focado e mais velocidade',
    summary: 'Disponível inicialmente para planos empresariais, modelo promete respostas 30% mais rápidas e custos reduzidos de tokens pela metade.',
    body: 'A OpenAI divulgou o GPT-4.5. O modelo traz melhorias no tempo de reposta inicial (TTFT) e suporte aprimorado para áudio multilingue integrado. Para desenvolvedores, o benefício principal é a redução no preço por token gerado, facilitando a adoção em larga escala em APIs de produção de produtos compactos.',
    source: 'Canal de Novidades da OpenAI',
    date: 'Hoje, 09:30',
    importance: 'HIGH',
    category: 'IA'
  },
  {
    id: 'news-2',
    title: 'React Compiler v19 traz otimização automática de build como padrão',
    summary: 'Adeus ao useMemo e useCallback manuais. Novo compilador reorganiza dependências diretamente no build final para melhor performance.',
    body: 'O React v19 foca na automatização do cache. Com o React Compiler ativo por padrão, o desenvolvedor não precisa mais gerenciar hooks de performance complexos. Testes em aparelhos mobile apontam melhorias de fluidez visual de até 40% em conexões moderadas.',
    source: 'Blog Oficial do React Team',
    date: 'Ontem, 12:15',
    importance: 'MEDIUM',
    category: 'Frameworks'
  },
  {
    id: 'news-3',
    title: 'Vazamento de credenciais no GitHub afeta milhares de repositórios',
    summary: 'Detectores automatizados identificaram chaves de nuvem pública vazadas. Especialistas recomendam rotação imediata de chaves.',
    body: 'Provedores de nuvem emitiram comunicados após registrarem acessos indevidos por chaves expostas em commits sem criptografia. Recomenda-se rodar auditores locais de segredo antes de realizar pushes, garantindo a integridade dos feeds operacionais de produção.',
    source: 'Security Reports Internacional',
    date: 'Há 2 dias',
    importance: 'HIGH',
    category: 'Segurança'
  }
];
