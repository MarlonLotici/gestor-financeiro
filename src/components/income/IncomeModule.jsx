import { useState } from 'react'
import {
  Briefcase, TrendingUp, Zap, Music,
  CheckCircle2, Clock, ChevronDown, ChevronUp,
} from 'lucide-react'
import { incomeCategories } from '../../data/mockData'
import { formatBRL, formatDate } from '../../utils/formatters'

// TODO: API Integration
// GET /api/income?month=2026-06
// POST /api/income { name, amount, category, date, received }
// PUT  /api/income/:id/mark-received

const ICONS = { Briefcase, TrendingUp, Zap, Music }

const PRIORITY_TAGS = {
  'Energia Solar': { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  'Software/SaaS': { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
}

function IncomeItem({ item }) {
  const tagStyle = PRIORITY_TAGS[item.tag]
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg group"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1a3050' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.received ? (
          <CheckCircle2 size={16} className="flex-shrink-0" style={{ color: '#34d399' }} />
        ) : (
          <Clock size={16} className="flex-shrink-0" style={{ color: '#fbbf24' }} />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
            {item.tag && (
              <span
                className="badge text-[10px]"
                style={{ color: tagStyle?.color, backgroundColor: tagStyle?.bg, border: `1px solid ${tagStyle?.color}30` }}
              >
                {item.tag}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {item.received
              ? `Recebido em ${formatDate(item.date)}`
              : `Previsto: ${formatDate(item.expectedDate)}`}
            {item.recurring && ' · Recorrente'}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-3">
        <p
          className="font-mono font-bold text-sm"
          style={{ color: item.received ? '#34d399' : '#fbbf24' }}
        >
          {formatBRL(item.amount)}
        </p>
        <span className={item.received ? 'badge badge-green text-[10px]' : 'badge badge-amber text-[10px]'}>
          {item.received ? 'Recebido' : 'Pendente'}
        </span>
      </div>
    </div>
  )
}

function CategoryCard({ category }) {
  const [open, setOpen] = useState(true)
  const Icon = ICONS[category.icon] ?? Zap

  const allItems = category.items ?? []
  const received = allItems.filter((i) => i.received).reduce((s, i) => s + i.amount, 0)
  const pending = allItems.filter((i) => !i.received).reduce((s, i) => s + i.amount, 0)
  const total = received + pending

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ borderBottom: open ? '1px solid #1a3050' : 'none' }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: category.bgColor }}
          >
            <Icon size={17} style={{ color: category.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{category.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {allItems.length} {allItems.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-sm font-bold" style={{ color: category.color }}>
              {formatBRL(received)}
            </p>
            {pending > 0 && (
              <p className="text-xs text-amber-400 font-medium">+{formatBRL(pending)} previsto</p>
            )}
          </div>
          {open ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </div>
      </button>

      {/* Items */}
      {open && (
        <div className="px-5 py-4 space-y-2">
          {allItems.map((item) => (
            <IncomeItem key={item.id} item={item} />
          ))}

          {/* Category subtotal */}
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-lg mt-1"
            style={{ backgroundColor: `${category.color}08`, border: `1px solid ${category.color}20` }}
          >
            <span className="text-xs font-semibold text-slate-400">Total {category.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Recebido: <span className="text-slate-300 font-semibold">{formatBRL(received)}</span>
              </span>
              <span className="text-xs text-slate-500">
                Total: <span className="font-mono font-bold" style={{ color: category.color }}>{formatBRL(total)}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function IncomeModule() {
  const totalReceived = incomeCategories
    .flatMap((c) => c.items ?? [])
    .filter((i) => i.received)
    .reduce((s, i) => s + i.amount, 0)

  const totalExpected = incomeCategories
    .flatMap((c) => c.items ?? [])
    .filter((i) => !i.received)
    .reduce((s, i) => s + i.amount, 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="section-title mb-1">Junho 2026</p>
          <h1 className="text-xl font-bold text-slate-100">Gestão de Receitas</h1>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2.5 text-center">
            <p className="section-title mb-0.5">Recebido</p>
            <p className="font-mono font-bold text-base text-emerald-400">{formatBRL(totalReceived)}</p>
          </div>
          <div className="card px-4 py-2.5 text-center">
            <p className="section-title mb-0.5">A Receber</p>
            <p className="font-mono font-bold text-base text-amber-400">{formatBRL(totalExpected)}</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {incomeCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* Grand Total */}
      <div
        className="card px-5 py-4 flex items-center justify-between"
        style={{ borderColor: '#22d3ee30' }}
      >
        <div>
          <p className="section-title mb-0.5">Total Geral do Mês</p>
          <p className="text-xs text-slate-500">Recebido + Previsto</p>
        </div>
        <div className="text-right">
          <p className="stat-number text-slate-100">{formatBRL(totalReceived + totalExpected)}</p>
          <p className="text-xs text-emerald-400 font-medium mt-0.5">
            {formatBRL(totalReceived)} confirmados
          </p>
        </div>
      </div>
    </div>
  )
}
