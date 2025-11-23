import { APIGatewayProxyHandler } from 'aws-lambda';
import { CORS_HEADERS } from '../../utils/cors';
import { NotesRepository } from '../../repositories/NotesRepository';

const notesRepo = new NotesRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('List notes handler invoked', { event });

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

    const notes = await notesRepo.listNotes(userId);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ notes }),
    };
  } catch (error) {
    console.error('List notes error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Failed to list notes',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
