import { Menu, Bell, CalendarDays } from 'lucide-react'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard',             subtitle: 'Visão geral do período'              },
  income:    { title: 'Receitas',               subtitle: 'Controle de entradas'                },
  expenses:  { title: 'Despesas',               subtitle: 'Controle de saídas'                  },
  debts:     { title: 'Detonador de Dívidas',   subtitle: 'Gestão de passivos'                  },
  agenda:      { title: 'Agenda & Previsões',     subtitle: 'Contas a vencer e entradas futuras'  },
  investments: { title: 'Investimentos',          subtitle: 'Patrimônio & aportes'                },
}

export default function Header({ activePage, onMenuToggle }) {
  const { title, subtitle } = PAGE_TITLES[activePage] ?? PAGE_TITLES.dashboard

  const currentPeriod = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6"
      style={{
        height: '64px',
        backgroundColor: 'rgba(6,13,31,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a3050',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-100 leading-tight truncate">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Period badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300"
          style={{ backgroundColor: '#0d1f3c', border: '1px solid #1a3050' }}
        >
          <CalendarDays size={13} style={{ color: '#22d3ee' }} />
          <span className="capitalize">{currentPeriod}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
          style={{ border: '1px solid #1a3050' }}
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>
      </div>
    </header>
  )
}
