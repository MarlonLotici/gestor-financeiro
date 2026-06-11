import { Wallet, ArrowUpCircle, ArrowDownCircle, Shield } from 'lucide-react'
import { formatBRL, calcPercent } from '../../utils/formatters'

const EMERGENCY_GOAL = 20000 // TODO: mover para configuração no banco futuramente

function Card({ icon: Icon, iconColor, iconBg, label, value, valueColor, children }) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <p className="section-title">{label}</p>
      </div>
      <div>
        <p className="stat-number" style={{ color: valueColor ?? '#e2e8f0' }}>
          {value}
        </p>
      </div>
      {children}
    </div>
  )
}

export default function SummaryCards({ summary }) {
  const { saldoAtual, receitaTotal, despesaTotal, reservaAtual } = summary
  const fundPercent = calcPercent(reservaAtual, EMERGENCY_GOAL)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card
        icon={Wallet}
        iconColor="#22d3ee"
        iconBg="rgba(34,211,238,0.1)"
        label="Saldo Atual"
        value={formatBRL(saldoAtual)}
        valueColor={saldoAtual >= 0 ? '#34d399' : '#f87171'}
      >
        <p className="text-xs text-slate-500">Receitas − Despesas no período</p>
      </Card>

      <Card
        icon={ArrowUpCircle}
        iconColor="#34d399"
        iconBg="rgba(52,211,153,0.1)"
        label="Receita no Mês"
        value={formatBRL(receitaTotal)}
        valueColor="#34d399"
      >
        <p className="text-xs text-slate-500">Total de entradas confirmadas</p>
      </Card>

      <Card
        icon={ArrowDownCircle}
        iconColor="#f87171"
        iconBg="rgba(248,113,113,0.1)"
        label="Despesas no Mês"
        value={formatBRL(despesaTotal)}
        valueColor="#f87171"
      >
        <p className="text-xs text-slate-500">Total de saídas registradas</p>
      </Card>

      <Card
        icon={Shield}
        iconColor="#a78bfa"
        iconBg="rgba(167,139,250,0.1)"
        label="Reserva de Emergência"
        value={formatBRL(reservaAtual)}
        valueColor="#a78bfa"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Meta: {formatBRL(EMERGENCY_GOAL)}</span>
            <span className="font-semibold" style={{ color: '#a78bfa' }}>{fundPercent}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${fundPercent}%`,
                background:
                  fundPercent >= 100
                    ? 'linear-gradient(90deg,#34d399,#22d3ee)'
                    : fundPercent >= 60
                    ? 'linear-gradient(90deg,#a78bfa,#6366f1)'
                    : 'linear-gradient(90deg,#f97316,#fb923c)',
              }}
            />
          </div>
          <p className="text-xs text-slate-600">
            Faltam {formatBRL(EMERGENCY_GOAL - reservaAtual)}
          </p>
        </div>
      </Card>
    </div>
  )
}
