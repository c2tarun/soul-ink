import { useNotesStore } from './store/useNotesStore';

function App() {
  const { notes, addNote, deleteNote } = useNotesStore();

  const handleAddNote = () => {
    addNote({
      title: `Note ${notes.length + 1}`,
      content: 'This is a sample note created with Zustand!',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Soul Ink Notes</h1>

        <button
          onClick={handleAddNote}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Note
        </button>

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No notes yet. Click "Add Note" to create your first note!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 mb-3">{note.content}</p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
