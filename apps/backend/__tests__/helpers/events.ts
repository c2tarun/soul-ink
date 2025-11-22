import { APIGatewayProxyEvent } from 'aws-lambda';

export interface MockEventOptions {
  userId?: string;
  pathParameters?: Record<string, string>;
  body?: string | object;
  queryStringParameters?: Record<string, string>;
}

export function createMockEvent(
  options: MockEventOptions = {}
): APIGatewayProxyEvent {
  const {
    userId = 'test-user-id',
    pathParameters = {},
    body = null,
    queryStringParameters = {},
  } = options;

  return {
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/',
    pathParameters,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: '123456789012',
      apiId: 'test-api',
      authorizer: {
        claims: {
          sub: userId,
          email: `${userId}@example.com`,
        },
      },
      protocol: 'HTTP/1.1',
      httpMethod: 'GET',
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: 'jest-test',
        userArn: null,
      },
      path: '/',
      stage: 'test',
      requestId: 'test-request-id',
      requestTimeEpoch: Date.now(),
      resourceId: 'test-resource',
      resourcePath: '/',
    },
    resource: '/',
  };
}

export function createUnauthorizedEvent(): APIGatewayProxyEvent {
  const event = createMockEvent();
  delete event.requestContext.authorizer;
  return event;
}
