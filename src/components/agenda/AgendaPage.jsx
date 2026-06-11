import { useState, useEffect, useCallback } from 'react'
import {
  Clock, TrendingUp, Calendar, CheckCircle2,
  AlertCircle, RefreshCw, PartyPopper,
} from 'lucide-react'
import { formatBRL, formatDateFull } from '../../utils/formatters'
import { categoryLabel, categoryColor } from '../../utils/categories'
import { API_URL } from '../../utils/api'

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T12:00:00')
  return Math.round((due - today) / 86400000)
}

function DaysBadge({ days }) {
  let color, bg, border, text

  if (days < 0) {
    color = '#ef4444'; bg = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.3)'
    text = `${Math.abs(days)}d atrasado`
  } else if (days === 0) {
    color = '#ef4444'; bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.35)'
    text = 'Vence Hoje!'
  } else if (days <= 3) {
    color = '#f97316'; bg = 'rgba(249,115,22,0.12)'; border = 'rgba(249,115,22,0.3)'
    text = `em ${days}d`
  } else if (days <= 7) {
    color = '#fbbf24'; bg = 'rgba(251,191,36,0.12)'; border = 'rgba(251,191,36,0.25)'
    text = `em ${days}d`
  } else {
    color = '#22d3ee'; bg = 'rgba(34,211,238,0.08)'; border = 'rgba(34,211,238,0.2)'
    text = `em ${days}d`
  }

  return (
    <span className="badge" style={{ color, backgroundColor: bg, border: `1px solid ${border}`, fontSize: '10px' }}>
      {text}
    </span>
  )
}

// ----------------------------------------------------------------
// Card de despesa pendente (coluna esquerda)
// ----------------------------------------------------------------
function ExpenseCard({ item, onMarkPaid }) {
  const [busy, setBusy] = useState(false)
  const days     = daysUntil(item.due_date)
  const catColor = categoryColor(item.category)
  const isUrgent = days <= 3

  const handleClick = async () => {
    setBusy(true)
    await onMarkPaid(item.id, 'pago')
    // Se der erro, onMarkPaid não remove o item; o setBusy(false) não precisa ser chamado
    // pois o componente desmonta ao ser removido da lista
  }

  return (
    <div
      className="card card-hover p-4 flex flex-col gap-3"
      style={{ borderLeft: `3px solid ${isUrgent ? '#ef4444' : days <= 7 ? '#f97316' : '#1a3050'}` }}
    >
      {/* Header do card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="badge"
              style={{
                color: catColor,
                backgroundColor: `${catColor}18`,
                border: `1px solid ${catColor}30`,
                fontSize: '10px',
              }}
            >
              {categoryLabel(item.category)}
            </span>
            <DaysBadge days={days} />
          </div>
          {item.description && (
            <p className="text-sm font-medium text-slate-200 truncate">{item.description}</p>
          )}
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Calendar size={11} />
            Vence em {formatDateFull(item.due_date)}
          </p>
        </div>
        <p className="font-mono font-bold text-sm text-red-400 whitespace-nowrap flex-shrink-0">
          {formatBRL(item.amount)}
        </p>
      </div>

      {/* Botão de ação */}
      <button
        onClick={handleClick}
        disabled={busy}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95"
        style={{
          backgroundColor: busy ? '#0a1525' : 'rgba(52,211,153,0.08)',
          color: busy ? '#475569' : '#34d399',
          border: `1px solid ${busy ? '#1a3050' : 'rgba(52,211,153,0.25)'}`,
          cursor: busy ? 'not-allowed' : 'pointer',
        }}
      >
        <CheckCircle2 size={13} />
        {busy ? 'Salvando...' : 'Marcar como Pago'}
      </button>
    </div>
  )
}

