import { Flame, CreditCard, Landmark, CalendarDays, Percent, Target } from 'lucide-react'
import { debtsData } from '../../data/mockData'
import { formatBRL, formatDate, calcPercent } from '../../utils/formatters'

// TODO: API Integration
// GET /api/debts
// POST /api/debts/payment { debtId, amount, date }

const PRIORITY_CONFIG = {
  critical: {
    label: 'Crítico',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    barColor: 'linear-gradient(90deg,#ef4444,#f87171)',
    order: 0,
  },
  high: {
    label: 'Alta',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    barColor: 'linear-gradient(90deg,#f97316,#fb923c)',
    order: 1,
  },
  medium: {
    label: 'Média',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
    barColor: 'linear-gradient(90deg,#f59e0b,#fbbf24)',
    order: 2,
  },
  low: {
    label: 'Baixa',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    barColor: 'linear-gradient(90deg,#10b981,#34d399)',
    order: 3,
  },
}

const STRATEGY_TIPS = {
  critical: 'Cartão de crédito — Juros altíssimos. Prioridade máxima: quite o saldo total primeiro.',
  high: 'Empréstimo pessoal — Juros moderados. Aporte extra acelera a quitação.',
  medium: 'Segundo cartão — Quite logo após o cartão crítico para liberar fluxo de caixa.',
  low: 'Financiamento produtivo — Gera renda. Pode manter o ritmo normal de parcelas.',
}

function DebtCard({ debt, rank }) {
  const cfg = PRIORITY_CONFIG[debt.priority]
  const paidAmount = debt.totalAmount - debt.remainingAmount
  const paidPct = calcPercent(paidAmount, debt.totalAmount)
  const isCard = debt.type === 'credit_card'

  return (
    <div
      className="card card-hover p-5 flex flex-col gap-4"
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Rank badge */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isCard ? (
                <CreditCard size={14} style={{ color: cfg.color }} />
              ) : (
                <Landmark size={14} style={{ color: cfg.color }} />
              )}
              <p className="text-sm font-semibold text-slate-200">{debt.name}</p>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{debt.institution}</p>
          </div>
        </div>
        <span
          className="badge flex-shrink-0"
          style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Strategy tip */}
      <div
        className="px-3 py-2 rounded-lg text-xs text-slate-400 leading-relaxed"
        style={{ backgroundColor: '#0a1525', border: '1px solid #1a3050' }}
      >
        <span style={{ color: cfg.color }}>▸ </span>
        {STRATEGY_TIPS[debt.priority]}
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Pago: <span className="text-slate-300 font-semibold">{formatBRL(paidAmount)}</span>
          </span>
          <span className="font-bold" style={{ color: cfg.color }}>{paidPct}% quitado</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${paidPct}%`, background: cfg.barColor }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Dívida total: {formatBRL(debt.totalAmount)}</span>
          <span className="text-red-400 font-semibold">Restam: {formatBRL(debt.remainingAmount)}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className="flex flex-col items-center py-2.5 rounded-lg"
          style={{ backgroundColor: '#0a1525', border: '1px solid #1a3050' }}
        >
          <Target size={13} className="text-slate-600 mb-1" />
          <p className="font-mono text-xs font-bold text-slate-200">{formatBRL(debt.monthlyPayment)}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Parcela</p>
        </div>
        <div
          className="flex flex-col items-center py-2.5 rounded-lg"
          style={{ backgroundColor: '#0a1525', border: '1px solid #1a3050' }}
        >
          <Percent size={13} className="text-slate-600 mb-1" />
          <p className="font-mono text-xs font-bold" style={{ color: cfg.color }}>
            {debt.interestRate}% a.m.
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">Juros</p>
        </div>
        <div
          className="flex flex-col items-center py-2.5 rounded-lg"
          style={{ backgroundColor: '#0a1525', border: '1px solid #1a3050' }}
        >
          <CalendarDays size={13} className="text-slate-600 mb-1" />
          <p className="font-mono text-xs font-bold text-slate-200">{formatDate(debt.nextDueDate)}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Vencimento</p>
        </div>
      </div>

      {/* Installments (loans only) */}
      {debt.remainingInstallments && (
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-600">
            Parcelas restantes: <span className="text-slate-400 font-semibold">{debt.remainingInstallments}</span>
          </span>
          <span className="text-slate-600">
            de <span className="text-slate-400 font-semibold">{debt.totalInstallments}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default function DebtDetonator() {
  const sorted = [...debtsData].sort(
    (a, b) => PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order,
  )

  const totalDebt = debtsData.reduce((s, d) => s + d.remainingAmount, 0)
  const totalMonthly = debtsData.reduce((s, d) => s + d.monthlyPayment, 0)
  const highestRate = [...debtsData].sort((a, b) => b.interestRate - a.interestRate)[0]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="section-title mb-1">Gestão de Passivos</p>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Flame size={20} style={{ color: '#ef4444' }} />
            Detonador de Dívidas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Estratégia: Bola de Neve — do maior juro ao menor
          </p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="section-title mb-1.5">Dívida Total</p>
          <p className="stat-number text-red-400">{formatBRL(totalDebt)}</p>
          <p className="text-xs text-slate-600 mt-1">{debtsData.length} passivos ativos</p>
        </div>
        <div className="card p-4 text-center">
          <p className="section-title mb-1.5">Comprometimento Mensal</p>
          <p className="stat-number text-amber-400">{formatBRL(totalMonthly)}</p>
          <p className="text-xs text-slate-600 mt-1">em parcelas/mês</p>
        </div>
        <div className="card p-4 text-center">
          <p className="section-title mb-1.5">Maior Juros</p>
          <p className="stat-number text-red-500">{highestRate.interestRate}% a.m.</p>
          <p className="text-xs text-slate-600 mt-1 truncate">{highestRate.name}</p>
        </div>
      </div>

      {/* Priority queue */}
      <div>
        <p className="section-title mb-3 px-1">Fila de Quitação (por prioridade)</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((debt, idx) => (
            <DebtCard key={debt.id} debt={debt} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* Alert footer */}
      <div
        className="card px-5 py-4 flex items-start gap-3"
        style={{ borderColor: '#ef444430', backgroundColor: 'rgba(239,68,68,0.04)' }}
      >
        <Flame size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <div>
          <p className="text-sm font-semibold text-slate-200 mb-1">Plano de Ataque Recomendado</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Quite o <strong style={{ color: '#c026d3' }}>Cartão Nubank</strong> primeiro (juros 8,5% a.m.).
            Após quitado, redirecione os{' '}
            <strong style={{ color: '#ef4444' }}>{formatBRL(400)}/mês</strong> para o empréstimo pessoal.
            O financiamento solar pode seguir o ritmo normal pois gera retorno produtivo.
          </p>
        </div>
      </div>
    </div>
  )
}
