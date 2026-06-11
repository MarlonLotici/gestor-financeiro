import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import DashboardPage from './components/dashboard/DashboardPage'
import IncomeModule from './components/income/IncomeModule'
import ExpensesModule from './components/expenses/ExpensesModule'
import DebtDetonator from './components/debts/DebtDetonator'
import AgendaPage from './components/agenda/AgendaPage'
import InvestmentsPage from './components/investments/InvestmentsPage'

const PAGES = {
  dashboard:   DashboardPage,
  income:      IncomeModule,
  expenses:    ExpensesModule,
  debts:       DebtDetonator,
  agenda:      AgendaPage,
  investments: InvestmentsPage,
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const PageComponent = PAGES[activePage] ?? DashboardPage

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#060d1f' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => { setActivePage(page); setSidebarOpen(false) }}
        isOpen={sidebarOpen}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  )
}
