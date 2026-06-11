import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatBRL, formatDateFull } from '../../utils/formatters'

// Cores por categoria — fallback genérico para categorias dinâmicas do banco
const CATEGORY_COLORS = {
  salario: '#22d3ee',
  comissao: '#a78bfa',
  solar: '#34d399',
  saas: '#6366f1',
  musica: '#fb923c',
  fixo: '#94a3b8',
  alimentacao: '#fbbf24',
  transporte: '#60a5fa',
}
const categoryColor = (cat) => CATEGORY_COLORS[cat?.toLowerCase()] ?? '#64748b'

export default function RecentTransactions({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="card p-5">
        <p className="text-xs text-slate-500 text-center py-8">
          Nenhuma transação registrada neste período.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Transações Recentes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Últimas {transactions.length} movimentações</p>
        </div>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Ver todas →
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #1a3050' }}>
              {['Data', 'Descrição', 'Categoria', 'Valor'].map((h) => (
                <th key={h} className="pb-2.5 text-left section-title px-1 first:pl-0 last:text-right">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              // O banco grava 'receita'/'despesa' — não 'income'/'expense'
              const isIncome = tx.type === 'receita'
              const catColor = categoryColor(tx.category)
              return (
                <tr
                  key={tx.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid #0f1e35' }}
                >
                  <td className="py-2.5 px-1 first:pl-0 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateFull(tx.date)}
                  </td>
                  <td className="py-2.5 px-1 text-sm text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isIncome
                            ? 'rgba(52,211,153,0.12)'
                            : 'rgba(248,113,113,0.12)',
                        }}
                      >
                        {isIncome
                          ? <ArrowUpRight size={11} style={{ color: '#34d399' }} />
                          : <ArrowDownRight size={11} style={{ color: '#f87171' }} />}
                      </span>
                      <span className="truncate max-w-[200px]">
                        {tx.description || tx.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-1 text-xs">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${catColor}18`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-1 text-right text-sm font-mono font-semibold whitespace-nowrap">
                    <span style={{ color: isIncome ? '#34d399' : '#f87171' }}>
                      {isIncome ? '+' : '-'}{formatBRL(Math.abs(tx.amount))}
                    </span>
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
