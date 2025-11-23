import { APIGatewayProxyHandler } from 'aws-lambda';
import { CORS_HEADERS } from '../../utils/cors';
import { NotesRepository } from '../../repositories/NotesRepository';

const notesRepo = new NotesRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Delete note handler invoked', { event });

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

    await notesRepo.deleteNote(userId, noteId);

    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  } catch (error) {
    console.error('Delete note error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Failed to delete note',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
