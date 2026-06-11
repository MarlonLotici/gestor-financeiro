import { useState } from 'react'
import { CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronUp, Repeat } from 'lucide-react'
import { expenseCategories } from '../../data/mockData'
import { formatBRL, formatDate } from '../../utils/formatters'

// TODO: API Integration
// GET /api/expenses?month=2026-06
// PUT /api/expenses/:id/mark-paid
// POST /api/expenses { name, amount, category, dueDate, recurring }

function ExpenseItem({ item }) {
  const isOverdue =
    !item.paid &&
    item.dueDate &&
    new Date(item.dueDate + 'T12:00:00') < new Date()

  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg"
      style={{
        backgroundColor: isOverdue ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isOverdue ? '#ef444430' : '#1a3050'}`,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.paid ? (
          <CheckCircle2 size={16} className="flex-shrink-0" style={{ color: '#34d399' }} />
        ) : isOverdue ? (
          <AlertCircle size={16} className="flex-shrink-0" style={{ color: '#ef4444' }} />
        ) : (
          <Circle size={16} className="flex-shrink-0 text-slate-600" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
            {item.recurring && (
              <Repeat size={11} className="flex-shrink-0 text-slate-600" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {item.paid
              ? 'Pago'
              : item.dueDate
              ? `Vencimento: ${formatDate(item.dueDate)}`
              : 'Custo variável'}
            {isOverdue && (
              <span className="text-red-400 font-medium ml-1.5">· Em atraso</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-3">
        <p
          className="font-mono font-bold text-sm"
          style={{ color: item.paid ? '#94a3b8' : isOverdue ? '#f87171' : '#e2e8f0' }}
        >
          {formatBRL(item.amount)}
        </p>
        <span
          className={`badge text-[10px] mt-0.5 ${
            item.paid ? 'badge-green' : isOverdue ? 'badge-red' : 'badge-amber'
          }`}
        >
          {item.paid ? 'Pago' : isOverdue ? 'Atrasado' : 'Pendente'}
        </span>
      </div>
    </div>
  )
}

function CategorySection({ category }) {
  const [open, setOpen] = useState(true)
  const paid = category.items.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0)
  const pending = category.items.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0)
  const total = paid + pending

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ borderBottom: open ? '1px solid #1a3050' : 'none' }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <p className="text-sm font-semibold text-slate-200">{category.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {category.items.filter((i) => i.paid).length}/{category.items.length} pagos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-sm font-bold text-slate-200">{formatBRL(total)}</p>
            {pending > 0 && (
              <p className="text-xs text-amber-400">{formatBRL(pending)} pendente</p>
            )}
          </div>
          {open ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 py-4 space-y-2">
          {category.items.map((item) => (
            <ExpenseItem key={item.id} item={item} />
          ))}

          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-lg mt-1"
            style={{ backgroundColor: `${category.color}08`, border: `1px solid ${category.color}20` }}
          >
            <span className="text-xs font-semibold text-slate-400">Total {category.label}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                Pago: <span className="text-slate-300 font-semibold">{formatBRL(paid)}</span>
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

export default function ExpensesModule() {
  const allItems = expenseCategories.flatMap((c) => c.items)
  const totalPaid = allItems.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0)
  const totalPending = allItems.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-title mb-1">Junho 2026</p>
          <h1 className="text-xl font-bold text-slate-100">Gestão de Despesas</h1>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2.5 text-center">
            <p className="section-title mb-0.5">Pago</p>
            <p className="font-mono font-bold text-base text-slate-200">{formatBRL(totalPaid)}</p>
          </div>
          <div className="card px-4 py-2.5 text-center">
            <p className="section-title mb-0.5">Pendente</p>
            <p className="font-mono font-bold text-base text-amber-400">{formatBRL(totalPending)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {expenseCategories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>

      <div
        className="card px-5 py-4 flex items-center justify-between"
        style={{ borderColor: '#ef444430' }}
      >
        <div>
          <p className="section-title mb-0.5">Total de Despesas</p>
          <p className="text-xs text-slate-500">Pagas + Pendentes</p>
        </div>
        <div className="text-right">
          <p className="stat-number text-slate-100">{formatBRL(totalPaid + totalPending)}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {formatBRL(totalPaid)} já pagos
          </p>
        </div>
      </div>
    </div>
  )
}
