# Backend - Controle de Solicitações de Reembolso

API RESTful em Node.js, Express, TypeScript, Prisma, JWT e Zod.

As instruções para instalar, preparar banco, rodar e validar o projeto ficam no [README principal](../README.md). Aqui ficam apenas os detalhes do backend.

## O que o backend faz

- Autentica usuários com JWT.
- Valida body, params e query com Zod.
- Aplica permissões por perfil.
- Persiste dados com Prisma em SQLite.
- Controla solicitações, categorias, anexos simulados e histórico.

## Perfis

- `COLABORADOR`: cria, edita, envia, cancela e anexa nas próprias solicitações.
- `GESTOR`: aprova ou rejeita solicitações enviadas.
- `FINANCEIRO`: marca solicitações aprovadas como pagas.
- `ADMIN`: gerencia categorias e contas de usuários não administradores.

## Funcionalidades

- Login com JWT.
- Gestão de contas pelo `ADMIN`.
- Gestão de categorias com ativação/inativação.
- CRUD principal de solicitações de reembolso.
- Filtro por status/categoria e ordenação por data/valor.
- Fluxo de status: `RASCUNHO`, `ENVIADO`, `APROVADO`, `REJEITADO`, `PAGO`, `CANCELADO`.
- Histórico para ações relevantes.
- Anexos simulados por nome, URL e tipo.

## Regras principais

- Só colaborador cria solicitação.
- Categoria precisa existir e estar ativa.
- Valor deve ser maior que zero.
- Data da despesa não pode ser futura.
- Solicitações acima de `R$ 100` precisam de anexo antes do envio.
- Anexo só entra em `RASCUNHO` e aceita `PDF`, `JPG`, `JPEG` ou `PNG`.
- Colaborador só acessa as próprias solicitações.
- Gestor só aprova/rejeita `ENVIADO`.
- Financeiro só paga `APROVADO`.
- Transições inválidas são bloqueadas.

## Rotas principais

- `POST /auth/login`
- `GET|POST|DELETE /users`
- `GET|POST|PUT /categories`
- `GET|POST|PUT /reimbursements`
- `POST /reimbursements/:id/submit`
- `POST /reimbursements/:id/approve`
- `POST /reimbursements/:id/reject`
- `POST /reimbursements/:id/pay`
- `POST /reimbursements/:id/cancel`
- `GET /reimbursements/:id/history`
- `GET|POST /reimbursements/:id/attachments`

`GET /reimbursements` aceita `status`, `categoriaId`, `sortBy=dataDespesa|valor` e `sortOrder=asc|desc`.

## Estrutura

- `routes`: rotas HTTP.
- `controllers`: entrada e saída das requisições.
- `services`: regras de negócio.
- `repositories`: acesso ao Prisma.
- `schemas`: validações com Zod.
- `middlewares`: auth, permissões, validação e erros.
- `tests`: testes de integração com Jest e Supertest.

## Testes

A suíte cobre autenticação, permissões, validações, fluxo completo de reembolso, histórico, categorias inativas, data futura, anexo obrigatório acima de `R$ 100`, anexos simulados e ordenação.
