# Plano de Ação — Internacionalização (i18n) + Migração Stripe

> Documento de referência do projeto "Seu Numerólogo". Última atualização: 2026-07-12.

---

## Commits desta sessão (histórico rápido)

| Commit | O que fez |
|---|---|
| `5101f6c` | Infraestrutura i18n — `locales/pt.json`, `assets/i18n.js`, 196 elementos `data-i18n` nas 3 páginas |
| `85b8496` | Persistência de `language` no lead + templates pt/en/es no `vega-webhook` (código; migration e deploy da function ainda não tinham sido aplicados de fato) |
| `309fed6` | Doc: registra achado do RLS desligado |
| `f656dc8` | Corrige RLS — nova Edge Function `lead-event`, `index.html` para de escrever direto na tabela, migration de RLS aplicada |
| `adcd83b` | Crédito do rodapé trocado por "Onze Digital Strategy" (visual premium) |
| `f52af69` | Doc: registra tradução parcial en/es + commita `locales/es.json` que estava pendente |

Nesta passada mais recente: confirmado que **tudo isso está sincronizado** (local = GitHub = site em produção), depois de um imprevisto onde o `git push` ficou travado por autenticação expirada do Git Credential Manager — resolvido rodando `git push` uma vez direto no terminal do Windows (fora desta sessão), o que renovou o cache de login.

---

## 0. ⚠️ Achado urgente — RLS desligado em `seu_numerologo_leads`

Fora do escopo do i18n, mas achado durante uma checagem de segurança de rotina: a tabela `seu_numerologo_leads` tem **6 políticas de RLS configuradas** (`anon_insert_lead`, `anon_update_lead`, `auth_read_leads`, `auth_update_leads`, `service_read_all`, `service_update_all`) **mas o Row Level Security em si está desligado na tabela** (confirmado via `pg_class.relrowsecurity = false`). Isso significa que as políticas não têm efeito nenhum — o controle de acesso real depende só de permissões de tabela, não de linha.

**Por que isso importa:** a chave anônima do Supabase fica exposta no código-fonte do site (`index.html`), como é esperado. Com RLS desligado, qualquer pessoa com essa chave (visível pra qualquer visitante) pode, em tese, consultar a tabela inteira via API REST do Supabase — nome, e-mail, WhatsApp e data de nascimento de **todos** os leads, não só o próprio.

**Corrigido em 2026-07-12.** A tabela agora está com RLS ligado, acesso direto de `anon`/`authenticated` revogado, e o formulário público grava leads via Edge Function `lead-event`, que usa `service_role` no servidor e não retorna dados sensíveis.

### Atualização — correção aplicada em produção

Foi aplicada uma correção segura para não depender de escrita direta do navegador na tabela:

- Nova Edge Function `supabase/functions/lead-event/index.ts` para receber eventos do funil (`save_lead`, `update_nums`, `checkout`, `pdf_path`) e gravar com `service_role` no servidor, sem retornar dados sensíveis.
- `index.html` alterado para chamar `/functions/v1/lead-event` em vez de escrever direto em `seu_numerologo_leads` pelo REST público.
- `supabase/config.toml` atualizado com `[functions.lead-event] verify_jwt = false`, pois o formulário público precisa invocar essa função.
- Migration `supabase/migrations/20260709180551_enable_leads_rls.sql` criada para ativar RLS, remover policies antigas e revogar acesso direto de `anon`/`authenticated` à tabela.

**Ordem executada para não quebrar leads:**

1. CLI Supabase autenticada e projeto `usqiyekfmwwnvkmkdlej` linkado.
2. `lead-event` deployada no Supabase com `--no-verify-jwt`.
3. SQL da migration de RLS aplicado via `supabase db query --linked --file ...` porque `supabase db push` não pôde ser usado: o histórico remoto tem migrations antigas que não existem neste repo local.
4. `lead-event` testada com lead fake: criação e atualização retornaram `{"ok":true}`.
5. REST público de `seu_numerologo_leads` testado com anon key: antes respondia `206` com contagem; depois da correção responde `401 Unauthorized`.
6. Grants diretos de `anon`/`authenticated` conferidos: nenhum grant restante na tabela.

Com isso, o frontend alterado pode ser publicado com segurança: a captura de leads passa pela function em vez do REST direto.

---

## 1. Status atual — o que já está no ar

