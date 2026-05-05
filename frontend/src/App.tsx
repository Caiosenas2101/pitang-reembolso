import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";
import { Categories } from "./pages/Categories/Categories";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/Login/Login";
import { EditReimbursement } from "./pages/Reimbursements/EditReimbursement";
import { NewReimbursement } from "./pages/Reimbursements/NewReimbursement";
import { ReimbursementDetails } from "./pages/Reimbursements/ReimbursementDetails";
import { Users } from "./pages/Users/Users";

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user?.perfil === "ADMIN" ? children : <Navigate to="/reimbursements" replace />;
}

function CollaboratorRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user?.perfil === "COLABORADOR" ? children : <Navigate to="/reimbursements" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/reimbursements" element={<Dashboard />} />
          <Route
            path="/reimbursements/new"
            element={
              <CollaboratorRoute>
                <NewReimbursement />
              </CollaboratorRoute>
            }
          />
          <Route path="/reimbursements/:id" element={<ReimbursementDetails />} />
          <Route
            path="/reimbursements/:id/edit"
            element={
              <CollaboratorRoute>
                <EditReimbursement />
              </CollaboratorRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
