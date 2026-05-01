import { ReimbursementForm } from "./ReimbursementForm";

export function NewReimbursement() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Nova solicitação</h1>
      <ReimbursementForm />
    </section>
  );
}
