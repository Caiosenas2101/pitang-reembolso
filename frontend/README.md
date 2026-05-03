# Frontend - Controle de Solicitações de Reembolso

Interface em React, React Router, Context API, shadcn/Tailwind e Axios.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Aplicação: `http://127.0.0.1:5173`

O backend deve estar rodando em `http://localhost:3333`.

## Testes

O frontend usa Jest + React Testing Library.

```bash
npm run build
npm test
```

A suíte cobre renderização de componentes, rota privada, mensagem de erro no login,
renderização condicional por perfil e envio do formulário de solicitação.

## Funcionalidades obrigatórias cobertas

- Login com armazenamento de token e usuário no Context API.
- Cadastro de usuário.
- Rotas privadas.
- Listagem de solicitações conforme o perfil retornado pela API.
- Filtro de solicitações por status e categoria.
- Criação e edição de solicitação pelo colaborador.
- Detalhe da solicitação com status, anexos e histórico.
- Ações por perfil/status: enviar, cancelar, aprovar, rejeitar e pagar.
- Gestão de categorias pelo admin.
- Mensagens visuais de carregamento, erro, sucesso e lista vazia.
- Consumo da API com Axios.
