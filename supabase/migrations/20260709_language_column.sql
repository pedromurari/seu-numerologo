-- Adiciona idioma do lead para funil i18n (pt/en/es)
ALTER TABLE seu_numerologo_leads
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'pt';

UPDATE seu_numerologo_leads
SET language = 'pt'
WHERE language IS NULL OR language NOT IN ('pt', 'en', 'es');

ALTER TABLE seu_numerologo_leads
  ALTER COLUMN language SET DEFAULT 'pt',
  ALTER COLUMN language SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'seu_numerologo_leads_language_check'
  ) THEN
    ALTER TABLE seu_numerologo_leads
      ADD CONSTRAINT seu_numerologo_leads_language_check
      CHECK (language IN ('pt', 'en', 'es'));
  END IF;
END $$;
