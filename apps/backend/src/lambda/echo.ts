import { APIGatewayProxyHandler } from 'aws-lambda';
import { CORS_HEADERS } from '../utils/cors';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Echo handler invoked', { event });

  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};

    // Extract Cognito user info from authorizer context
    const cognitoUser = event.requestContext.authorizer?.claims
      ? {
          username: event.requestContext.authorizer.claims['cognito:username'],
          sub: event.requestContext.authorizer.claims.sub,
          email: event.requestContext.authorizer.claims.email,
        }
      : null;

    // Build echo response
    const response = {
      message: 'Echo response from Soul Ink API',
      receivedBody: body,
      timestamp: new Date().toISOString(),
      cognitoUser,
      requestId: event.requestContext.requestId,
      httpMethod: event.httpMethod,
      path: event.path,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Echo handler error:', error);

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
