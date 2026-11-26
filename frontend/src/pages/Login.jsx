import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Déjà connecté ? Inutile de voir le formulaire, on va directement au Dashboard
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault(); // empêche le rechargement de la page
    setError("");
    setLoading(true);

    try {
      // Le backend renvoie { token, email } si l'email et le mot de passe sont corrects
      const { data } = await api.post("/auth/login", { email, password });

      // On garde le token : Axios l'ajoutera automatiquement aux prochaines requêtes
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response) {
        setError("Une erreur est survenue, réessaie");
      } else {
        setError("Impossible de joindre le serveur");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold text-slate-800">Connexion</h1>
        <p className="text-sm text-slate-500">Retrouve tes notes SmartNotes.</p>

        {error && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}