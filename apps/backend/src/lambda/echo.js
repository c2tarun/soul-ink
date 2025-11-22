"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
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
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        console.error('Echo handler error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjaG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sTUFBTSxPQUFPLEdBQTJCLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUUvQyxJQUFJLENBQUM7UUFDSCxxQkFBcUI7UUFDckIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV0RCxvREFBb0Q7UUFDcEQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsTUFBTTtZQUN6RCxDQUFDLENBQUM7Z0JBQ0UsUUFBUSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztnQkFDcEUsR0FBRyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHO2dCQUMvQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUs7YUFDcEQ7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVQsc0JBQXNCO1FBQ3RCLE1BQU0sUUFBUSxHQUFHO1lBQ2YsT0FBTyxFQUFFLGlDQUFpQztZQUMxQyxZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7WUFDbkMsV0FBVztZQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVM7WUFDekMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtTQUNqQixDQUFDO1FBRUYsT0FBTztZQUNMLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLDZCQUE2QixFQUFFLEdBQUc7Z0JBQ2xDLGtDQUFrQyxFQUFFLE1BQU07YUFDM0M7WUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7U0FDL0IsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QyxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsNkJBQTZCLEVBQUUsR0FBRztnQkFDbEMsa0NBQWtDLEVBQUUsTUFBTTthQUMzQztZQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNuQixPQUFPLEVBQUUsdUJBQXVCO2dCQUNoQyxLQUFLLEVBQUUsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZTthQUNoRSxDQUFDO1NBQ0gsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDLENBQUM7QUFwRFcsUUFBQSxPQUFPLFdBb0RsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUhhbmRsZXIgfSBmcm9tICdhd3MtbGFtYmRhJztcblxuZXhwb3J0IGNvbnN0IGhhbmRsZXI6IEFQSUdhdGV3YXlQcm94eUhhbmRsZXIgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgY29uc29sZS5sb2coJ0VjaG8gaGFuZGxlciBpbnZva2VkJywgeyBldmVudCB9KTtcblxuICB0cnkge1xuICAgIC8vIFBhcnNlIHJlcXVlc3QgYm9keVxuICAgIGNvbnN0IGJvZHkgPSBldmVudC5ib2R5ID8gSlNPTi5wYXJzZShldmVudC5ib2R5KSA6IHt9O1xuXG4gICAgLy8gRXh0cmFjdCBDb2duaXRvIHVzZXIgaW5mbyBmcm9tIGF1dGhvcml6ZXIgY29udGV4dFxuICAgIGNvbnN0IGNvZ25pdG9Vc2VyID0gZXZlbnQucmVxdWVzdENvbnRleHQuYXV0aG9yaXplcj8uY2xhaW1zXG4gICAgICA/IHtcbiAgICAgICAgICB1c2VybmFtZTogZXZlbnQucmVxdWVzdENvbnRleHQuYXV0aG9yaXplci5jbGFpbXNbJ2NvZ25pdG86dXNlcm5hbWUnXSxcbiAgICAgICAgICBzdWI6IGV2ZW50LnJlcXVlc3RDb250ZXh0LmF1dGhvcml6ZXIuY2xhaW1zLnN1YixcbiAgICAgICAgICBlbWFpbDogZXZlbnQucmVxdWVzdENvbnRleHQuYXV0aG9yaXplci5jbGFpbXMuZW1haWwsXG4gICAgICAgIH1cbiAgICAgIDogbnVsbDtcblxuICAgIC8vIEJ1aWxkIGVjaG8gcmVzcG9uc2VcbiAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgIG1lc3NhZ2U6ICdFY2hvIHJlc3BvbnNlIGZyb20gU291bCBJbmsgQVBJJyxcbiAgICAgIHJlY2VpdmVkQm9keTogYm9keSxcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgY29nbml0b1VzZXIsXG4gICAgICByZXF1ZXN0SWQ6IGV2ZW50LnJlcXVlc3RDb250ZXh0LnJlcXVlc3RJZCxcbiAgICAgIGh0dHBNZXRob2Q6IGV2ZW50Lmh0dHBNZXRob2QsXG4gICAgICBwYXRoOiBldmVudC5wYXRoLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiAndHJ1ZScsXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRWNobyBoYW5kbGVyIGVycm9yOicsIGVycm9yKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1lc3NhZ2U6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InLFxuICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicsXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG59O1xuIl19