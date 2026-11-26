import { Navigate } from "react-router-dom";

// Bloque l'accès à une page si l'utilisateur n'est pas connecté.
// Attention : ce contrôle ne sert qu'à l'affichage. La vraie sécurité est dans le backend,
// qui vérifie le token à chaque requête.
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}