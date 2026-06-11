import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, ArrowUpRight, AlertCircle, RefreshCw, Layers } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatBRL, formatDateFull, calcPercent } from '../../utils/formatters'
import { categoryLabel, categoryColor } from '../../utils/categories'
import { API_URL } from '../../utils/api'

// Paleta fallback para categorias sem cor definida
const PALETTE = ['#34d399', '#f59e0b', '#6366f1', '#fb923c', '#22d3ee', '#a78bfa']
const colorFor = (key, index) => categoryColor(key) !== '#64748b' ? categoryColor(key) : PALETTE[index % PALETTE.length]

// ----------------------------------------------------------------
// Tooltip customizado do gráfico de rosca
// ----------------------------------------------------------------
const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  const color = colorFor(name, 0)
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-sm shadow-xl"
      style={{ backgroundColor: '#0a1525', border: '1px solid #1e3a5f' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-slate-200">{categoryLabel(name)}</span>
      </div>
      <p className="font-mono font-bold text-base" style={{ color }}>{formatBRL(value)}</p>
      <p className="text-xs text-slate-500">{calcPercent(value, total)}% do portfólio</p>
    </div>
  )
}

// ----------------------------------------------------------------
// Gráfico de alocação (rosca)
// ----------------------------------------------------------------
function AllocationChart({ allocation, total }) {
  const colored = allocation.map((item, i) => ({ ...item, color: colorFor(item.name, i) }))

  if (!colored.length) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <p className="text-xs text-slate-500">Nenhum investimento registrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Alocação do Portfólio</h2>
        <p className="text-xs text-slate-500 mt-0.5">Distribuição por classe de ativo</p>
      </div>

      <div className="flex flex-col items-center">
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colored}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {colored.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} fillOpacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Label central */}
        <div className="-mt-[116px] mb-[64px] flex flex-col items-center pointer-events-none">
          <p className="text-xs text-slate-500 font-medium">Portfólio</p>
          <p className="font-mono text-lg font-bold text-slate-100">{formatBRL(total)}</p>
        </div>
      </div>

      {/* Legenda */}
      <div className="space-y-2">
        {colored.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-400 truncate">{categoryLabel(item.name)}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-xs font-mono font-semibold text-slate-200">{formatBRL(item.value)}</span>
              <span className="text-xs font-medium w-9 text-right" style={{ color: item.color }}>
                {calcPercent(item.value, total)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Tabela de histórico de aportes
// ----------------------------------------------------------------
function HistoryTable({ history }) {
  if (!history.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-xs text-slate-500">Nenhum aporte registrado.</p>
        <p className="text-xs text-slate-600 mt-1">
          Use: <code className="font-mono">!fin investimento 1000 cripto Compra BTC</code>
        </p>
      </div>
    )
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Histórico de Aportes</h2>
          <p className="text-xs text-slate-500 mt-0.5">{history.length} registro{history.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #1a3050' }}>
              {['Data', 'Descrição / Ativo', 'Classe', 'Valor'].map(h => (
                <th key={h} className="pb-2.5 text-left section-title px-1 first:pl-0 last:text-right">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((tx) => {
              const catColor = colorFor(tx.category, 0)
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid #0f1e35' }}
                >
                  <td className="py-2.5 px-1 first:pl-0 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateFull(tx.date)}
                  </td>
                  <td className="py-2.5 px-1 text-sm text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${catColor}18` }}
                      >
                        <ArrowUpRight size={11} style={{ color: catColor }} />
                      </span>
                      <span className="truncate max-w-[200px]">
                        {tx.description || categoryLabel(tx.category)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-1 text-xs">
                    <span
                      className="badge"
                      style={{
                        color: catColor,
                        backgroundColor: `${catColor}18`,
                        border: `1px solid ${catColor}30`,
                        fontSize: '10px',
                      }}
                    >
                      {categoryLabel(tx.category)}
                    </span>
                  </td>
                  <td className="py-2.5 px-1 text-right text-sm font-mono font-semibold whitespace-nowrap">
                    <span style={{ color: catColor }}>+{formatBRL(tx.amount)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Skeleton de loading
// ----------------------------------------------------------------
function Skeleton() {
  const b = (h) => ({ height: h, backgroundColor: '#0d1f3c', borderRadius: '12px', animation: 'pulse 2s infinite' })
  return (
    <div className="flex flex-col gap-5">
      <div style={b('96px')} />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2" style={b('320px')} />
        <div className="xl:col-span-3" style={b('320px')} />
      </div>
    </div>
  )
}

// ================================================================
// PÁGINA PRINCIPAL
// ================================================================
export default function InvestmentsPage() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetch(`${API_URL}/api/investments`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle size={24} style={{ color: '#ef4444' }} />
        <p className="text-sm text-slate-400">Erro ao carregar investimentos.</p>
        <button onClick={load} className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300">
          <RefreshCw size={13} /> Tentar novamente
        </button>
      </div>
    )
  }

  const { total, allocation, history } = data

  return (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho */}
      <div>
        <p className="section-title mb-1">Patrimônio</p>
        <h1 className="text-xl font-bold text-slate-100">Investimentos</h1>
      </div>

      {/* Card de destaque — Valor Investido Total */}
      <div
        className="card p-6 flex items-center gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(99,102,241,0.06))', borderColor: 'rgba(52,211,153,0.2)' }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #34d399, #6366f1)' }}
        >
          <TrendingUp size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-title mb-1">Patrimônio Investido Total</p>
          <p className="stat-number" style={{ color: '#34d399', fontSize: '2rem' }}>
            {formatBRL(total)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Soma histórica de todos os aportes registrados
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-slate-500" />
            <span className="text-xs text-slate-400">{allocation.length} classe{allocation.length !== 1 ? 's' : ''} de ativo</span>
          </div>
          <span className="badge badge-green">{history.length} aporte{history.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Gráfico + Tabela */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2">
          <AllocationChart allocation={allocation} total={total} />
        </div>
        <div className="xl:col-span-3">
          <HistoryTable history={history} />
        </div>
      </div>

      {/* Guia de comandos */}
      <div
        className="card px-5 py-4"
        style={{ borderColor: 'rgba(34,211,238,0.15)', backgroundColor: 'rgba(34,211,238,0.03)' }}
      >
        <p className="section-title mb-2">Como registrar via WhatsApp</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
          {[
            ['Compra de criptomoeda',  '!fin investimento 500 cripto Compra de ETH'],
            ['Aporte em ações',        '!fin investimento 2500 acoes Aporte WEGE3'],
            ['Aporte em FII',          '!fin investimento 1000 fii MXRF11'],
            ['Aporte planejado',       '!fin investimento 3000 bolsa 30/06 Aporte BOVA11'],
          ].map(([label, cmd]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-slate-500">{label}</span>
              <code
                className="font-mono text-[11px] px-2 py-1 rounded"
                style={{ backgroundColor: '#0a1525', color: '#22d3ee' }}
              >
                {cmd}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
