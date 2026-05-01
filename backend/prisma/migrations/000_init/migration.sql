CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senha" TEXT NOT NULL,
  "perfil" TEXT NOT NULL,
  "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nome" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Reimbursement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "solicitanteId" TEXT NOT NULL,
  "categoriaId" TEXT NOT NULL,
  "descricao" TEXT NOT NULL,
  "valor" DECIMAL NOT NULL,
  "dataDespesa" DATETIME NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
  "justificativaRejeicao" TEXT,
  "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Reimbursement_solicitanteId_fkey"
    FOREIGN KEY ("solicitanteId") REFERENCES "User" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Reimbursement_categoriaId_fkey"
    FOREIGN KEY ("categoriaId") REFERENCES "Category" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "solicitacaoId" TEXT NOT NULL,
  "nomeArquivo" TEXT NOT NULL,
  "urlArquivo" TEXT NOT NULL,
  "tipoArquivo" TEXT NOT NULL,
  "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Attachment_solicitacaoId_fkey"
    FOREIGN KEY ("solicitacaoId") REFERENCES "Reimbursement" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ReimbursementHistory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "solicitacaoId" TEXT NOT NULL,
  "usuarioId" TEXT NOT NULL,
  "acao" TEXT NOT NULL,
  "observacao" TEXT NOT NULL,
  "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReimbursementHistory_solicitacaoId_fkey"
    FOREIGN KEY ("solicitacaoId") REFERENCES "Reimbursement" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReimbursementHistory_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "User" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);
