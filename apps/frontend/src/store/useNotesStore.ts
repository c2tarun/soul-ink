import { create } from 'zustand';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@soul-ink/shared';

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  addNote: (input: CreateNoteInput) => string;
  updateNote: (input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  getNote: (id: string) => Note | undefined;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNoteId: null,

  addNote: (input: CreateNoteInput) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      notes: [newNote, ...state.notes],
      selectedNoteId: newNote.id,
    }));
    return newNote.id;
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
      ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    }));
  },

  deleteNote: (id: string) => {
    set((state) => {
      const filteredNotes = state.notes.filter((note) => note.id !== id);
      return {
        notes: filteredNotes,
        selectedNoteId: state.selectedNoteId === id
          ? (filteredNotes.length > 0 ? filteredNotes[0].id : null)
          : state.selectedNoteId,
      };
    });
  },

  selectNote: (id: string | null) => {
    set({ selectedNoteId: id });
  },

  getNote: (id: string) => {
    return get().notes.find((note) => note.id === id);
  },
}));
