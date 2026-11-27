import { useState } from "react";

// Formulaire utilisé pour CRÉER une note (note = null) ou la MODIFIER (note = la note existante)
export default function NoteForm({ note, onSave, onCancel }) {
  // Si on modifie, on pré-remplit avec les valeurs actuelles de la note
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    setSaving(true);
    setError("");
    try {
      // onSave est fourni par le Dashboard : il appelle l'API puis ferme le formulaire
      await onSave({ title: title.trim(), content });
    } catch {
      setError("Impossible d'enregistrer la note, réessaie");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">
        {note ? "Modifier la note" : "Nouvelle note"}
      </h2>

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre</label>
        <input
          type="text"
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contenu</label>
        <textarea
          rows={6}
          maxLength={20000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}