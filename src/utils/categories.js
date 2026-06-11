// Metadados de categorias — fonte única de verdade para labels e cores no frontend
// Espelha CATEGORY_ALIASES definido em api/server.js

export const CATEGORY_META = {
  // ── Receitas ──────────────────────────────────────────────────
  reino_fixo:          { label: 'Reino Fixo',           color: '#22d3ee' },
  reino_comissao:      { label: 'Reino — Comissão',      color: '#a78bfa' },
  solar:               { label: 'Energia Solar',         color: '#34d399' },
  software:            { label: 'Software / SaaS',       color: '#6366f1' },
  musica:              { label: 'Música / Shows',        color: '#fb923c' },
  outros_receita:      { label: 'Outros (Receita)',      color: '#64748b' },
  // ── Despesas ──────────────────────────────────────────────────
  aluguel:             { label: 'Aluguel',               color: '#f87171' },
  carro:               { label: 'Carro / Combustível',   color: '#fbbf24' },
  contas:              { label: 'Contas (luz/cel/net)',  color: '#60a5fa' },
  cartao:              { label: 'Cartão de Crédito',     color: '#c084fc' },
  divida:              { label: 'Dívida / Empréstimo',   color: '#ef4444' },
  estilo_vida:         { label: 'Estilo de Vida',        color: '#4ade80' },
  reserva:             { label: 'Reserva de Emergência', color: '#38bdf8' },
  outros_despesa:      { label: 'Outros (Despesa)',      color: '#64748b' },
  // ── Investimentos ─────────────────────────────────────────────
  acoes:               { label: 'Ações / FIIs',          color: '#34d399' },
  cripto:              { label: 'Cripto',                color: '#f59e0b' },
  outros_investimento: { label: 'Outros (Investimento)', color: '#64748b' },
}

export const categoryLabel = (key) => CATEGORY_META[key]?.label ?? key
export const categoryColor = (key) => CATEGORY_META[key]?.color ?? '#64748b'
