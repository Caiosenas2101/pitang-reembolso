import { Alert } from "./ui/alert";

export function Loading() {
  return <Alert variant="muted">Carregando...</Alert>;
}

export function ErrorMessage({ message }: { message: string }) {
  return <Alert variant="destructive">{message}</Alert>;
}

export function SuccessMessage({ message }: { message: string }) {
  return <Alert variant="success">{message}</Alert>;
}

export function EmptyState({ message }: { message: string }) {
  return <Alert variant="muted">{message}</Alert>;
}
