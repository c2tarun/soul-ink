import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export interface NoteItem {
    PK: string;
    SK: string;
    GSI_PK: string;
    GSI_SK: string;
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
export interface NoteData {
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
export declare class NotesRepository {
    private static readonly TABLE_NAME;
    private static readonly PK_PREFIX;
    private static readonly SK_PREFIX;
    private static readonly GSI_NAME;
    private docClient;
    constructor(client?: DynamoDBClient);
    private buildPK;
    private buildSK;
    private buildGSI_PK;
    private buildGSI_SK;
    private itemToNote;
    createNote(userId: string, noteId: string, title: string, content: string): Promise<NoteData>;
    getNote(userId: string, noteId: string): Promise<NoteData | null>;
    listNotes(userId: string): Promise<NoteData[]>;
    updateNote(userId: string, noteId: string, updates: {
        title?: string;
        content?: string;
    }): Promise<NoteData | null>;
    deleteNote(userId: string, noteId: string): Promise<void>;
}
