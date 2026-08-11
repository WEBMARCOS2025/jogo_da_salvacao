# agent-customization

Descrição
- Objetivo: Fornecer um guia reutilizável para criar, revisar e corrigir arquivos de personalização de agentes (ex.: `.instructions.md`, `.prompt.md`, `AGENTS.md`, `copilot-instructions.md`, `SKILL.md`) em repositórios.
- Escopo: Workspace-scoped (destinado a times/projetos) — pode ser adaptado para uso pessoal.

Quando usar
- Criar novas skills/agents
- Corrigir sintaxe YAML/frontmatter em arquivos de configuração de agente
- Padronizar prompts e instruções para agentes customizados

Entrada esperada
- Breve descrição do objetivo da skill/agent
- Arquivos exemplos (se existirem) e padrões desejados
- Destino (workspace-scoped ou pessoal)

Passo a passo (fluxo principal)
1. Reunir contexto: listar arquivos de agente existentes no workspace.
2. Extrair padrões: identificar blocos comuns (YAML frontmatter, campos obrigatórios).
3. Rascunhar SKILL.md inicial com: propósito, gatilhos, passos, critérios de qualidade e exemplos de prompts.
4. Validar sintaxe YAML/frontmatter e exemplos (checar formatação básica).
5. Salvar o arquivo em `.skills/<skill-name>/SKILL.md` e criar um PR ou avisar o time.
6. Iterar com o autor: incorporar feedback e tornar o texto mais específico ao projeto.

Pontos de decisão
- Se não houver arquivos de referência: perguntar ao autor se prefere um checklist curto ou um fluxo completo.
- Se houver múltiplos padrões conflitantes: recomendar consolidar ou escolher o padrão mais usado.

Critérios de qualidade (aceitação)
- Inclui: propósito claro, entrada esperada, passo a passo e exemplos de prompts.
- Frontmatter/YAML (quando aplicável) validado com sintaxe básica.
- Localização: salvo em `.skills/<skill-name>/SKILL.md` e referenciado em documentação do repositório.

Exemplos de prompts para usar com a skill
- "Crie um `SKILL.md` para revisar PRs de acessibilidade em projetos web." 
- "Gere um `SKILL.md` que padronize mensagens de commit para este repositório." 

Perguntas de refinamento (se aplicável)
- O escopo é workspace-scoped ou pessoal?
- Quer um checklist enxuto ou um workflow detalhado com etapas de revisão?
- Há padrões de frontmatter/YAML que devemos obedecer neste repositório?

Iteração
- Após o rascunho, rodar uma revisão com o autor e atualizar o arquivo.
- Opcional: adicionar templates de `prompt.md` e `instructions.md` como exemplos.

Notas de implementação
- Salvar em `.skills/agent-customization/SKILL.md` para fácil descoberta.
- Manter o arquivo conciso (máx ~500-800 palavras) e com exemplos práticos.

Exemplo rápido de uso
- Prompt: "Use a skill `agent-customization` para gerar um SKILL.md que ajude revisões de segurança de dependências." 

Fim.
