# Backend - Controle de Solicitações de Reembolso

API RESTful em Node.js, Express, TypeScript, Prisma, JWT e Zod.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Se o `prisma migrate dev` falhar por problema local do schema engine, use o inicializador SQLite:

```bash
npm run db:init
npm run dev
```

API: `http://localhost:3333`

## Testes

Para validar build e testes:

```bash
npm run build
npm test
```

A suíte de testes cobre os pontos obrigatórios principais do backend:

- Healthcheck da API.
- Bloqueio de rotas privadas sem token.
- Validação de payload com Zod.
- Login com JWT e rejeição de credenciais inválidas.
- Permissão por perfil, incluindo criação de categoria apenas por `ADMIN`.
- Fluxo principal de reembolso: criar, editar rascunho, enviar, aprovar e pagar.
- Bloqueio de aprovação por perfil inválido.
- Bloqueio de edição após status `PAGO`.
- Histórico gerado para `CREATED`, `UPDATED`, `SUBMITTED`, `APPROVED` e `PAID`.
- Rejeição com justificativa obrigatória.
- Bloqueio de solicitação com categoria inativa.
- Validação de tipos permitidos em anexos simulados.

## Usuários de teste

Todos usam a senha `123456`.

- `colaborador@teste.com` - `COLABORADOR`
- `gestor@teste.com` - `GESTOR`
- `financeiro@teste.com` - `FINANCEIRO`
- `admin@teste.com` - `ADMIN`

## Principais rotas

- `POST /auth/login`
- `POST /users`
- `GET /users`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `GET /reimbursements` - aceita `status`, `categoriaId`, `colaborador`, `sortBy=dataDespesa|valor` e `sortOrder=asc|desc`
- `POST /reimbursements`
- `GET /reimbursements/:id`
- `PUT /reimbursements/:id`
- `POST /reimbursements/:id/submit`
- `POST /reimbursements/:id/approve`
- `POST /reimbursements/:id/reject`
- `POST /reimbursements/:id/pay`
- `POST /reimbursements/:id/cancel`
- `GET /reimbursements/:id/history`
- `POST /reimbursements/:id/attachments`
- `GET /reimbursements/:id/attachments`

## Decisões técnicas

- O backend usa uma arquitetura simples por camadas: routes, controllers, services, repositories, schemas e middlewares.
- As regras de negócio ficam nos services.
- O Prisma concentra a persistência.
- O Zod valida body, params e query antes da regra de negócio.
- O JWT identifica o usuário logado.
- O RBAC bloqueia ações por perfil.
- Toda ação relevante em solicitação gera histórico.
- Upload de anexo é simulado com nome, URL e tipo do arquivo.
