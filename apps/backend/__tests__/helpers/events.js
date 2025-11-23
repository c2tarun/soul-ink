"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockEvent = createMockEvent;
exports.createUnauthorizedEvent = createUnauthorizedEvent;
function createMockEvent(options = {}) {
    const { userId = 'test-user-id', pathParameters = {}, body = null, queryStringParameters = {}, } = options;
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
function createUnauthorizedEvent() {
    const event = createMockEvent();
    delete event.requestContext.authorizer;
    return event;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsMENBMERDO0FBRUQsMERBSUM7QUFoRUQsU0FBZ0IsZUFBZSxDQUM3QixVQUE0QixFQUFFO0lBRTlCLE1BQU0sRUFDSixNQUFNLEdBQUcsY0FBYyxFQUN2QixjQUFjLEdBQUcsRUFBRSxFQUNuQixJQUFJLEdBQUcsSUFBSSxFQUNYLHFCQUFxQixHQUFHLEVBQUUsR0FDM0IsR0FBRyxPQUFPLENBQUM7SUFFWixPQUFPO1FBQ0wsSUFBSSxFQUFFLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM1RCxPQUFPLEVBQUUsRUFBRTtRQUNYLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsVUFBVSxFQUFFLEtBQUs7UUFDakIsZUFBZSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxFQUFFLEdBQUc7UUFDVCxjQUFjO1FBQ2QscUJBQXFCO1FBQ3JCLCtCQUErQixFQUFFLElBQUk7UUFDckMsY0FBYyxFQUFFLElBQUk7UUFDcEIsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFLGNBQWM7WUFDekIsS0FBSyxFQUFFLFVBQVU7WUFDakIsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsTUFBTTtvQkFDWCxLQUFLLEVBQUUsR0FBRyxNQUFNLGNBQWM7aUJBQy9CO2FBQ0Y7WUFDRCxRQUFRLEVBQUUsVUFBVTtZQUNwQixVQUFVLEVBQUUsS0FBSztZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsTUFBTSxFQUFFLElBQUk7Z0JBQ1osUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUk7Z0JBQ1osVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLDZCQUE2QixFQUFFLElBQUk7Z0JBQ25DLHlCQUF5QixFQUFFLElBQUk7Z0JBQy9CLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLHFCQUFxQixFQUFFLElBQUk7Z0JBQzNCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixRQUFRLEVBQUUsV0FBVztnQkFDckIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7WUFDRCxJQUFJLEVBQUUsR0FBRztZQUNULEtBQUssRUFBRSxNQUFNO1lBQ2IsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzVCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLFlBQVksRUFBRSxHQUFHO1NBQ2xCO1FBQ0QsUUFBUSxFQUFFLEdBQUc7S0FDZCxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQWdCLHVCQUF1QjtJQUNyQyxNQUFNLEtBQUssR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUNoQyxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50IH0gZnJvbSAnYXdzLWxhbWJkYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9ja0V2ZW50T3B0aW9ucyB7XG4gIHVzZXJJZD86IHN0cmluZztcbiAgcGF0aFBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBib2R5Pzogc3RyaW5nIHwgb2JqZWN0O1xuICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0V2ZW50KFxuICBvcHRpb25zOiBNb2NrRXZlbnRPcHRpb25zID0ge31cbik6IEFQSUdhdGV3YXlQcm94eUV2ZW50IHtcbiAgY29uc3Qge1xuICAgIHVzZXJJZCA9ICd0ZXN0LXVzZXItaWQnLFxuICAgIHBhdGhQYXJhbWV0ZXJzID0ge30sXG4gICAgYm9keSA9IG51bGwsXG4gICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzID0ge30sXG4gIH0gPSBvcHRpb25zO1xuXG4gIHJldHVybiB7XG4gICAgYm9keTogdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgIGhlYWRlcnM6IHt9LFxuICAgIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgIHBhdGg6ICcvJyxcbiAgICBwYXRoUGFyYW1ldGVycyxcbiAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnMsXG4gICAgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogbnVsbCxcbiAgICBzdGFnZVZhcmlhYmxlczogbnVsbCxcbiAgICByZXF1ZXN0Q29udGV4dDoge1xuICAgICAgYWNjb3VudElkOiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgIGFwaUlkOiAndGVzdC1hcGknLFxuICAgICAgYXV0aG9yaXplcjoge1xuICAgICAgICBjbGFpbXM6IHtcbiAgICAgICAgICBzdWI6IHVzZXJJZCxcbiAgICAgICAgICBlbWFpbDogYCR7dXNlcklkfUBleGFtcGxlLmNvbWAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJvdG9jb2w6ICdIVFRQLzEuMScsXG4gICAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgIGlkZW50aXR5OiB7XG4gICAgICAgIGFjY2Vzc0tleTogbnVsbCxcbiAgICAgICAgYWNjb3VudElkOiBudWxsLFxuICAgICAgICBhcGlLZXk6IG51bGwsXG4gICAgICAgIGFwaUtleUlkOiBudWxsLFxuICAgICAgICBjYWxsZXI6IG51bGwsXG4gICAgICAgIGNsaWVudENlcnQ6IG51bGwsXG4gICAgICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiBudWxsLFxuICAgICAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiBudWxsLFxuICAgICAgICBjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcbiAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbElkOiBudWxsLFxuICAgICAgICBwcmluY2lwYWxPcmdJZDogbnVsbCxcbiAgICAgICAgc291cmNlSXA6ICcxMjcuMC4wLjEnLFxuICAgICAgICB1c2VyOiBudWxsLFxuICAgICAgICB1c2VyQWdlbnQ6ICdqZXN0LXRlc3QnLFxuICAgICAgICB1c2VyQXJuOiBudWxsLFxuICAgICAgfSxcbiAgICAgIHBhdGg6ICcvJyxcbiAgICAgIHN0YWdlOiAndGVzdCcsXG4gICAgICByZXF1ZXN0SWQ6ICd0ZXN0LXJlcXVlc3QtaWQnLFxuICAgICAgcmVxdWVzdFRpbWVFcG9jaDogRGF0ZS5ub3coKSxcbiAgICAgIHJlc291cmNlSWQ6ICd0ZXN0LXJlc291cmNlJyxcbiAgICAgIHJlc291cmNlUGF0aDogJy8nLFxuICAgIH0sXG4gICAgcmVzb3VyY2U6ICcvJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuYXV0aG9yaXplZEV2ZW50KCk6IEFQSUdhdGV3YXlQcm94eUV2ZW50IHtcbiAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoKTtcbiAgZGVsZXRlIGV2ZW50LnJlcXVlc3RDb250ZXh0LmF1dGhvcml6ZXI7XG4gIHJldHVybiBldmVudDtcbn1cbiJdfQ==