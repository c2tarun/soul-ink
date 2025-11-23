import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare const docClient: DynamoDBDocumentClient;
export declare const TABLE_NAME: string;
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
export declare function seedNote(note: TestNote): Promise<void>;
export declare function clearTable(): Promise<void>;
export declare function createTestNote(userId: string, noteId: string, overrides?: Partial<TestNote>): TestNote;