### Infraestrutura i18n (Fase 1 — em andamento)
- **`locales/pt.json`** — schema completo de tradução extraído do código real via script (não retranscrito à mão): 19 dicionários por número (Caminho de Vida 1-9, 11, 22, 33), toda a UI estática das 3 páginas (`index.html`, `obrigado.html`, `upsell.html`) e os templates de WhatsApp/e-mail do backend. ~24-32 mil palavras.
- **`assets/i18n.js`** — runtime que lê o cookie `sn_lang` (com fallback em `localStorage` se o cookie não persistir), carrega `/locales/{lang}.json` e aplica em todo elemento `[data-i18n]` da página. Seletor manual (PT/EN/ES) com estado visual ativo, corrigido e testado.
- **196 elementos tagueados** com `data-i18n` nas 3 páginas do funil.
- Dicionários por número (`TITULOS`, `LEITURAS`, `PERSONA_TEXT`, `ALMA_TEXT`, `AIDA_HOOK`, etc.) convertidos de `const` pra `var` e repopulados a partir do JSON carregado — a lógica de cálculo numerológico não mudou em nada.
- **`middleware.js`** — Vercel Edge Middleware detecta o país do visitante (header `x-vercel-ip-country`, grátis, populado automaticamente) e seta o cookie `sn_lang` na primeira visita.

### Persistência de idioma (Fase 1 — completo)
- **Coluna `language`** em `seu_numerologo_leads`: existe no arquivo de migration (`supabase/migrations/20260709_language_column.sql`) **e agora também aplicada de fato no banco** — `text NOT NULL DEFAULT 'pt'`, com `CHECK (language IN ('pt','en','es'))`. (Estava só no arquivo até esta sessão; sem isso, todo insert/update de lead com `language` estava quebrando silenciosamente contra o Postgres.)
- **`index.html`**: `language` é gravado em todo estágio do lead — `lead`, `calculou`, `checkout` e no PATCH do `pdf_path`. Links de checkout recebem `lang` na query string.
- **`supabase/functions/vega-webhook/index.ts`**: PIX pendente, WhatsApp de entrega e e-mail de boas-vindas (Resend) escolhem template real por idioma (`pt`/`en`/`es`, com conteúdo de verdade nos 3, não placeholder). `content_name` do Meta CAPI continua fixo em português — decisão certa, não pode variar por idioma sem fragmentar o histórico de otimização de campanha.
- **Deploy da função**: estava desatualizada no Supabase (última versão de 30/06, antes do código com idioma existir) — **Supabase não faz deploy automático a partir do GitHub como a Vercel faz**, precisa de push explícito. Já foi implantada a versão atual (v21, ACTIVE) nesta sessão.

### Tradução i18n — estado atual
O primeiro corte de tradução foi iniciado em 2026-07-12 e o bloco grande `numbers` foi completado em seguida:

- **`locales/en.json`** criado com `meta`, toda a `ui` das 3 páginas do funil e `backend` traduzidos para inglês.
- **`locales/es.json`** criado com `meta`, toda a `ui` das 3 páginas do funil e `backend` traduzidos para espanhol.
- Ambos incluem agora o bloco completo `numbers`: `leituras`, `persona`, `alma`, `aidaHook`, `ano`, `tasteLines`, `pinaculos`, `desafios`, `licoes`, `maturidade`, `equilibrio`, `ciclos`, `sequenceMap`, rótulos curtos, cores e metadados.
- Validação local: JSON parse OK, cobertura 100% das chaves de `numbers` contra `pt.json`, placeholders preservados (`{grau}`), e contagem estrutural de tags HTML preservada nos blocos longos de leitura.

As traduções longas foram geradas como primeiro corte operacional, via script (`scripts/translate-numbers.mjs` + `scripts/repair-number-html-translations.mjs`) chamando o endpoint não-oficial do Google Translate (`translate.googleapis.com`), sem revisão humana/editorial. Antes de liberar EN/ES para tráfego público, ainda falta QA visual/editorial: conferir tom, termos numerológicos, quebras no PDF e fluxo real de compra/entrega.

**Bug corrigido (2026-07-12, sessão de revisão) — `numbers.aidaHook.{N}.insight`, os 12 números centrais (1,2,3,4,5,6,7,8,9,11,22,33):** o script de tradução preservava tags HTML traduzindo os fragmentos de texto ao redor de `<strong>` isoladamente, o que quebrou a gramática nas duas línguas nesse campo específico (é o gancho de persuasão mostrado na página de resultado, então é visível e de alto impacto).
- **EN corrigido:** todos os 12 insights agora começam com a construção correta, ex. `"The **Life Path 1** is not about ambition..."`.
- **ES corrigido:** todos os 12 insights agora usam `"Camino de Vida N"` e frase natural, ex. `"El **Camino de Vida 1** no se trata de ambición..."`.
- Também foram corrigidos vazamentos terminológicos encontrados na mesma varredura: `Alma` dentro do inglês, `Soul`/`Life Path`/`Personal Year`/`Pinnacles` dentro do espanhol.
- Validação pós-correção: JSON parse OK, cobertura `numbers` 376/376 em EN e ES, placeholders preservados, tags/atributos HTML idênticos aos do `pt.json`, sem `?` corrompido no meio de palavras/frases e sem vazamento dos termos acima.

