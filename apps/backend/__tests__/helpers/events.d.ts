import { APIGatewayProxyEvent } from 'aws-lambda';
export interface MockEventOptions {
    userId?: string;
    pathParameters?: Record<string, string>;
    body?: string | object;
    queryStringParameters?: Record<string, string>;
}
export declare function createMockEvent(options?: MockEventOptions): APIGatewayProxyEvent;
export declare function createUnauthorizedEvent(): APIGatewayProxyEvent;
