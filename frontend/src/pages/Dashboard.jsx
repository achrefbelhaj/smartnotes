import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = création, sinon la note modifiée

  // Résumés par id de note : { 3: { loading, text, error }, ... }
  const [summaries, setSummaries] = useState({});

  // Au chargement de la page : on récupère les notes de l'utilisateur connecté.
  // Axios ajoute le token JWT tout seul, le backend ne renvoie que SES notes.
  useEffect(() => {
    api
      .get("/notes")
      .then(({ data }) => setNotes(data))
      .catch(() => setError("Impossible de charger tes notes"))
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  }

  function openNewForm() {
    setEditingNote(null);
    setShowForm(true);
  }

  function openEditForm(note) {
    setEditingNote(note);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // remonte vers le formulaire
  }

  function closeForm() {
    setShowForm(false);
    setEditingNote(null);
  }

  function removeSummary(id) {
    setSummaries((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  // Création OU modification, selon editingNote.
  // Si l'appel échoue, l'erreur remonte au formulaire (NoteForm) qui l'affiche.
  async function handleSave(data) {
    if (editingNote) {
      const res = await api.put(`/notes/${editingNote.id}`, data);
      // La note modifiée passe en tête de liste (comme le fait le backend : tri par date)
      setNotes((prev) => [res.data, ...prev.filter((n) => n.id !== editingNote.id)]);
      removeSummary(editingNote.id); // l'ancien résumé ne correspond plus au contenu
    } else {
      const res = await api.post("/notes", data);
      setNotes((prev) => [res.data, ...prev]);
    }
    closeForm();
  }

  async function handleDelete(note) {
    if (!window.confirm(`Supprimer la note « ${note.title} » ?`)) return;
    try {
      await api.delete(`/notes/${note.id}`);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      removeSummary(note.id);
      if (editingNote?.id === note.id) closeForm();
    } catch {
      setError("Impossible de supprimer la note");
    }
  }

  // Bouton "✨ Résumer" : le backend appelle Gemini et renvoie { summary }
  async function handleSummarize(id) {
    setSummaries((prev) => ({ ...prev, [id]: { loading: true } }));
    try {
      const { data } = await api.post(`/notes/${id}/summarize`);
      setSummaries((prev) => ({ ...prev, [id]: { text: data.summary } }));
    } catch (err) {
      // Le backend renvoie un message clair (quota atteint, service indisponible...)
      const message = err.response?.data?.message ?? "Impossible de générer le résumé";
      setSummaries((prev) => ({ ...prev, [id]: { error: message } }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre du haut */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-xl font-bold text-indigo-600">SmartNotes</h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
            <button
              onClick={logout}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-800">Mes notes</h2>
          {!showForm && (
            <button
              onClick={openNewForm}
              className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              + Nouvelle note
            </button>
          )}
        </div>

        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        {/* key : réinitialise le formulaire quand on passe d'une note à l'autre */}
        {showForm && (
          <NoteForm
            key={editingNote?.id ?? "new"}
            note={editingNote}
            onSave={handleSave}
            onCancel={closeForm}
          />
        )}

        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : notes.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
            Aucune note pour le moment. Clique sur « + Nouvelle note » pour commencer.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                summary={summaries[note.id]}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onSummarize={handleSummarize}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}