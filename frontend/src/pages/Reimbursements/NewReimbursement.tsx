import { Card, CardContent } from "../../components/ui/card";
import { ReimbursementForm } from "./ReimbursementForm";

export function NewReimbursement() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-white">Nova solicitação</h1>
      <Card>
        <CardContent className="p-6">
          <ReimbursementForm />
        </CardContent>
      </Card>
    </section>
  );
}
