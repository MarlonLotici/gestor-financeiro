-- ================================================================
-- Motor Financeiro — Schema
-- Execute no SQL Editor do seu NOVO projeto Supabase
-- ================================================================

create table if not exists transactions (
  id          uuid        primary key default gen_random_uuid(),
  type        text        not null check (type in ('receita', 'despesa')),
  amount      numeric(12,2) not null check (amount > 0),
  category    text        not null,
  description text,
  date        date        not null default current_date,
  created_at  timestamptz not null default now()
);

-- Índices para as queries do dashboard (filtros por data e tipo)
create index if not exists idx_transactions_date on transactions (date desc);
create index if not exists idx_transactions_type on transactions (type);

-- Row Level Security: apenas a service_role da API acessa
alter table transactions enable row level security;

create policy "api_service_role_only" on transactions
  for all
  using (auth.role() = 'service_role');
