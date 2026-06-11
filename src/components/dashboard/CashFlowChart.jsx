import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatBRL } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm shadow-xl"
      style={{ backgroundColor: '#0a1525', border: '1px solid #1e3a5f', minWidth: '180px' }}
    >
      <p className="font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-mono font-semibold" style={{ color: entry.color }}>
            {formatBRL(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex items-center justify-center gap-6 mt-2">
    {payload?.map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5 text-xs text-slate-400">
        <span
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: entry.color, opacity: entry.type === 'line' ? 1 : 0.85 }}
        />
        {entry.value}
      </div>
    ))}
  </div>
)

export default function CashFlowChart({ data }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Fluxo de Caixa</h2>
          <p className="text-xs text-slate-500 mt-0.5">Entradas vs Saídas — mês atual</p>
        </div>
        <div
          className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-400"
          style={{ backgroundColor: '#0d1f3c', border: '1px solid #1a3050' }}
        >
          Semanal
        </div>
      </div>

      <div style={{ height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: '#1a3050' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="income" name="Receitas" fill="#34d399" fillOpacity={0.85} radius={[4,4,0,0]} maxBarSize={52} />
            <Bar dataKey="expenses" name="Despesas" fill="#f87171" fillOpacity={0.8} radius={[4,4,0,0]} maxBarSize={52} />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#818cf8' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
