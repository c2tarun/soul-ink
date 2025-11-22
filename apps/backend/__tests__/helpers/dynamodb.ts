import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'local-env',
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = process.env.TABLE_NAME || 'test-notes-table';

export interface TestNote {
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

export async function seedNote(note: TestNote): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: note,
    })
  );
}

export async function clearTable(): Promise<void> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  if (result.Items && result.Items.length > 0) {
    await Promise.all(
      result.Items.map((item) =>
        docClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: item.PK,
              SK: item.SK,
            },
          })
        )
      )
    );
  }
}

export function createTestNote(
  userId: string,
  noteId: string,
  overrides: Partial<TestNote> = {}
): TestNote {
  const now = new Date().toISOString();
  return {
    PK: `USER#${userId}`,
    SK: `NOTE#${noteId}`,
    GSI_PK: `USER#${userId}`,
    GSI_SK: `${now}#${noteId}`,
    id: noteId,
    userId,
    title: 'Test Note',
    content: 'Test content',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
