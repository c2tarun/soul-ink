import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { CORS_HEADERS } from '../../utils/cors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Create note handler invoked', { event });

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

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { title, content } = body;

    if (title === undefined || content === undefined) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Title and content are required' }),
      };
    }

    // Create note
    const noteId = randomUUID();
    const now = new Date().toISOString();

    const note = {
      PK: `USER#${userId}`,
      SK: `NOTE#${noteId}`,
      GSI_PK: `USER#${userId}`,
      GSI_SK: `${now}#${noteId}`,
      id: noteId,
      userId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: note,
      })
    );

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        note: {
          id: note.id,
          userId: note.userId,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
      }),
    };
  } catch (error) {
    console.error('Create note error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Failed to create note',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
