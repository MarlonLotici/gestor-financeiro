import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.FINANCE_SUPABASE_URL,
  process.env.FINANCE_SUPABASE_KEY,
)

const app = express()
app.use(express.json())

// ================================================================
// DICIONÁRIO DE CATEGORIAS
// Adicionar alias: inclua no array do canônico correspondente.
// ================================================================
const CATEGORY_ALIASES = {
  // ── Receitas ──────────────────────────────────────────────────
  reino_fixo:          ['reino_fixo', 'reino', 'fixo'],
  reino_comissao:      ['reino_comissao', 'comissao'],
  solar:               ['solar', 'energia', 'enerzee'],
  software:            ['software', 'antix', 'sistema'],
  musica:              ['musica', 'show', 'cache', 'bar', 'violao'],
  // ── Despesas ──────────────────────────────────────────────────
  aluguel:             ['aluguel', 'casa', 'moradia'],
  carro:               ['carro', 'parcela', 'veiculo', 'gasolina', 'combustivel'],
  contas:              ['contas', 'luz', 'agua', 'internet', 'celular', 'telefone'],
  cartao:              ['cartao', 'credito', 'nubank'],
  divida:              ['divida', 'emprestimo', 'banco'],
  estilo_vida:         ['estilo_vida', 'lazer', 'ifood', 'restaurante', 'academia', 'comida'],
  reserva:             ['reserva', 'guardar', 'aporte_reserva'],   // ← Etapa 2
  // ── Investimentos ─────────────────────────────────────────────
  acoes:               ['acoes', 'fii', 'bolsa', 'bova11'],        // ← Etapa 3
  cripto:              ['cripto', 'bitcoin', 'btc', 'eth'],        // ← Etapa 3
}

// Lookup reverso gerado no boot — O(1) em runtime por request
const ALIAS_LOOKUP = Object.entries(CATEGORY_ALIASES).reduce((acc, [canonical, aliases]) => {
  for (const a of aliases) acc[a] = canonical
  return acc
}, {})

function normalizeCategory(input, type) {
  const hit = ALIAS_LOOKUP[input.toLowerCase()]
  if (hit) return hit
  if (type === 'receita')      return 'outros_receita'
  if (type === 'investimento') return 'outros_investimento'
  return 'outros_despesa'
}

// ================================================================
// HELPERS DE DATA E STATUS
// ================================================================
const DATE_RE = /^(\d{1,2})\/(\d{1,2})$/

