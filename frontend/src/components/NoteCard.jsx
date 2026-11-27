// Affiche UNE note avec ses boutons.
// summary = { loading, text, error } ou undefined s'il n'y a pas encore de résumé.
export default function NoteCard({ note, summary, onEdit, onDelete, onSummarize }) {
  const date = new Date(note.updatedAt).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Pas de contenu = rien à résumer
  const canSummarize = note.content?.trim() && !summary?.loading;

  return (
    <article className="flex flex-col rounded-xl bg-white p-5 shadow">
      <h3 className="break-words text-lg font-semibold text-slate-800">{note.title}</h3>
      <p className="mb-3 text-xs text-slate-400">Modifiée le {date}</p>

      {/* React échappe le texte : du HTML saisi dans une note s'affiche tel quel, sans danger */}
      <p className="mb-4 line-clamp-6 whitespace-pre-wrap break-words text-sm text-slate-600">
        {note.content}
      </p>

      {/* Zone du résumé Gemini */}
      {summary?.loading && (
        <p className="mb-4 rounded bg-slate-100 p-3 text-sm text-slate-500">
          Résumé en cours...
        </p>
      )}
      {summary?.error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{summary.error}</p>
      )}
      {summary?.text && (
        <div className="mb-4 rounded bg-indigo-50 p-3 text-sm text-indigo-900">
          <p className="mb-1 font-semibold">✨ Résumé</p>
          <p className="whitespace-pre-wrap break-words">{summary.text}</p>
        </div>
      )}

      {/* mt-auto : les boutons restent en bas de la carte */}
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          onClick={() => onSummarize(note.id)}
          disabled={!canSummarize}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          ✨ Résumer
        </button>
        <button
          onClick={() => onEdit(note)}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(note)}
          className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Supprimer
        </button>
      </div>
    </article>
  );
}