**Segunda rodada de correção (2026-07-12, verificação independente pós-fix):** ao reverificar o fix acima campo a campo (não só o commit message), a varredura por termos ainda achou vazamentos que a rodada anterior não cobriu — concentrados quase todos em `numbers.leituras.{N}.caminho` (a leitura de "Destino", um bloco grande de conteúdo):
- **ES:** "Destiny N" deixado em inglês em vez de "Destino N" — 25 ocorrências, em 10 dos 12 números (1,2,3,4,6,7,8,9,11,22). Mais 1 frase inteira em inglês (`"Your Key Challenge"`) em `aidaHook.3.taste`.
- **EN:** "Destino N" deixado em português/espanhol em vez de "Destiny N" — 10 ocorrências, em 5 números (5,8,9,11,22).
- Mais 4 vazamentos pontuais fora desse bloco: `leituras.3.alma` (EN tinha "ALMA 3" solto, ES tinha "SOUL 3" solto) e `leituras.3/22.expressao` (ES tinha "Expression" em vez de "Expresión").
- **Todos corrigidos** por substituição de termo com replace-checked (contagem de ocorrências validada antes de escrever, sem tocar no resto da frase). Revalidado depois: cobertura `numbers` 376/376 em EN/ES, zero vazamentos remanescentes dos termos verificados (`Life Path`, `Soul`, `Personal Year`, `Pinnacle`, `Expression`, `Destiny`, `Challenge` em ES; `Caminho de Vida`, `Expressão`, `Destino`, `Missão` etc. em EN), JSON válido nos dois arquivos.
- **Isso não é uma auditoria completa** — foi uma varredura por lista de termos conhecidos, não uma leitura humana de cada parágrafo. Ainda pode haver frases estranhas/tom robótico que só QA editorial humana pega (é exatamente o que os itens 1/2 da seção 2 abaixo cobrem).

**Atenção — estado atual é "traduzido em preview", não "liberado":** o risco anterior de misturar português com inglês/espanhol foi removido porque `numbers` agora está completo. Mesmo assim, **não ativar o seletor de idioma pro público até passar QA editorial/visual e gerar PDFs reais em EN/ES**, porque alguns títulos e parágrafos longos podem estourar layout.

**Mitigação aplicada:** `assets/i18n.js` agora mantém apenas `pt` habilitado para o público (`PUBLIC_ENABLED = ['pt']`). Os botões EN/ES ficam ocultos/desabilitados e qualquer cookie `sn_lang=en/es` cai de volta para PT. Para QA interno, usar `?i18n_preview=1`, que libera temporariamente os botões e o carregamento de `en.json`/`es.json`.

### Rodapé — crédito da agência (2026-07-12)
Trocado "Desenvolvido por 11 Digital" por um crédito visual mais premium — pill com borda/gradiente dourado, ponto luminoso e link pra `onzedigitalstrategy.com.br` — em `index.html` e `mapa-7-esferas.html`. Sem relação com o roadmap de i18n/Stripe, só registro de mudança visual feita na mesma janela de trabalho.

### Sincronizado com outro trabalho em paralelo no mesmo repositório
Nesta sessão foram identificados e integrados commits feitos fora desta conversa (mesma identidade Git configurada aqui, então provavelmente outra sessão sua/da equipe no mesmo repo):
- A ferramenta standalone `/mapa-7-esferas` (formulário nome+data → PDF, sem estar linkada no funil principal).
- Melhorias nas leituras do Número Psíquico + sumário (TOC) no PDF gerado.
- A própria persistência de idioma descrita acima.

Tudo testado em conjunto — sem conflito, sem regressão.

---

## 2. O que falta — Fase 1 (tradução)

RLS já resolvido (seção 0). Ordem pensada pra reduzir risco (validar com 1 idioma antes de multiplicar por 2):

1. **QA visual/editorial do inglês (`en.json`)** — revisar tom numerológico, títulos longos e textos do PDF. Testar o fluxo inteiro em inglês, **incluindo gerar um PDF de verdade** e inspecionar visualmente os pontos frágeis.
2. **QA visual/editorial do espanhol (`es.json`)** — mesmo processo: fluxo completo, PDF real, termos numerológicos e quebras de layout.
3. **QA final de entrega** — os 3 idiomas, ponta a ponta: formulário, validação, PDF, e-mail, WhatsApp. Confirmar que um lead real criado em cada idioma recebe o template certo do `vega-webhook`.
4. **Só depois de 1-3: liberar o seletor de idioma pro público.** Hoje ele já existe na UI, mas continua escondido até a revisão final.

