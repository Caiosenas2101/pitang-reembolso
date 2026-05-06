# Controle de Solicitações de Reembolso

Projeto fullstack dividido em duas partes dentro do mesmo repositório:

- `backend`: API RESTful com Node.js, Express, TypeScript, Prisma, JWT e Zod.
- `frontend`: interface React com React Router, Context API, shadcn/Tailwind e Axios.

## Antes de começar

Para apenas ver o código pelo GitHub, não precisa baixar nada.

Para rodar o projeto no computador, instale:

- `Node.js`: para instalar dependências e rodar backend/frontend.
- `SQLite`: para criar e consultar o banco local.

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

### Como ver o que está salvo no banco

O banco usado localmente é SQLite e fica neste arquivo:

```txt
backend/prisma/dev.db
```

Esse é o banco da aplicação em desenvolvimento. Reiniciar o backend não apaga esses dados.

Os testes usam outro arquivo separado:

```txt
backend/prisma/test.db
```

Assim, rodar `npm test` não limpa os dados que você criou usando a aplicação.

Para abrir o banco pelo terminal:

```bash
sqlite3 backend/prisma/dev.db
```

Dentro do prompt `sqlite>`, liste as tabelas:

```sql
.tables
```

Para deixar a saída mais legível:

```sql
.headers on
.mode column
```

Consultar usuários:

```sql
SELECT id, nome, email, perfil FROM User;
```

Consultar categorias:

```sql
SELECT id, nome, ativo FROM Category;
```

Consultar solicitações:

```sql
SELECT id, descricao, valor, status, solicitanteId, categoriaId FROM Reimbursement;
```

Consultar histórico:

```sql
SELECT id, acao, observacao, solicitacaoId, usuarioId, criadoEm FROM ReimbursementHistory;
```

Consultar anexos:

```sql
SELECT id, nomeArquivo, tipoArquivo, urlArquivo, solicitacaoId FROM Attachment;
```

Para sair do SQLite:

```sql
.exit
```

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
