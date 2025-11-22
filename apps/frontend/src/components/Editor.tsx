import { useEffect, useState, useCallback, useRef } from 'react';
import { useNotesStore } from '../store/useNotesStore';

export function Editor() {
  const { notes, selectedNoteId, updateNote } = useNotesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const debounceTimerRef = useRef<number | null>(null);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
  }, [selectedNote?.id]);

  const debouncedUpdate = useCallback(
    (id: string, updates: { title?: string; content?: string }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updateNote({ id, ...updates });
      }, 500);
    },
    [updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (selectedNoteId) {
      debouncedUpdate(selectedNoteId, { title: newTitle });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (selectedNoteId) {
      debouncedUpdate(selectedNoteId, { content: newContent });
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!selectedNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No note selected</h3>
          <p className="text-gray-500">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      <div className="p-6 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
        />
        <div className="mt-2 text-xs text-gray-400">
          Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="w-full h-full text-gray-800 placeholder-gray-400 border-none focus:outline-none focus:ring-0 resize-none font-mono"
        />
      </div>
    </div>
  );
}