## 3. Próximos passos — Fase 2 (Stripe)

Só começa depois da Fase 1 validada em produção. **Status: não iniciada** — confirmado em 2026-07-12, zero arquivo/referência a Stripe no repositório ainda.

1. Você cria/configura a conta Stripe (CPF ou CNPJ + dados bancários) e me passa as chaves de API (publicável + secreta) como variável de ambiente no Supabase — mesmo padrão que já usamos pro Resend e Meta CAPI.
2. Criar Edge Function `create-checkout-session` — recebe nome/e-mail/idioma do visitante, cria uma Stripe Checkout Session já no idioma e moeda certos (pt→BRL, en→USD, es→USD ou EUR a decidir), devolve o link.
3. Criar Edge Function `stripe-webhook` — substitui a Vega, escuta a confirmação de pagamento e dispara a mesma entrega (PDF + e-mail + WhatsApp) que já existe, só que lendo o idioma salvo no lead.
4. Trocar os botões de compra do site pra apontar pro Stripe em vez da Vega.
5. Testar em modo sandbox do Stripe nos 3 idiomas antes de qualquer tráfego real passar por ali.
6. Desligar a Vega só depois do Stripe validado em produção.

---

## 4. Idealização do projeto futuro

O objetivo final não é só "ter o site em 3 idiomas" — é transformar o Mapa Numerológico num produto que vende de forma consistente em qualquer mercado de língua portuguesa, inglesa ou espanhola, sem que isso vire um fardo de manutenção. Alguns pontos que orientam as decisões técnicas já tomadas:

- **Um só código-fonte, não 3 sites paralelos.** Foi essa a razão de montar o sistema de dicionário/JSON em vez de duplicar `index.html` em 3 arquivos — qualquer melhoria de conversão feita (como o timer real, a reordenação da oferta, a capa do vídeo) se aplica automaticamente aos 3 idiomas ao mesmo tempo, sem retrabalho.
- **Estrutura pronta pra crescer pra mais idiomas depois.** Alemão e francês foram cortados do escopo agora só por tempo/prioridade — a arquitetura (schema `/locales/*.json` + middleware por país) já suporta adicionar qualquer idioma novo sem mexer no HTML de novo, só traduzindo o conteúdo.
- **Stripe como base pra expansão real, não só um checkout alternativo.** Taxa menor (3,9-4,9% vs ~9% da Vega/Hotmart) e checkout que já localiza idioma/moeda sozinho — é o que destrava vender de verdade fora do Brasil, já que hoje mesmo com o site traduzido o cliente cairia num checkout em português na hora de pagar.
- **A ferramenta `/mapa-7-esferas`** é um ativo separado e pode virar, no futuro, uma porta de entrada adicional (lead magnet standalone, sem depender do funil principal) — vale considerar se ela também deveria entrar no sistema de tradução quando a Fase 1 estiver madura.
- **O canal de recuperação de leads por WhatsApp** (PDFs personalizados + copy, já montado numa sessão anterior pra leads que calcularam mas não compraram) é um processo que só existe hoje em português — quando o funil internacional estiver rodando, esse mesmo mecanismo deveria funcionar por idioma também.
- **Aprendizados de conversão já validados** (oferta aparecer primeiro, timer real de contagem regressiva, capa de vídeo com frase de impacto, remover qualquer menção a "grátis" que competisse com o preço direto) devem ser tratados como o **padrão-base** pros novos idiomas — não como algo específico do português que precisa ser redescoberto depois em inglês/espanhol.
- **Higiene de infraestrutura como hábito, não exceção.** Esta sessão achou dois exemplos do mesmo padrão de risco: uma migration escrita mas nunca aplicada, e uma Edge Function com código novo no repo mas nunca reimplantada. Nenhum dos dois dá erro visível na hora — só quebra silenciosamente em produção. Vale o hábito de, a cada mudança de banco/função, confirmar que ela realmente rodou no ambiente vivo, não só que o arquivo existe no Git.

Em resumo: a meta não é traduzir uma vitrine estática, é ter **um funil de vendas que se comporta de forma idêntica e testada em qualquer idioma**, com o mínimo de superfície de manutenção possível — e com os dados dos clientes genuinamente protegidos, não só com políticas escritas e nunca ativadas.
