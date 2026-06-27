-- Adiciona colunas fbc e fbp para Full Signal Meta CAPI
ALTER TABLE seu_numerologo_leads
  ADD COLUMN IF NOT EXISTS fbc TEXT,
  ADD COLUMN IF NOT EXISTS fbp TEXT;