// ----------------------------------------------------------------
// Card de entrada prevista (coluna direita)
// ----------------------------------------------------------------
function IncomeCard({ item }) {
  const days     = daysUntil(item.due_date)
  const catColor = categoryColor(item.category)

  return (
    <div
      className="card card-hover p-4 flex flex-col gap-2"
      style={{ borderLeft: `3px solid ${catColor}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="badge"
              style={{
                color: catColor,
                backgroundColor: `${catColor}18`,
                border: `1px solid ${catColor}30`,
                fontSize: '10px',
              }}
            >
              {categoryLabel(item.category)}
            </span>
            <DaysBadge days={days} />
          </div>
          {item.description && (
            <p className="text-sm font-medium text-slate-200 truncate">{item.description}</p>
          )}
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Calendar size={11} />
            Previsto para {formatDateFull(item.due_date)}
          </p>
        </div>
        <p className="font-mono font-bold text-sm whitespace-nowrap flex-shrink-0" style={{ color: catColor }}>
          {formatBRL(item.amount)}
        </p>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Estado vazio das colunas
// ----------------------------------------------------------------
function EmptyState({ icon: Icon, iconColor, message }) {
  return (
    <div
      className="card flex flex-col items-center justify-center gap-3 text-center"
      style={{ minHeight: '180px' }}
    >
      <Icon size={26} style={{ color: iconColor ?? '#1e3a5f' }} />
      <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">{message}</p>
    </div>
  )
}

// ----------------------------------------------------------------
// Skeleton de loading
// ----------------------------------------------------------------
function Skeleton() {
  const block = (h) => ({
    height: h,
    backgroundColor: '#0d1f3c',
    borderRadius: '12px',
    animation: 'pulse 2s infinite',
  })
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[0, 1].map(col => (
        <div key={col} className="flex flex-col gap-3">
          <div style={block('28px')} />
          {[...Array(3)].map((_, i) => <div key={i} style={block('110px')} />)}
        </div>
      ))}
    </div>
  )
}

// ================================================================
// PÁGINA PRINCIPAL
// ================================================================
export default function AgendaPage() {
  const [saidas,   setSaidas]   = useState([])
  const [entradas, setEntradas] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetch(`${API_URL}/api/agenda`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => {
        setSaidas(d.fluxoFuturoSaidas ?? [])
        setEntradas(d.fluxoFuturoEntradas ?? [])
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  // Remove o item da lista localmente após marcar como pago
  const handleMarkPaid = useCallback(async (id, status) => {
    const res = await fetch(`${API_URL}/api/transactions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setSaidas(prev => prev.filter(t => t.id !== id))
  }, [])

  const totalSaidas   = saidas.reduce((s, t) => s + parseFloat(t.amount), 0)
  const totalEntradas = entradas.reduce((s, t) => s + parseFloat(t.amount), 0)

  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle size={24} style={{ color: '#ef4444' }} />
        <p className="text-sm text-slate-400">Erro ao carregar agenda. A API está rodando?</p>
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <RefreshCw size={13} /> Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho da página */}
      <div>
        <p className="section-title mb-1">Visão Futura</p>
        <h1 className="text-xl font-bold text-slate-100">Agenda &amp; Previsões</h1>
      </div>

      {/* Cards de totais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(248,113,113,0.1)' }}
          >
            <Clock size={17} style={{ color: '#f87171' }} />
          </div>
          <div>
            <p className="section-title mb-0.5">A Pagar</p>
            <p className="font-mono font-bold text-lg" style={{ color: '#f87171' }}>{formatBRL(totalSaidas)}</p>
            <p className="text-xs text-slate-600">{saidas.length} conta{saidas.length !== 1 ? 's' : ''} pendente{saidas.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(52,211,153,0.1)' }}
          >
            <TrendingUp size={17} style={{ color: '#34d399' }} />
          </div>
          <div>
            <p className="section-title mb-0.5">A Receber</p>
            <p className="font-mono font-bold text-lg" style={{ color: '#34d399' }}>{formatBRL(totalEntradas)}</p>
            <p className="text-xs text-slate-600">{entradas.length} entrada{entradas.length !== 1 ? 's' : ''} prevista{entradas.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Layout dividido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Coluna esquerda — Contas a Vencer */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} style={{ color: '#f87171' }} />
              <h2 className="text-sm font-semibold text-slate-200">Contas a Vencer</h2>
            </div>
            {saidas.length > 0 && (
              <span className="badge badge-red">{saidas.length} pendente{saidas.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {saidas.length === 0 ? (
            <EmptyState
              icon={PartyPopper}
              iconColor="#34d399"
              message="Nenhuma conta pendente. Tudo em dia! ✓"
            />
          ) : (
            saidas.map(item => (
              <ExpenseCard key={item.id} item={item} onMarkPaid={handleMarkPaid} />
            ))
          )}
        </div>

        {/* Coluna direita — Previsão de Entradas */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} style={{ color: '#34d399' }} />
              <h2 className="text-sm font-semibold text-slate-200">Previsão de Entradas</h2>
            </div>
            {entradas.length > 0 && (
              <span className="badge badge-green">{entradas.length} prevista{entradas.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {entradas.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              iconColor="#1e3a5f"
              message="Nenhuma receita prevista. Use !fin receita [valor] [cat] [DD/MM] para agendar."
            />
          ) : (
            entradas.map(item => (
              <IncomeCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
