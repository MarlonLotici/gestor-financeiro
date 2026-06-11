-- ================================================================
-- Motor Financeiro — Migration v2
-- Execute no SQL Editor do Supabase (projeto financeiro isolado)
-- ================================================================

-- 1. Adiciona colunas novas (idempotente com IF NOT EXISTS)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS due_date DATE         NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS status   TEXT         NOT NULL DEFAULT 'realizado'
    CHECK (status IN ('pago', 'pendente', 'recebido', 'previsto'));

-- 2. Preenche status nos registros existentes
UPDATE transactions SET status = 'pago'     WHERE type = 'despesa' AND status = 'realizado';
UPDATE transactions SET status = 'recebido' WHERE type = 'receita' AND status = 'realizado';

-- 3. Índices para as queries da Agenda
CREATE INDEX IF NOT EXISTS idx_transactions_status   ON transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON transactions (due_date ASC);
