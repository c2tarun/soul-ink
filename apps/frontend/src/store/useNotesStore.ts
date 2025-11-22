import { create } from 'zustand';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@soul-ink/shared';

interface NotesState {
  notes: Note[];
  addNote: (input: CreateNoteInput) => void;
  updateNote: (input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],

  addNote: (input: CreateNoteInput) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ notes: [...state.notes, newNote] }));
  },

  updateNote: (input: UpdateNoteInput) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === input.id
          ? {
              ...note,
              ...(input.title !== undefined && { title: input.title }),
              ...(input.content !== undefined && { content: input.content }),
              updatedAt: new Date(),
            }
          : note
      ),
    }));
  },

  deleteNote: (id: string) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },

  getNote: (id: string) => {
    return get().notes.find((note) => note.id === id);
  },
}));
