import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage, Loading, SuccessMessage } from "../../components/Feedback";
import { StatusBadge } from "../../components/StatusBadge";
import { Button, buttonVariants } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import {
  approveReimbursement,
  cancelReimbursement,
  createAttachment,
  getReimbursement,
  listHistory,
  payReimbursement,
  rejectReimbursement,
  submitReimbursement
} from "../../services/reimbursements.service";
import { Reimbursement, ReimbursementHistory } from "../../types/reimbursement";
import { formatCurrency, formatDate, formatDateTime } from "../../utils/format";
import {
  canApproveOrReject,
  canCancel,
  canEdit,
  canPay,
  canSubmit
} from "../../utils/permissions";

export function ReimbursementDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
  const [history, setHistory] = useState<ReimbursementHistory[]>([]);
  const [rejectReason, setRejectReason] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState("PDF");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    const [reimbursementData, historyData] = await Promise.all([
      getReimbursement(id!),
      listHistory(id!)
    ]);
    setReimbursement(reimbursementData);
    setHistory(historyData);
  }

  useEffect(() => {
    async function loadPage() {
      try {
        await load();
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [id]);

  async function runAction(action: () => Promise<unknown>, message: string) {
    setError("");
    setSuccess("");

    try {
      await action();
      await load();
      setSuccess(message);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleReject(event: FormEvent) {
    event.preventDefault();

    await runAction(
      () => rejectReimbursement(id!, rejectReason),
      "Solicitação rejeitada com sucesso"
    );
    setRejectReason("");
  }

  async function handleAttachment(event: FormEvent) {
    event.preventDefault();

    await runAction(
      () =>
        createAttachment(id!, {
          nomeArquivo: attachmentName,
          urlArquivo: attachmentUrl,
          tipoArquivo: attachmentType
        }),
      "Anexo cadastrado com sucesso"
    );
    setAttachmentName("");
    setAttachmentUrl("");
    setAttachmentType("PDF");
  }

  if (loading) return <Loading />;
  if (!reimbursement) return <ErrorMessage message={error || "Solicitação não encontrada"} />;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">{reimbursement.descricao}</h1>
          <StatusBadge status={reimbursement.status} />
        </div>
        {canEdit(user, reimbursement) && (
          <Link className={buttonVariants({ variant: "outline" })} to={`/reimbursements/${reimbursement.id}/edit`}>
            Editar
          </Link>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Valor</div>
            <strong>{formatCurrency(reimbursement.valor)}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Data</div>
            <strong>{formatDate(reimbursement.dataDespesa)}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Categoria</div>
            <strong>{reimbursement.categoria?.nome ?? "-"}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Solicitante</div>
            <strong>{reimbursement.solicitante?.nome ?? "-"}</strong>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {canSubmit(user, reimbursement) && (
          <Button
            type="button"
            onClick={() =>
              runAction(() => submitReimbursement(reimbursement.id), "Solicitação enviada")
            }
          >
            Enviar para análise
          </Button>
        )}
        {canCancel(user, reimbursement) && (
          <Button
            variant="destructive"
            type="button"
            onClick={() =>
              runAction(() => cancelReimbursement(reimbursement.id), "Solicitação cancelada")
            }
          >
            Cancelar
          </Button>
        )}
        {canApproveOrReject(user, reimbursement) && (
          <Button
            type="button"
            onClick={() =>
              runAction(() => approveReimbursement(reimbursement.id), "Solicitação aprovada")
            }
          >
            Aprovar
          </Button>
        )}
        {canPay(user, reimbursement) && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => runAction(() => payReimbursement(reimbursement.id), "Pagamento marcado")}
          >
            Marcar como pago
          </Button>
        )}
      </div>

      {canApproveOrReject(user, reimbursement) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rejeição</CardTitle>
          </CardHeader>
          <CardContent>
        <form className="space-y-3" onSubmit={handleReject}>
          <Label htmlFor="rejectReason">
            Justificativa
          </Label>
          <Textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            required
          />
          <Button variant="destructive" type="submit">
            Rejeitar
          </Button>
        </form>
          </CardContent>
        </Card>
      )}

      {user?.perfil === "COLABORADOR" &&
        reimbursement.solicitanteId === user.id &&
        reimbursement.status === "RASCUNHO" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Anexo</CardTitle>
          </CardHeader>
          <CardContent>
        <form className="space-y-4" onSubmit={handleAttachment}>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px]">
            <div className="space-y-2">
              <Label htmlFor="attachmentName">
                Nome do arquivo
              </Label>
              <Input
                id="attachmentName"
                value={attachmentName}
                onChange={(event) => setAttachmentName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachmentUrl">
                URL simulada
              </Label>
              <Input
                id="attachmentUrl"
                value={attachmentUrl}
                onChange={(event) => setAttachmentUrl(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachmentType">
                Tipo
              </Label>
              <Select
                id="attachmentType"
                value={attachmentType}
                onChange={(event) => setAttachmentType(event.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="JPG">JPG</option>
                <option value="PNG">PNG</option>
              </Select>
            </div>
          </div>
          <Button variant="outline" type="submit">
            Adicionar anexo
          </Button>
        </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Anexos</h2>
        {reimbursement.anexos?.length ? (
          <div className="divide-y rounded-lg border bg-background">
            {reimbursement.anexos.map((attachment) => (
              <div className="p-3 text-sm" key={attachment.id}>
                {attachment.nomeArquivo} · {attachment.tipoArquivo}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum anexo cadastrado.</p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Histórico</h2>
        <div className="divide-y rounded-lg border bg-background">
          {history.map((item) => (
            <div className="p-3" key={item.id}>
              <div className="font-semibold">{item.acao}</div>
              <div>{item.observacao}</div>
              <div className="text-sm text-muted-foreground">
                {item.usuario?.nome ?? "-"} · {formatDateTime(item.criadoEm)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
