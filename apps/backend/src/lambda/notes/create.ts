import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { CORS_HEADERS } from '../../utils/cors';
import { NotesRepository } from '../../repositories/NotesRepository';

const notesRepo = new NotesRepository();

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
    const note = await notesRepo.createNote(userId, noteId, title, content);

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ note }),
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
