import { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { API_BASE_URL } from '../../utils/api'
import SummaryCards from './SummaryCards'
import CashFlowChart from './CashFlowChart'
import RevenueDistribution from './RevenueDistribution'
import RecentTransactions from './RecentTransactions'

// Skeleton de loading — mantém o layout estável enquanto a API responde
function LoadingSkeleton() {
  const pulse = { backgroundColor: '#0d1f3c', borderRadius: '0.75rem', animation: 'pulse 2s infinite' }
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ ...pulse, height: '120px' }} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div style={{ ...pulse, height: '320px' }} className="xl:col-span-3" />
        <div style={{ ...pulse, height: '320px' }} className="xl:col-span-2" />
      </div>
      <div style={{ ...pulse, height: '280px' }} />
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
      >
        <AlertTriangle size={22} style={{ color: '#ef4444' }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300">Erro ao carregar o dashboard</p>
        <p className="text-xs text-slate-500 mt-1">
          Verifique se a API está rodando em localhost:3001
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 transition-colors"
        style={{ backgroundColor: '#0d1f3c', border: '1px solid #1a3050' }}
      >
        <RefreshCw size={13} />
        Tentar novamente
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Mês exibido — pode ser parametrizado futuramente com um seletor de período
  const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

  const load = () => {
    setLoading(true)
    setError(false)
    // TODO: Trocar o mês dinamicamente quando implementar seletor de período
    fetch(`${API_BASE_URL}/api/financial/dashboard?month=${currentMonth}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => { setDashData(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  if (loading) return <LoadingSkeleton />
  if (error || !dashData) return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-5">
      <SummaryCards summary={dashData.summary} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <CashFlowChart data={dashData.cashFlow} />
        </div>
        <div className="xl:col-span-2">
          <RevenueDistribution data={dashData.revenueByCategory} />
        </div>
      </div>

      <RecentTransactions transactions={dashData.transactions} />
    </div>
  )
}
