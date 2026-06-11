-- ================================================================
-- Motor Financeiro — Migration v3
-- Adiciona suporte ao tipo 'investimento' na tabela transactions
-- Execute no SQL Editor do Supabase
-- ================================================================

-- 1. Remove o CHECK antigo e recria com 'investimento' incluído
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('receita', 'despesa', 'investimento'));

-- 2. Índice auxiliar para as queries de investimento e reserva
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);
