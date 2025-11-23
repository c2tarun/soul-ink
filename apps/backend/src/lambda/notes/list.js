"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const cors_1 = require("../../utils/cors");
const NotesRepository_1 = require("../../repositories/NotesRepository");
const notesRepo = new NotesRepository_1.NotesRepository();
const handler = async (event) => {
    console.log('List notes handler invoked', { event });
    try {
        // Get userId from Cognito authorizer
        const userId = event.requestContext.authorizer?.claims?.sub;
        if (!userId) {
            return {
                statusCode: 401,
                headers: cors_1.CORS_HEADERS,
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }
        const notes = await notesRepo.listNotes(userId);
        return {
            statusCode: 200,
            headers: cors_1.CORS_HEADERS,
            body: JSON.stringify({ notes }),
        };
    }
    catch (error) {
        console.error('List notes error:', error);
        return {
            statusCode: 500,
            headers: cors_1.CORS_HEADERS,
            body: JSON.stringify({
                message: 'Failed to list notes',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQWdEO0FBQ2hELHdFQUFxRTtBQUVyRSxNQUFNLFNBQVMsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztBQUVqQyxNQUFNLE9BQU8sR0FBMkIsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXJELElBQUksQ0FBQztRQUNILHFDQUFxQztRQUNyQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTyxFQUFFLG1CQUFZO2dCQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQzthQUNsRCxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsbUJBQVk7WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUNoQyxDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTFDLE9BQU87WUFDTCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxtQkFBWTtZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsT0FBTyxFQUFFLHNCQUFzQjtnQkFDL0IsS0FBSyxFQUFFLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWU7YUFDaEUsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBakNXLFFBQUEsT0FBTyxXQWlDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5UHJveHlIYW5kbGVyIH0gZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDT1JTX0hFQURFUlMgfSBmcm9tICcuLi8uLi91dGlscy9jb3JzJztcbmltcG9ydCB7IE5vdGVzUmVwb3NpdG9yeSB9IGZyb20gJy4uLy4uL3JlcG9zaXRvcmllcy9Ob3Rlc1JlcG9zaXRvcnknO1xuXG5jb25zdCBub3Rlc1JlcG8gPSBuZXcgTm90ZXNSZXBvc2l0b3J5KCk7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyOiBBUElHYXRld2F5UHJveHlIYW5kbGVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdMaXN0IG5vdGVzIGhhbmRsZXIgaW52b2tlZCcsIHsgZXZlbnQgfSk7XG5cbiAgdHJ5IHtcbiAgICAvLyBHZXQgdXNlcklkIGZyb20gQ29nbml0byBhdXRob3JpemVyXG4gICAgY29uc3QgdXNlcklkID0gZXZlbnQucmVxdWVzdENvbnRleHQuYXV0aG9yaXplcj8uY2xhaW1zPy5zdWI7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgaGVhZGVyczogQ09SU19IRUFERVJTLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdVbmF1dGhvcml6ZWQnIH0pLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBub3RlcyA9IGF3YWl0IG5vdGVzUmVwby5saXN0Tm90ZXModXNlcklkKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICBoZWFkZXJzOiBDT1JTX0hFQURFUlMsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG5vdGVzIH0pLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignTGlzdCBub3RlcyBlcnJvcjonLCBlcnJvcik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgaGVhZGVyczogQ09SU19IRUFERVJTLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXNzYWdlOiAnRmFpbGVkIHRvIGxpc3Qgbm90ZXMnLFxuICAgICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicsXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG59O1xuIl19