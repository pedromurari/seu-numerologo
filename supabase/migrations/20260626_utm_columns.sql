-- Adiciona colunas de UTM completas à tabela de leads
-- Execute no Supabase Dashboard → SQL Editor

ALTER TABLE seu_numerologo_leads
  ADD COLUMN IF NOT EXISTS utm_term        TEXT,
  ADD COLUMN IF NOT EXISTS utm_content     TEXT,
  ADD COLUMN IF NOT EXISTS utm_landing_page TEXT;
