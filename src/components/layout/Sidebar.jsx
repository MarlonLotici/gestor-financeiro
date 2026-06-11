import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Flame,
  CalendarClock,
  LineChart,
  BarChart2,
  Settings,
  Zap,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',            icon: LayoutDashboard },
  { id: 'income',      label: 'Receitas',              icon: TrendingUp      },
  { id: 'expenses',    label: 'Despesas',              icon: TrendingDown    },
  { id: 'debts',       label: 'Detonador de Dívidas',  icon: Flame           },
  { id: 'agenda',      label: 'Agenda & Previsões',    icon: CalendarClock   },
  { id: 'investments', label: 'Investimentos',         icon: LineChart       },
]

export default function Sidebar({ activePage, setActivePage, isOpen }) {
  return (
    <aside
      className={[
        'fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300',
        'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
      style={{
        backgroundColor: '#080f20',
        borderRight: '1px solid #1a3050',
        width: '16rem',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid #1a3050' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-tight">Motor</p>
            <p className="text-xs font-medium leading-tight" style={{ color: '#22d3ee' }}>
              Financeiro
            </p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-300"
          onClick={() => setActivePage(activePage)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="section-title px-2 mb-3">Menu Principal</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                className={`nav-item w-full text-left ${activePage === id ? 'nav-active' : 'nav-inactive'}`}
                onClick={() => setActivePage(id)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4" style={{ borderTop: '1px solid #1a3050' }}>
          <p className="section-title px-2 mb-3">Em Breve</p>
          <ul className="space-y-1">
            {[
              { label: 'Relatórios', icon: BarChart2 },
              { label: 'Configurações', icon: Settings },
            ].map(({ label, icon: Icon }) => (
              <li key={label}>
                <button className="nav-item nav-inactive w-full text-left opacity-40 cursor-not-allowed">
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer info */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #1a3050' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            CF
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">CFO Pessoal</p>
            <p className="text-xs text-slate-600 truncate">Motor Financeiro v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
