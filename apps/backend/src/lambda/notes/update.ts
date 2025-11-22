import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { CORS_HEADERS } from '../../utils/cors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Update note handler invoked', { event });

  try {
    // Get userId from Cognito authorizer
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    // Get noteId from path parameters
    const noteId = event.pathParameters?.id;
    if (!noteId) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Note ID is required' }),
      };
    }

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { title, content } = body;

    // At least one field must be provided
    if (title === undefined && content === undefined) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: 'At least one of title or content must be provided',
        }),
      };
    }

    // Get existing note to verify ownership and get current data
    const existing = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `NOTE#${noteId}`,
        },
      })
    );

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Note not found' }),
      };
    }

    // Update note
    const now = new Date().toISOString();

    const updatedNote = {
      ...existing.Item,
      title: title !== undefined ? title : existing.Item.title,
      content: content !== undefined ? content : existing.Item.content,
      updatedAt: now,
      GSI_SK: `${now}#${noteId}`, // Update GSI sort key with new timestamp
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: updatedNote,
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        note: {
          id: existing.Item.id,
          userId: existing.Item.userId,
          title: updatedNote.title,
          content: updatedNote.content,
          createdAt: existing.Item.createdAt,
          updatedAt: updatedNote.updatedAt,
        },
      }),
    };
  } catch (error) {
    console.error('Update note error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Failed to update note',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
