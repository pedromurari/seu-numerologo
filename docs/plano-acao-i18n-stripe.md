# Plano de Ação — Internacionalização (i18n) + Migração Stripe

> Documento de referência do projeto "Seu Numerólogo". Última atualização: sessão de implementação da infraestrutura i18n (pt/en/es), commit `8b5ca31`.

---

## 1. Status atual — o que já está no ar

### Infraestrutura i18n (Fase 1 — parcial)
- **`locales/pt.json`** — schema completo de tradução extraído do código real via script (não retranscrito à mão): 19 dicionários por número (Caminho de Vida 1-9, 11, 22, 33), toda a UI estática das 3 páginas (`index.html`, `obrigado.html`, `upsell.html`) e os templates de WhatsApp/e-mail do backend. ~24-32 mil palavras.
- **`assets/i18n.js`** — runtime que lê o cookie `sn_lang`, carrega `/locales/{lang}.json` e aplica em todo elemento `[data-i18n]` da página.
- **196 elementos tagueados** com `data-i18n` nas 3 páginas do funil.
- Dicionários por número (`TITULOS`, `LEITURAS`, `PERSONA_TEXT`, `ALMA_TEXT`, `AIDA_HOOK`, etc.) convertidos de `const` pra `var` e repopulados a partir do JSON carregado — a lógica de cálculo numerológico não mudou em nada.
- **`middleware.js`** — Vercel Edge Middleware detecta o país do visitante (header `x-vercel-ip-country`, grátis, populado automaticamente) e seta o cookie `sn_lang` na primeira visita.
- **Seletor manual de idioma** (PT / EN / ES) nas 3 páginas, como opção de troca manual — sempre visível, sobrescreve a detecção automática.

### O que isso significa na prática hoje
O site funciona **exatamente igual a antes** — porque só existe `pt.json`. Nada muda visualmente até que `en.json` e `es.json` sejam criados (próximo passo). A infraestrutura está pronta e testada; falta o conteúdo traduzido.

### Sincronizado com o trabalho do Igor
Nesta mesma sessão, foram puxadas e integradas 3 melhorias que o Igor subiu direto no repositório (fora desta sessão): a ferramenta standalone `/mapa-7-esferas` (formulário nome+data → PDF, sem estar linkada no funil principal), melhorias nas leituras do Número Psíquico, e um sumário (TOC) no PDF gerado. Tudo testado em conjunto com as mudanças de i18n — sem conflito.

---

## 2. Próximos passos — Fase 1 (tradução)

### Atualização implementada — 2026-07-09

- **Seletor manual de idioma corrigido** em `assets/i18n.js`: grava `sn_lang` com `Path=/`, `Max-Age`, `SameSite=Lax`, `Secure` em HTTPS, mantém fallback em `localStorage` e atualiza o estado visual ativo antes do reload.
- **Idioma capturado no lead** em `index.html`: o campo `language` agora acompanha `lead`, `calculou`, `checkout` e o PATCH do `pdf_path`; os links do checkout atual também recebem `lang` na query string.
- **Migration adicionada** em `supabase/migrations/20260709_language_column.sql`: cria/normaliza `seu_numerologo_leads.language` com valores `pt`, `en`, `es`.
- **Backend preparado por idioma** em `supabase/functions/vega-webhook/index.ts`: PIX pendente, WhatsApp de entrega e e-mail de boas-vindas escolhem template por `language` salvo no lead; `content_name` da CAPI continua fixo em português.
- **Fase Stripe ainda não ativada**: o checkout Vega permanece em produção até existirem chaves Stripe, sandbox testado nos 3 idiomas e decisão final de moeda para espanhol.

Ordem pensada pra reduzir risco (validar com 1 idioma antes de multiplicar por 2):

1. **Corrigir o seletor manual de idioma** — hoje tem um bug onde o clique não está persistindo o cookie corretamente (em investigação quando a sessão foi interrompida). Baixo risco: enquanto não existem `en.json`/`es.json`, o botão não tem efeito visível mesmo funcionando 100%, mas precisa ser corrigido antes do lançamento real dos outros idiomas.
2. **Traduzir para inglês (`en.json`)** — as ~24-32 mil palavras de copy emocional/venda, mantendo o tom (não é tradução literal — numerologia tem nuance que tradução automática erra). Depois, testar o fluxo inteiro em inglês, **incluindo gerar um PDF de verdade** e inspecionar visualmente os pontos identificados como frágeis (títulos longos em posição fixa no PDF).
3. **Traduzir para espanhol (`es.json`)** — mesmo processo.
4. **Adicionar coluna `language`** na tabela `seu_numerologo_leads` (migration nova), capturada no momento em que o lead preenche o formulário.
5. **Templates do backend por idioma** — o Edge Function que envia e-mail (Resend) e WhatsApp após a compra precisa ler `language` do lead e escolher o template certo (pt/en/es).
6. **QA final** — os 3 idiomas, ponta a ponta: formulário, validação, PDF, e-mail, WhatsApp, e conferir que os eventos do Meta Pixel continuam com `content_name` fixo em português (não pode variar por idioma, senão quebra o histórico de otimização de campanha).

## 3. Próximos passos — Fase 2 (Stripe)

Só começa depois da Fase 1 validada em produção.

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
- **Stripe como base pra expansão real, não só like um checkout alternativo.** Taxa menor (3,9-4,9% vs ~9% da Vega/Hotmart) e checkout que já localiza idioma/moeda sozinho — é o que destrava vender de verdade fora do Brasil, já que hoje mesmo com o site traduzido o cliente cairia num checkout em português na hora de pagar.
- **A ferramenta `/mapa-7-esferas` do Igor** é um ativo separado e pode virar, no futuro, uma porta de entrada adicional (lead magnet standalone, sem depender do funil principal) — vale considerar se ela também deveria entrar no sistema de tradução quando a Fase 1 estiver madura.
- **O canal de recuperação de leads por WhatsApp** (PDFs personalizados + copy, já montado numa sessão anterior pra leads que calcularam mas não compraram) é um processo que só existe hoje em português — quando o funil internacional estiver rodando, esse mesmo mecanismo deveria funcionar por idioma também.
- **Aprendizados de conversão já validados nesta sessão** (oferta aparecer primeiro, timer real de contagem regressiva, capa de vídeo com frase de impacto, remover qualquer menção a "grátis" que competisse com o preço direto) devem ser tratados como o **padrão-base** pros novos idiomas — não como algo específico do português que precisa ser redescoberto depois em inglês/espanhol.

Em resumo: a meta não é traduzir uma vitrine estática, é ter **um funil de vendas que se comporta de forma idêntica e testada em qualquer idioma**, com o mínimo de superfície de manutenção possível.
