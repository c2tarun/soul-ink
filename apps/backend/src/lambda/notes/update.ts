import { APIGatewayProxyHandler } from 'aws-lambda';
import { CORS_HEADERS } from '../../utils/cors';
import { NotesRepository } from '../../repositories/NotesRepository';

const notesRepo = new NotesRepository();

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

    const note = await notesRepo.updateNote(userId, noteId, { title, content });

    if (!note) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Note not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ note }),
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
