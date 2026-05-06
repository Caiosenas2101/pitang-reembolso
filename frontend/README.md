# Frontend - Controle de Solicitações de Reembolso

Interface em React, TypeScript, React Router, Context API, shadcn/Tailwind e Axios.

As instruções para instalar, rodar e validar o projeto ficam no [README principal](../README.md). Aqui ficam apenas os detalhes do frontend.

## O que o frontend faz

- Exibe as telas da aplicação.
- Guarda token e usuário logado no Context API.
- Protege rotas privadas.
- Mostra ações conforme perfil e status.
- Consome a API com Axios.
- Exibe loading, erro, sucesso e estados vazios.

## Telas

- `Login`
- `Solicitações`
- `Nova solicitação`
- `Editar solicitação`
- `Detalhe da solicitação`
- `Categorias`
- `Contas`

## Funcionalidades

- Redireciona `/` para `/login`.
- Lista solicitações conforme o perfil logado.
- Filtra por status e categoria.
- Ordena por data ou valor.
- Cria e edita solicitações pelo colaborador.
- Exibe detalhes, anexos e histórico.
- Permite enviar, cancelar, aprovar, rejeitar e pagar conforme perfil/status.
- Gerencia categorias e contas na área admin.
- Limita data da despesa ao dia atual no formulário.

## Perfis na interface

- `COLABORADOR`: cria, edita, envia, cancela e anexa nas próprias solicitações.
- `GESTOR`: aprova ou rejeita solicitações enviadas.
- `FINANCEIRO`: marca solicitações aprovadas como pagas.
- `ADMIN`: gerencia categorias e contas.

## Organização

- `src/App.tsx`: rotas e proteção por perfil.
- `src/contexts/AuthContext.tsx`: autenticação.
- `src/services`: chamadas HTTP.
- `src/pages`: telas.
- `src/components/ui`: componentes base estilo shadcn.
- `src/utils/permissions.ts`: regras de exibição das ações.
- `src/utils/format.ts`: formatação com `Intl`.

## Variável de ambiente

```txt
VITE_API_URL=http://localhost:3333
```

## Testes

A suíte usa Jest + React Testing Library e cobre login, rota privada, layout por perfil, formulário de solicitação, filtro, ordenação, status e mensagens de erro.
