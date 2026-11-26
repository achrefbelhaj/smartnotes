import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Vérifications côté navigateur (le backend les refait de toute façon)
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      // Après l'inscription, le backend renvoie directement un token : l'utilisateur est connecté
      const { data } = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setError(err.response.data?.message ?? "Cet email est déjà utilisé");
      } else if (status === 400) {
        setError("Email invalide ou mot de passe trop court");
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
        <h1 className="text-2xl font-bold text-slate-800">Créer un compte</h1>
        <p className="text-sm text-slate-500">Quelques secondes suffisent.</p>

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
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Mot de passe (6 caractères minimum)
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}