function extractDueDate(parts) {
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].match(DATE_RE)
    if (m) {
      const year = new Date().getFullYear()
      const due  = `${year}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
      return { due, parts: [...parts.slice(0, i), ...parts.slice(i + 1)] }
    }
  }
  return { due: null, parts }
}

function computeStatus(type, dueDate) {
  const today  = new Date().toISOString().slice(0, 10)
  const isPast = !dueDate || dueDate <= today
  if (type === 'receita')      return isPast ? 'recebido' : 'previsto'
  if (type === 'investimento') return isPast ? 'recebido' : 'pendente'
  return isPast ? 'pago' : 'pendente'  // despesa
}

// ================================================================
// PARSE DO COMANDO
// Sintaxe: !fin [tipo] [valor] [categoria] [DD/MM opcional] [desc...]
// Exemplos:
//   !fin receita 3200 comissao
//   !fin despesa 500 reserva          ← aporte reserva de emergência
//   !fin investimento 1000 cripto Compra de BTC
//   !fin investimento 2500 acoes 20/06 Aporte WEGE3
// ================================================================
const CMD_PREFIX  = '!fin '
const VALID_TYPES = new Set(['receita', 'despesa', 'investimento'])

function parseCommand(text) {
  const parts = text.slice(CMD_PREFIX.length).trim().split(' ')
  if (parts.length < 3)
    return { error: 'Poucos argumentos. Use: !fin [receita|despesa|investimento] [valor] [categoria] [DD/MM opcional]' }

  const [type, rawAmount, rawCategory, ...rest] = parts
  const amount = parseFloat(rawAmount.replace(',', '.'))

  if (!VALID_TYPES.has(type))
    return { error: `Tipo inválido: "${type}". Use receita, despesa ou investimento.` }
  if (isNaN(amount) || amount <= 0)
    return { error: `Valor inválido: "${rawAmount}". Use número positivo.` }

  const { due, parts: descParts } = extractDueDate(rest)
  const today = new Date().toISOString().slice(0, 10)

  return {
    data: {
      type,
      amount,
      category:    normalizeCategory(rawCategory, type),
      description: descParts.length > 0 ? descParts.join(' ') : null,
      date:        today,
      due_date:    due ?? today,
      status:      computeStatus(type, due),
    },
  }
}

// ================================================================
// ROTAS
// ================================================================

// ----------------------------------------------------------------
// POST /api/webhook/finance
// ----------------------------------------------------------------
app.post('/api/webhook/finance', async (req, res) => {
  const { remoteJid, textMessage } = req.body

  if (!textMessage?.startsWith(CMD_PREFIX))
    return res.status(200).json({ ok: true, ignored: true })

  const allowedGroup = process.env.FINANCE_GROUP_ID
  if (allowedGroup && remoteJid !== allowedGroup)
    return res.status(200).json({ ok: true, ignored: true })

  const { data: parsed, error: parseError } = parseCommand(textMessage)
  if (parseError)
    return res.status(200).json({ ok: false, reply: `❌ ${parseError}` })

  const { data, error } = await supabase
    .from('transactions')
    .insert([parsed])
    .select()
    .single()

  if (error) {
    console.error('[supabase error]', { message: error.message, code: error.code, details: error.details, hint: error.hint })
    return res.status(200).json({ ok: false, reply: '❌ Erro ao salvar. Verifique os logs.' })
  }

  const EMOJI  = { receita: '💰', despesa: '💸', investimento: '📈' }
  const LABEL  = { receita: 'Receita', despesa: 'Despesa', investimento: 'Investimento' }
  const STATUS = { recebido: '✅ Confirmado', pago: '✅ Pago', previsto: '🗓 Previsto', pendente: '⏳ A pagar/aplicar' }
  const brl    = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parsed.amount)

  const reply = [
    `${EMOJI[parsed.type]} *${LABEL[parsed.type]} registrado!*`,
    `💵 Valor: ${brl}`,
    `📂 Categoria: ${parsed.category}`,
    parsed.description ? `📝 ${parsed.description}` : null,
    `📅 Data/Vencimento: ${parsed.due_date}`,
    STATUS[parsed.status],
  ].filter(Boolean).join('\n')

  return res.status(201).json({ ok: true, reply, data })
})

// ----------------------------------------------------------------
// GET /api/financial/dashboard?month=YYYY-MM
//
// Executa 3 queries em paralelo:
//  1. Transações do mês (filtradas por `date`)
//  2. Reserva acumulada (histórico completo, category='reserva')
//  3. Investimentos históricos (histórico completo, type='investimento')
// ----------------------------------------------------------------
app.get('/api/financial/dashboard', async (req, res) => {
  const month = req.query.month ?? new Date().toISOString().slice(0, 7)
  const [year, monthNum] = month.split('-').map(Number)
  const startDate = `${month}-01`
  const endDate   = new Date(year, monthNum, 0).toISOString().slice(0, 10)

  const [
    { data: transactions,  error: txErr  },
    { data: reservaRows,   error: resErr },
    { data: investRows,    error: invErr },
  ] = await Promise.all([
    // 1. Transações do mês (receita + despesa)
    supabase
      .from('transactions')
      .select('*')
      .in('type', ['receita', 'despesa'])
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false }),

    // 2. Reserva acumulada — todo o histórico, não filtrado por mês
    supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'despesa')
      .eq('category', 'reserva')
      .in('status', ['pago', 'recebido']),

    // 3. Investimentos — todo o histórico
    supabase
      .from('transactions')
      .select('amount, category')
      .eq('type', 'investimento')
      .in('status', ['recebido', 'pago']),
  ])

  if (txErr || resErr || invErr) {
    const err = txErr ?? resErr ?? invErr
    console.error('[supabase error]', { message: err.message, code: err.code })
    return res.status(500).json({ error: 'Erro ao carregar transações.' })
  }

  // KPIs do mês — apenas confirmados, excluindo a categoria 'reserva'
  // (reserva é uma transferência interna, não uma "despesa" operacional)
  const confirmed = (transactions ?? []).filter(
    t => (t.status === 'pago' || t.status === 'recebido') && t.category !== 'reserva',
  )

  let receitaTotal = 0, despesaTotal = 0
  for (const t of confirmed) {
    const v = parseFloat(t.amount)
    if (t.type === 'receita') receitaTotal += v
    else despesaTotal += v
  }

  // Reserva acumulada histórica
  const reservaAtual = (reservaRows ?? []).reduce((s, t) => s + parseFloat(t.amount), 0)

  // Patrimônio investido total histórico
  const valorInvestidoTotal = (investRows ?? []).reduce((s, t) => s + parseFloat(t.amount), 0)

  // Fluxo de caixa semanal
  const WEEKS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
  const weekOf = (d) => { const n = new Date(d + 'T12:00:00').getDate(); return n <= 7 ? 0 : n <= 14 ? 1 : n <= 21 ? 2 : 3 }
  const cashFlow = WEEKS.map((week, i) => {
    const wtx      = confirmed.filter(t => weekOf(t.date) === i)
    const income   = wtx.filter(t => t.type === 'receita').reduce((s, t) => s + parseFloat(t.amount), 0)
    const expenses = wtx.filter(t => t.type === 'despesa').reduce((s, t) => s + parseFloat(t.amount), 0)
    return { week, income, expenses, balance: income - expenses }
  })

  // Distribuição de receitas por categoria
  const catMap = {}
  confirmed.filter(t => t.type === 'receita').forEach(t => {
    catMap[t.category] = (catMap[t.category] ?? 0) + parseFloat(t.amount)
  })
  const revenueByCategory = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return res.json({
    summary: { saldoAtual: receitaTotal - despesaTotal, receitaTotal, despesaTotal, reservaAtual, valorInvestidoTotal },
    cashFlow,
    revenueByCategory,
    transactions: (transactions ?? []).slice(0, 10),
  })
})

// ----------------------------------------------------------------
// GET /api/investments
// Histórico completo de aportes + alocação por categoria
// Usado pela InvestmentsPage do frontend
// ----------------------------------------------------------------
app.get('/api/investments', async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('type', 'investimento')
    .order('date', { ascending: false })

  if (error) {
    console.error('[supabase error]', { message: error.message, code: error.code })
    return res.status(500).json({ error: 'Erro ao carregar investimentos.' })
  }

  const total = (data ?? []).reduce((s, t) => s + parseFloat(t.amount), 0)

  const allocMap = {}
  ;(data ?? []).forEach(t => {
    allocMap[t.category] = (allocMap[t.category] ?? 0) + parseFloat(t.amount)
  })
  const allocation = Object.entries(allocMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return res.json({ total, allocation, history: data ?? [] })
})

// ----------------------------------------------------------------
// GET /api/agenda
// ----------------------------------------------------------------
app.get('/api/agenda', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .in('status', ['previsto', 'pendente'])
    .gte('due_date', today)
    .order('due_date', { ascending: true })

  if (error) {
    console.error('[supabase error]', { message: error.message, code: error.code })
    return res.status(500).json({ error: 'Erro ao carregar agenda.' })
  }

  return res.json({
    fluxoFuturoEntradas: data.filter(t => t.status === 'previsto'),
    fluxoFuturoSaidas:   data.filter(t => t.status === 'pendente'),
  })
})

// ----------------------------------------------------------------
// PATCH /api/transactions/:id/status
// ----------------------------------------------------------------
app.patch('/api/transactions/:id/status', async (req, res) => {
  const { id }     = req.params
  const { status } = req.body

  if (!['pago', 'recebido', 'pendente', 'previsto'].includes(status))
    return res.status(400).json({ error: 'Status inválido.' })

  const { data, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[supabase error]', { message: error.message, code: error.code })
    return res.status(500).json({ error: 'Erro ao atualizar status.' })
  }

  return res.json({ ok: true, data })
})

// ----------------------------------------------------------------
// Health check
// ----------------------------------------------------------------
app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'motor-financeiro-api', ts: new Date().toISOString() })
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`[motor-financeiro-api] rodando em http://localhost:${PORT}`))
