// =============================================================
// MOTOR FINANCEIRO — MOCK DATA
// =============================================================
// TODO: API Integration
// Substitua cada export por uma chamada à sua API:
//   const data = await fetch('/api/financial/dashboard').then(r => r.json())
//
// Supabase:
//   const { data } = await supabase.from('transactions').select('*')
//
// WhatsApp Bot Integration:
//   POST /api/transactions { description, amount, category, type, date }
// =============================================================

export const currentPeriod = { month: 'Junho', year: 2026, label: 'Junho 2026' }

// ----- RESUMO GERAL -----
export const summaryData = {
  currentBalance: 8750.45,
  monthlyIncome: { received: 15950.0, expected: 12700.0 },
  monthlyExpenses: { paid: 9823.55, pending: 409.9 },
  emergencyFund: { current: 12500.0, goal: 20000.0, monthlyContribution: 500.0 },
  lastUpdated: '2026-06-10T09:30:00',
}

// ----- RECEITAS -----
// TODO: GET /api/income?month=2026-06
export const incomeCategories = [
  {
    id: 'fixed',
    label: 'Renda Fixa',
    color: '#22d3ee',
    bgColor: 'rgba(34,211,238,0.1)',
    icon: 'Briefcase',
    items: [
      { id: 1, name: 'Salário Base', amount: 5500.0, received: true, date: '2026-06-05', recurring: true },
    ],
  },
  {
    id: 'commissions',
    label: 'Comissões',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.1)',
    icon: 'TrendingUp',
    items: [
      { id: 2, name: 'Comissão Energia Solar', amount: 3200.0, received: true, date: '2026-06-10' },
      { id: 3, name: 'Comissão Parceria TI', amount: 1800.0, received: false, expectedDate: '2026-06-20' },
    ],
  },
  {
    id: 'business',
    label: 'Negócios Próprios',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.1)',
    icon: 'Zap',
    items: [
      { id: 4, name: 'Projeto Solar Residencial — Cliente A', amount: 4500.0, received: true, date: '2026-06-08', tag: 'Energia Solar' },
      { id: 5, name: 'Projeto Solar Comercial — Cliente B', amount: 6800.0, received: false, expectedDate: '2026-06-25', tag: 'Energia Solar' },
      { id: 6, name: 'Assinaturas SaaS — Mensalidades', amount: 2100.0, received: true, date: '2026-06-01', tag: 'Software/SaaS' },
      { id: 7, name: 'Projeto Custom — FinanceApp', amount: 3500.0, received: false, expectedDate: '2026-06-30', tag: 'Software/SaaS' },
    ],
  },
  {
    id: 'extra',
    label: 'Renda Extra',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.1)',
    icon: 'Music',
    items: [
      { id: 8, name: 'Cachê Show — Evento Corporativo', amount: 850.0, received: true, date: '2026-06-07' },
      { id: 9, name: 'Cachê Festa Privada', amount: 600.0, received: false, expectedDate: '2026-06-15' },
    ],
  },
]

// ----- DESPESAS -----
// TODO: GET /api/expenses?month=2026-06
export const expenseCategories = [
  {
    id: 'fixed',
    label: 'Custos Fixos',
    color: '#f87171',
    items: [
      { id: 1, name: 'Aluguel', amount: 1800.0, paid: true, dueDate: '2026-06-05', recurring: true },
      { id: 2, name: 'Parcela do Carro', amount: 950.0, paid: true, dueDate: '2026-06-10', recurring: true },
      { id: 3, name: 'Celular', amount: 120.0, paid: true, dueDate: '2026-06-08', recurring: true },
      { id: 4, name: 'Internet', amount: 110.0, paid: true, dueDate: '2026-06-05', recurring: true },
      { id: 5, name: 'Academia', amount: 89.9, paid: false, dueDate: '2026-06-15', recurring: true },
    ],
  },
  {
    id: 'variable',
    label: 'Custos Variáveis',
    color: '#fbbf24',
    items: [
      { id: 6, name: 'Alimentação', amount: 1200.0, paid: true },
      { id: 7, name: 'Transporte / Combustível', amount: 450.0, paid: true },
      { id: 8, name: 'Lazer', amount: 320.0, paid: false },
      { id: 9, name: 'Saúde / Farmácia', amount: 180.0, paid: true },
      { id: 10, name: 'Educação', amount: 249.9, paid: true },
    ],
  },
]

