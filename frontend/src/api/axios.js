import axios from "axios";

// Une seule instance Axios pour toute l'application.
// L'adresse du backend est modifiable via VITE_API_URL (pas un secret : tout ce qui commence
// par VITE_ est visible dans le navigateur, n'y mets jamais de clé).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8081/api",
  timeout: 45000, // le résumé Gemini peut prendre quelques secondes
});

// AVANT chaque requête : on ajoute le token JWT s'il existe.
// Le backend le lit dans l'en-tête "Authorization: Bearer xxxxx".
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// APRÈS chaque réponse : si le backend répond 401 (token expiré ou invalide),
// on déconnecte l'utilisateur. On ignore /auth : un mauvais mot de passe renvoie aussi 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;