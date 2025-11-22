"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const cors_1 = require("../utils/cors");
const handler = async (event) => {
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
            headers: cors_1.CORS_HEADERS,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Echo handler error:', error);
        return {
            statusCode: 500,
            headers: cors_1.CORS_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjaG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQTZDO0FBRXRDLE1BQU0sT0FBTyxHQUEyQixLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDO1FBQ0gscUJBQXFCO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFdEQsb0RBQW9EO1FBQ3BELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU07WUFDekQsQ0FBQyxDQUFDO2dCQUNFLFFBQVEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3BFLEdBQUcsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztnQkFDL0MsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLO2FBQ3BEO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVULHNCQUFzQjtRQUN0QixNQUFNLFFBQVEsR0FBRztZQUNmLE9BQU8sRUFBRSxpQ0FBaUM7WUFDMUMsWUFBWSxFQUFFLElBQUk7WUFDbEIsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ25DLFdBQVc7WUFDWCxTQUFTLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTO1lBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDakIsQ0FBQztRQUVGLE9BQU87WUFDTCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxtQkFBWTtZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7U0FDL0IsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QyxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsbUJBQVk7WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSx1QkFBdUI7Z0JBQ2hDLEtBQUssRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO2FBQ2hFLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQztBQTVDVyxRQUFBLE9BQU8sV0E0Q2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5SGFuZGxlciB9IGZyb20gJ2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ09SU19IRUFERVJTIH0gZnJvbSAnLi4vdXRpbHMvY29ycyc7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyOiBBUElHYXRld2F5UHJveHlIYW5kbGVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdFY2hvIGhhbmRsZXIgaW52b2tlZCcsIHsgZXZlbnQgfSk7XG5cbiAgdHJ5IHtcbiAgICAvLyBQYXJzZSByZXF1ZXN0IGJvZHlcbiAgICBjb25zdCBib2R5ID0gZXZlbnQuYm9keSA/IEpTT04ucGFyc2UoZXZlbnQuYm9keSkgOiB7fTtcblxuICAgIC8vIEV4dHJhY3QgQ29nbml0byB1c2VyIGluZm8gZnJvbSBhdXRob3JpemVyIGNvbnRleHRcbiAgICBjb25zdCBjb2duaXRvVXNlciA9IGV2ZW50LnJlcXVlc3RDb250ZXh0LmF1dGhvcml6ZXI/LmNsYWltc1xuICAgICAgPyB7XG4gICAgICAgICAgdXNlcm5hbWU6IGV2ZW50LnJlcXVlc3RDb250ZXh0LmF1dGhvcml6ZXIuY2xhaW1zWydjb2duaXRvOnVzZXJuYW1lJ10sXG4gICAgICAgICAgc3ViOiBldmVudC5yZXF1ZXN0Q29udGV4dC5hdXRob3JpemVyLmNsYWltcy5zdWIsXG4gICAgICAgICAgZW1haWw6IGV2ZW50LnJlcXVlc3RDb250ZXh0LmF1dGhvcml6ZXIuY2xhaW1zLmVtYWlsLFxuICAgICAgICB9XG4gICAgICA6IG51bGw7XG5cbiAgICAvLyBCdWlsZCBlY2hvIHJlc3BvbnNlXG4gICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICBtZXNzYWdlOiAnRWNobyByZXNwb25zZSBmcm9tIFNvdWwgSW5rIEFQSScsXG4gICAgICByZWNlaXZlZEJvZHk6IGJvZHksXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGNvZ25pdG9Vc2VyLFxuICAgICAgcmVxdWVzdElkOiBldmVudC5yZXF1ZXN0Q29udGV4dC5yZXF1ZXN0SWQsXG4gICAgICBodHRwTWV0aG9kOiBldmVudC5odHRwTWV0aG9kLFxuICAgICAgcGF0aDogZXZlbnQucGF0aCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGhlYWRlcnM6IENPUlNfSEVBREVSUyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSxcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0VjaG8gaGFuZGxlciBlcnJvcjonLCBlcnJvcik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgaGVhZGVyczogQ09SU19IRUFERVJTLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXNzYWdlOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyxcbiAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==