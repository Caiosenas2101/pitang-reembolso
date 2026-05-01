import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../../components/Feedback";
import { getApiErrorMessage } from "../../services/api";
import { getReimbursement } from "../../services/reimbursements.service";
import { Reimbursement } from "../../types/reimbursement";
import { ReimbursementForm } from "./ReimbursementForm";

export function EditReimbursement() {
  const { id } = useParams();
  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setReimbursement(await getReimbursement(id!));
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Editar solicitação</h1>
      {error && <ErrorMessage message={error} />}
      {reimbursement && <ReimbursementForm reimbursement={reimbursement} />}
    </section>
  );
}
