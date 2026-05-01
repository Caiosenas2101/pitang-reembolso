# Controle de Solicitações de Reembolso

Projeto fullstack dividido em duas partes dentro do mesmo repositório:

- `backend`: API RESTful com Node.js, Express, TypeScript, Prisma, JWT e Zod.
- `frontend`: interface React com React Router, Context API, shadcn/Tailwind e Axios.

## Instalar dependências

```bash
npm run install:all
```

Esse comando instala as dependências do `backend` e do `frontend`.

Ele é um atalho para:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Banco de dados

```bash
npm run db:init
```

Esse comando cria/prepara o banco SQLite do backend e cadastra os usuários de teste.

## Rodar localmente

Em um terminal:

```bash
npm run dev:backend
```

Em outro terminal:

```bash
npm run dev:frontend
```

URLs:

- Backend: `http://localhost:3333`
- Frontend: `http://127.0.0.1:5173`

### Por que existem dois comandos de dev?

Este é um projeto fullstack. Ele tem duas partes rodando ao mesmo tempo:

- O `backend` é a API. Ele recebe requisições, valida regras, conversa com o banco e devolve dados.
- O `frontend` é a tela que você abre no navegador. Ele chama a API para buscar, criar e atualizar dados.

Por isso, durante o desenvolvimento, os dois servidores ficam ligados:

```txt
Navegador -> Frontend React -> Backend API -> Banco de dados
```

Você acessa somente o frontend no navegador:

```txt
http://127.0.0.1:5173
```

O frontend usa o backend internamente em:

```txt
http://localhost:3333
```

### O que cada script faz?

- `npm run dev:backend`: inicia a API do backend.
- `npm run dev:frontend`: inicia a aplicação React.
- `npm run install:all`: instala as dependências das duas partes.
- `npm run db:init`: prepara o banco e os usuários de teste.
- `npm run build`: valida/gera build do backend e do frontend.
- `npm test`: roda os testes do backend e do frontend.

## Validar o projeto

```bash
npm run build
npm test
```

## Usuários de teste

Todos usam a senha `123456`.

- `colaborador@teste.com` - `COLABORADOR`
- `gestor@teste.com` - `GESTOR`
- `financeiro@teste.com` - `FINANCEIRO`
- `admin@teste.com` - `ADMIN`
