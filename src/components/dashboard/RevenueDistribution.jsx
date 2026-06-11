import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatBRL, calcPercent } from '../../utils/formatters'

// Paleta fixa — as categorias do banco recebem cores por ordem de valor
const PALETTE = ['#22d3ee', '#a78bfa', '#34d399', '#6366f1', '#fb923c', '#fbbf24', '#f87171', '#60a5fa']
const colorFor = (index) => PALETTE[index % PALETTE.length]

// Injeta color no array de dados (que vem sem cor da API)
const withColors = (data) => data.map((item, i) => ({ ...item, color: colorFor(i) }))

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null
  const { name, value, color } = payload[0].payload
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-sm shadow-xl"
      style={{ backgroundColor: '#0a1525', border: '1px solid #1e3a5f' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-slate-200">{name}</span>
      </div>
      <p className="font-mono font-bold text-base" style={{ color }}>{formatBRL(value)}</p>
      <p className="text-xs text-slate-500">{calcPercent(value, total)}% do total</p>
    </div>
  )
}

export default function RevenueDistribution({ data }) {
  const colored = withColors(data)
  const total = colored.reduce((s, i) => s + i.value, 0)

  if (!colored.length) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ minHeight: '320px' }}>
        <p className="text-xs text-slate-500">Nenhuma receita registrada no período.</p>
      </div>
    )
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Distribuição de Receitas</h2>
        <p className="text-xs text-slate-500 mt-0.5">Origem das entradas — mês atual</p>
      </div>

      <div className="flex flex-col items-center">
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colored}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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
        <div className="-mt-[120px] mb-[68px] flex flex-col items-center pointer-events-none">
          <p className="text-xs text-slate-500 font-medium">Receitas</p>
          <p className="font-mono text-lg font-bold text-slate-100">{formatBRL(total)}</p>
        </div>
      </div>

      {/* Legenda */}
      <div className="space-y-2">
        {colored.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-400 truncate capitalize">{item.name}</span>
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