// ----- DÍVIDAS -----
// TODO: GET /api/debts
export const debtsData = [
  {
    id: 1,
    name: 'Cartão Nubank',
    type: 'credit_card',
    institution: 'Nubank',
    totalAmount: 4200.0,
    remainingAmount: 4200.0,
    monthlyPayment: 400.0,
    interestRate: 8.5,
    priority: 'critical',
    nextDueDate: '2026-06-15',
    color: '#c026d3',
  },
  {
    id: 2,
    name: 'Empréstimo Pessoal',
    type: 'loan',
    institution: 'Banco XYZ',
    totalAmount: 15000.0,
    remainingAmount: 11500.0,
    monthlyPayment: 750.0,
    interestRate: 1.89,
    remainingInstallments: 15,
    totalInstallments: 20,
    priority: 'high',
    nextDueDate: '2026-06-20',
    color: '#ef4444',
  },
  {
    id: 3,
    name: 'Cartão Inter',
    type: 'credit_card',
    institution: 'Banco Inter',
    totalAmount: 1850.0,
    remainingAmount: 1850.0,
    monthlyPayment: 250.0,
    interestRate: 7.9,
    priority: 'medium',
    nextDueDate: '2026-06-22',
    color: '#f97316',
  },
  {
    id: 4,
    name: 'Financiamento Equipamento Solar',
    type: 'loan',
    institution: 'BNB',
    totalAmount: 8000.0,
    remainingAmount: 5600.0,
    monthlyPayment: 400.0,
    interestRate: 1.29,
    remainingInstallments: 14,
    totalInstallments: 20,
    priority: 'low',
    nextDueDate: '2026-06-28',
    color: '#22c55e',
  },
]

// ----- FLUXO DE CAIXA SEMANAL -----
// TODO: GET /api/cashflow?month=2026-06&groupBy=week
export const cashFlowWeekly = [
  { week: 'Sem 1', income: 8850, expenses: 3069.9, balance: 5780.1 },
  { week: 'Sem 2', income: 5050, expenses: 2450.0, balance: 2600.0 },
  { week: 'Sem 3', income: 2050, expenses: 2503.65, balance: -453.65 },
  { week: 'Sem 4', income: 0, expenses: 1800.0, balance: -1800.0 },
]

// ----- DISTRIBUIÇÃO DE RECEITA -----
// TODO: Calculado a partir de incomeCategories
export const revenueDistribution = [
  { name: 'Salário Base', value: 5500, color: '#22d3ee' },
  { name: 'Comissões', value: 5000, color: '#a78bfa' },
  { name: 'Energia Solar', value: 4500, color: '#34d399' },
  { name: 'Software/SaaS', value: 2100, color: '#6366f1' },
  { name: 'Renda Extra', value: 850, color: '#fb923c' },
]

// ----- TRANSAÇÕES RECENTES -----
// TODO: GET /api/transactions?limit=10&sort=date:desc
export const recentTransactions = [
  { id: 1, date: '2026-06-10', description: 'Comissão Energia Solar', category: 'Comissão', type: 'income', amount: 3200.0 },
  { id: 2, date: '2026-06-09', description: 'Combustível', category: 'Transporte', type: 'expense', amount: -180.0 },
  { id: 3, date: '2026-06-08', description: 'Projeto Solar — Cliente A', category: 'Energia Solar', type: 'income', amount: 4500.0 },
  { id: 4, date: '2026-06-08', description: 'Celular', category: 'Fixo', type: 'expense', amount: -120.0 },
  { id: 5, date: '2026-06-07', description: 'Cachê Show Corporativo', category: 'Música', type: 'income', amount: 850.0 },
  { id: 6, date: '2026-06-07', description: 'Supermercado', category: 'Alimentação', type: 'expense', amount: -320.0 },
  { id: 7, date: '2026-06-05', description: 'Salário Base', category: 'Renda Fixa', type: 'income', amount: 5500.0 },
  { id: 8, date: '2026-06-05', description: 'Aluguel', category: 'Fixo', type: 'expense', amount: -1800.0 },
  { id: 9, date: '2026-06-05', description: 'Internet', category: 'Fixo', type: 'expense', amount: -110.0 },
  { id: 10, date: '2026-06-01', description: 'Assinaturas SaaS', category: 'Software', type: 'income', amount: 2100.0 },
]
