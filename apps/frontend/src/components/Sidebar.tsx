import { useNotesStore } from '../store/useNotesStore';

export function Sidebar() {
  const { notes, selectedNoteId, addNote, deleteNote, selectNote } =
    useNotesStore();

  const handleNewNote = () => {
    addNote({
      title: 'Untitled',
      content: '',
    });
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const note = notes.find((n) => n.id === id);
    const isUntitled = note?.title.trim() === 'Untitled';
    const isEmpty =
      (!note?.title.trim() || isUntitled) && !note?.content.trim();

    if (isEmpty || confirm('Delete this note?')) {
      deleteNote(id);
    }
  };

  const getPreview = (content: string) => {
    return content.split('\n')[0].slice(0, 60) || 'No content';
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Soul Ink</h1>
          <button
            onClick={handleNewNote}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            New Note
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No notes yet. Create your first note!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedNoteId === note.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">
                  {note.title || 'Untitled'}
                </h3>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="ml-2 text-gray-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {getPreview(note.content)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
