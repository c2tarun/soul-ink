import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

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

export class NotesRepository {
  private static readonly TABLE_NAME = process.env.TABLE_NAME!;
  private static readonly PK_PREFIX = 'USER#';
  private static readonly SK_PREFIX = 'NOTE#';
  private static readonly GSI_NAME = 'ByUpdatedAt';

  private docClient: DynamoDBDocumentClient;

  constructor(client?: DynamoDBClient) {
    const dynamoClient = client || new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(dynamoClient);
  }

  private buildPK(userId: string): string {
    return `${NotesRepository.PK_PREFIX}${userId}`;
  }

  private buildSK(noteId: string): string {
    return `${NotesRepository.SK_PREFIX}${noteId}`;
  }

  private buildGSI_PK(userId: string): string {
    return `${NotesRepository.PK_PREFIX}${userId}`;
  }

  private buildGSI_SK(updatedAt: string, noteId: string): string {
    return `${updatedAt}#${noteId}`;
  }

  private itemToNote(item: NoteItem): NoteData {
    return {
      id: item.id,
      userId: item.userId,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async createNote(
    userId: string,
    noteId: string,
    title: string,
    content: string
  ): Promise<NoteData> {
    const now = new Date().toISOString();

    const item: NoteItem = {
      PK: this.buildPK(userId),
      SK: this.buildSK(noteId),
      GSI_PK: this.buildGSI_PK(userId),
      GSI_SK: this.buildGSI_SK(now, noteId),
      id: noteId,
      userId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: NotesRepository.TABLE_NAME,
        Item: item,
      })
    );

    return this.itemToNote(item);
  }

  async getNote(userId: string, noteId: string): Promise<NoteData | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: NotesRepository.TABLE_NAME,
        Key: {
          PK: this.buildPK(userId),
          SK: this.buildSK(noteId),
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return this.itemToNote(result.Item as NoteItem);
  }

  async listNotes(userId: string): Promise<NoteData[]> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: NotesRepository.TABLE_NAME,
        IndexName: NotesRepository.GSI_NAME,
        KeyConditionExpression: 'GSI_PK = :pk',
        ExpressionAttributeValues: {
          ':pk': this.buildGSI_PK(userId),
        },
        ScanIndexForward: false,
      })
    );

    return (result.Items || []).map((item) => this.itemToNote(item as NoteItem));
  }

  async updateNote(
    userId: string,
    noteId: string,
    updates: { title?: string; content?: string }
  ): Promise<NoteData | null> {
    const existing = await this.getNote(userId, noteId);

    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();

    const updatedItem: NoteItem = {
      PK: this.buildPK(userId),
      SK: this.buildSK(noteId),
      GSI_PK: this.buildGSI_PK(userId),
      GSI_SK: this.buildGSI_SK(now, noteId),
      id: existing.id,
      userId: existing.userId,
      title: updates.title !== undefined ? updates.title : existing.title,
      content: updates.content !== undefined ? updates.content : existing.content,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: NotesRepository.TABLE_NAME,
        Item: updatedItem,
      })
    );

    return this.itemToNote(updatedItem);
  }

  async deleteNote(userId: string, noteId: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: NotesRepository.TABLE_NAME,
        Key: {
          PK: this.buildPK(userId),
          SK: this.buildSK(noteId),
        },
      })
    );
  }
}
