-- Protege leads contra acesso direto pelo REST público.
-- O navegador passa a gravar eventos via Edge Function `lead-event`,
-- que usa service_role no servidor e não retorna dados sensíveis.

ALTER TABLE public.seu_numerologo_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_insert_lead ON public.seu_numerologo_leads;
DROP POLICY IF EXISTS anon_update_lead ON public.seu_numerologo_leads;
DROP POLICY IF EXISTS auth_read_leads ON public.seu_numerologo_leads;
DROP POLICY IF EXISTS auth_update_leads ON public.seu_numerologo_leads;
DROP POLICY IF EXISTS service_read_all ON public.seu_numerologo_leads;
DROP POLICY IF EXISTS service_update_all ON public.seu_numerologo_leads;

REVOKE ALL ON TABLE public.seu_numerologo_leads FROM anon;
REVOKE ALL ON TABLE public.seu_numerologo_leads FROM authenticated;

NOTIFY pgrst, 'reload schema';
