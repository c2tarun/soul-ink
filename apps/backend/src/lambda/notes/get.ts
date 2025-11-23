import { APIGatewayProxyHandler } from 'aws-lambda';
import { CORS_HEADERS } from '../../utils/cors';
import { NotesRepository } from '../../repositories/NotesRepository';

const notesRepo = new NotesRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Get note handler invoked', { event });

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

    const note = await notesRepo.getNote(userId, noteId);

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
    console.error('Get note error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Failed to get note',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
