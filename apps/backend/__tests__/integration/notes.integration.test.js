"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_client_mock_1 = require("aws-sdk-client-mock");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamodb_1 = require("../helpers/dynamodb");
const events_1 = require("../helpers/events");
const create_1 = require("../../src/lambda/notes/create");
const list_1 = require("../../src/lambda/notes/list");
const get_1 = require("../../src/lambda/notes/get");
const update_1 = require("../../src/lambda/notes/update");
const delete_1 = require("../../src/lambda/notes/delete");
const ddbMock = (0, aws_sdk_client_mock_1.mockClient)(lib_dynamodb_1.DynamoDBDocumentClient);
describe('Notes Integration Tests', () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    describe('Create Note', () => {
        it('should create a new note successfully', async () => {
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                body: {
                    title: 'My First Note',
                    content: 'This is the content',
                },
            });
            ddbMock.resolves({});
            const response = await (0, create_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.note).toBeDefined();
            expect(body.note.title).toBe('My First Note');
            expect(body.note.content).toBe('This is the content');
            expect(body.note.userId).toBe('user123');
            expect(body.note.id).toBeDefined();
            expect(body.note.createdAt).toBeDefined();
            expect(body.note.updatedAt).toBeDefined();
        });
        it('should return 401 when userId is missing', async () => {
            const event = (0, events_1.createUnauthorizedEvent)();
            event.body = JSON.stringify({
                title: 'Test',
                content: 'Test content',
            });
            const response = await (0, create_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Unauthorized');
        });
        it('should return 400 when title is missing', async () => {
            const event = (0, events_1.createMockEvent)({
                body: {
                    content: 'Content only',
                },
            });
            const response = await (0, create_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Title and content are required');
        });
        it('should return 400 when content is missing', async () => {
            const event = (0, events_1.createMockEvent)({
                body: {
                    title: 'Title only',
                },
            });
            const response = await (0, create_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Title and content are required');
        });
    });
    describe('List Notes', () => {
        it('should list all notes for a user sorted by updatedAt', async () => {
            const userId = 'user123';
            const note1 = (0, dynamodb_1.createTestNote)(userId, 'note1', {
                title: 'First Note',
                updatedAt: '2025-01-01T10:00:00.000Z',
                GSI_SK: '2025-01-01T10:00:00.000Z#note1',
            });
            const note2 = (0, dynamodb_1.createTestNote)(userId, 'note2', {
                title: 'Second Note',
                updatedAt: '2025-01-02T10:00:00.000Z',
                GSI_SK: '2025-01-02T10:00:00.000Z#note2',
            });
            ddbMock.resolves({
                Items: [note2, note1],
            });
            const event = (0, events_1.createMockEvent)({ userId });
            const response = await (0, list_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.notes).toHaveLength(2);
            expect(body.notes[0].title).toBe('Second Note');
            expect(body.notes[1].title).toBe('First Note');
        });
        it('should return empty array when user has no notes', async () => {
            ddbMock.resolves({
                Items: [],
            });
            const event = (0, events_1.createMockEvent)({ userId: 'user-no-notes' });
            const response = await (0, list_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.notes).toEqual([]);
        });
        it('should return 401 when userId is missing', async () => {
            const event = (0, events_1.createUnauthorizedEvent)();
            const response = await (0, list_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Unauthorized');
        });
    });
    describe('Get Note', () => {
        it('should get a specific note by ID', async () => {
            const userId = 'user123';
            const noteId = 'note123';
            const note = (0, dynamodb_1.createTestNote)(userId, noteId, {
                title: 'Test Note',
                content: 'Test Content',
            });
            ddbMock.resolves({
                Item: note,
            });
            const event = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: noteId },
            });
            const response = await (0, get_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.note.id).toBe(noteId);
            expect(body.note.title).toBe('Test Note');
            expect(body.note.content).toBe('Test Content');
        });
        it('should return 404 when note does not exist', async () => {
            ddbMock.resolves({
                Item: undefined,
            });
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: { id: 'nonexistent' },
            });
            const response = await (0, get_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(404);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Note not found');
        });
        it('should return 400 when noteId is missing', async () => {
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: {},
            });
            const response = await (0, get_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Note ID is required');
        });
        it('should return 401 when userId is missing', async () => {
            const event = (0, events_1.createUnauthorizedEvent)();
            event.pathParameters = { id: 'note123' };
            const response = await (0, get_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Unauthorized');
        });
    });
    describe('Update Note', () => {
        it('should update note title and content', async () => {
            const userId = 'user123';
            const noteId = 'note123';
            const existingNote = (0, dynamodb_1.createTestNote)(userId, noteId, {
                title: 'Old Title',
                content: 'Old Content',
            });
            ddbMock
                .onAnyCommand()
                .resolvesOnce({
                Item: existingNote,
            })
                .resolvesOnce({});
            const event = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: noteId },
                body: {
                    title: 'New Title',
                    content: 'New Content',
                },
            });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.note.title).toBe('New Title');
            expect(body.note.content).toBe('New Content');
            expect(body.note.id).toBe(noteId);
        });
        it('should update only title when content not provided', async () => {
            const userId = 'user123';
            const noteId = 'note123';
            const existingNote = (0, dynamodb_1.createTestNote)(userId, noteId, {
                title: 'Old Title',
                content: 'Original Content',
            });
            ddbMock
                .onAnyCommand()
                .resolvesOnce({
                Item: existingNote,
            })
                .resolvesOnce({});
            const event = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: noteId },
                body: {
                    title: 'New Title',
                },
            });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.note.title).toBe('New Title');
            expect(body.note.content).toBe('Original Content');
        });
        it('should update only content when title not provided', async () => {
            const userId = 'user123';
            const noteId = 'note123';
            const existingNote = (0, dynamodb_1.createTestNote)(userId, noteId, {
                title: 'Original Title',
                content: 'Old Content',
            });
            ddbMock
                .onAnyCommand()
                .resolvesOnce({
                Item: existingNote,
            })
                .resolvesOnce({});
            const event = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: noteId },
                body: {
                    content: 'New Content',
                },
            });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.note.title).toBe('Original Title');
            expect(body.note.content).toBe('New Content');
        });
        it('should return 404 when note does not exist', async () => {
            ddbMock.resolves({
                Item: undefined,
            });
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: { id: 'nonexistent' },
                body: { title: 'New Title' },
            });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(404);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Note not found');
        });
        it('should return 400 when neither title nor content provided', async () => {
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: { id: 'note123' },
                body: {},
            });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('At least one of title or content must be provided');
        });
        it('should return 401 when userId is missing', async () => {
            const event = (0, events_1.createUnauthorizedEvent)();
            event.pathParameters = { id: 'note123' };
            event.body = JSON.stringify({ title: 'New Title' });
            const response = await (0, update_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Unauthorized');
        });
    });
    describe('Delete Note', () => {
        it('should delete a note successfully', async () => {
            ddbMock.resolves({});
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: { id: 'note123' },
            });
            const response = await (0, delete_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(204);
            expect(response.body).toBe('');
        });
        it('should return 400 when noteId is missing', async () => {
            const event = (0, events_1.createMockEvent)({
                userId: 'user123',
                pathParameters: {},
            });
            const response = await (0, delete_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Note ID is required');
        });
        it('should return 401 when userId is missing', async () => {
            const event = (0, events_1.createUnauthorizedEvent)();
            event.pathParameters = { id: 'note123' };
            const response = await (0, delete_1.handler)(event, {}, {});
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Unauthorized');
        });
    });
    describe('Full CRUD Flow', () => {
        it('should create, list, get, update, and delete a note', async () => {
            const userId = 'flow-test-user';
            let createdNoteId;
            // Create
            ddbMock.reset();
            ddbMock.resolves({});
            const createEvent = (0, events_1.createMockEvent)({
                userId,
                body: {
                    title: 'Flow Test Note',
                    content: 'Initial content',
                },
            });
            const createResponse = await (0, create_1.handler)(createEvent, {}, {});
            expect(createResponse.statusCode).toBe(201);
            createdNoteId = JSON.parse(createResponse.body).note.id;
            // List
            ddbMock.reset();
            const testNote = (0, dynamodb_1.createTestNote)(userId, createdNoteId, {
                title: 'Flow Test Note',
                content: 'Initial content',
            });
            ddbMock.resolves({
                Items: [testNote],
            });
            const listEvent = (0, events_1.createMockEvent)({ userId });
            const listResponse = await (0, list_1.handler)(listEvent, {}, {});
            expect(listResponse.statusCode).toBe(200);
            const listBody = JSON.parse(listResponse.body);
            expect(listBody.notes).toHaveLength(1);
            expect(listBody.notes[0].id).toBe(createdNoteId);
            // Get
            ddbMock.reset();
            ddbMock.resolves({
                Item: testNote,
            });
            const getEvent = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: createdNoteId },
            });
            const getResponse = await (0, get_1.handler)(getEvent, {}, {});
            expect(getResponse.statusCode).toBe(200);
            const getBody = JSON.parse(getResponse.body);
            expect(getBody.note.title).toBe('Flow Test Note');
            // Update
            ddbMock.reset();
            ddbMock
                .onAnyCommand()
                .resolvesOnce({
                Item: testNote,
            })
                .resolvesOnce({});
            const updateEvent = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: createdNoteId },
                body: {
                    title: 'Updated Title',
                },
            });
            const updateResponse = await (0, update_1.handler)(updateEvent, {}, {});
            expect(updateResponse.statusCode).toBe(200);
            const updateBody = JSON.parse(updateResponse.body);
            expect(updateBody.note.title).toBe('Updated Title');
            // Delete
            ddbMock.reset();
            ddbMock.resolves({});
            const deleteEvent = (0, events_1.createMockEvent)({
                userId,
                pathParameters: { id: createdNoteId },
            });
            const deleteResponse = await (0, delete_1.handler)(deleteEvent, {}, {});
            expect(deleteResponse.statusCode).toBe(204);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZXMuaW50ZWdyYXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGVzLmludGVncmF0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBaUQ7QUFDakQsd0RBQStEO0FBQy9ELGtEQUs2QjtBQUM3Qiw4Q0FBNkU7QUFDN0UsMERBQXlFO0FBQ3pFLHNEQUFxRTtBQUNyRSxvREFBbUU7QUFDbkUsMERBQXlFO0FBQ3pFLDBEQUF5RTtBQUV6RSxNQUFNLE9BQU8sR0FBRyxJQUFBLGdDQUFVLEVBQUMscUNBQXNCLENBQUMsQ0FBQztBQUVuRCxRQUFRLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDckQsTUFBTSxLQUFLLEdBQUcsSUFBQSx3QkFBZSxFQUFDO2dCQUM1QixNQUFNLEVBQUUsU0FBUztnQkFDakIsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxlQUFlO29CQUN0QixPQUFPLEVBQUUscUJBQXFCO2lCQUMvQjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFckIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGdCQUFhLEVBQUMsS0FBSyxFQUFFLEVBQVMsRUFBRSxFQUFTLENBQUMsQ0FBQztZQUVsRSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMs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WyJpbXBvcnQgeyBtb2NrQ2xpZW50IH0gZnJvbSAnYXdzLXNkay1jbGllbnQtbW9jayc7XG5pbXBvcnQgeyBEeW5hbW9EQkRvY3VtZW50Q2xpZW50IH0gZnJvbSAnQGF3cy1zZGsvbGliLWR5bmFtb2RiJztcbmltcG9ydCB7XG4gIGNsZWFyVGFibGUsXG4gIGNyZWF0ZVRlc3ROb3RlLFxuICBzZWVkTm90ZSxcbiAgVEFCTEVfTkFNRSxcbn0gZnJvbSAnLi4vaGVscGVycy9keW5hbW9kYic7XG5pbXBvcnQgeyBjcmVhdGVNb2NrRXZlbnQsIGNyZWF0ZVVuYXV0aG9yaXplZEV2ZW50IH0gZnJvbSAnLi4vaGVscGVycy9ldmVudHMnO1xuaW1wb3J0IHsgaGFuZGxlciBhcyBjcmVhdGVIYW5kbGVyIH0gZnJvbSAnLi4vLi4vc3JjL2xhbWJkYS9ub3Rlcy9jcmVhdGUnO1xuaW1wb3J0IHsgaGFuZGxlciBhcyBsaXN0SGFuZGxlciB9IGZyb20gJy4uLy4uL3NyYy9sYW1iZGEvbm90ZXMvbGlzdCc7XG5pbXBvcnQgeyBoYW5kbGVyIGFzIGdldEhhbmRsZXIgfSBmcm9tICcuLi8uLi9zcmMvbGFtYmRhL25vdGVzL2dldCc7XG5pbXBvcnQgeyBoYW5kbGVyIGFzIHVwZGF0ZUhhbmRsZXIgfSBmcm9tICcuLi8uLi9zcmMvbGFtYmRhL25vdGVzL3VwZGF0ZSc7XG5pbXBvcnQgeyBoYW5kbGVyIGFzIGRlbGV0ZUhhbmRsZXIgfSBmcm9tICcuLi8uLi9zcmMvbGFtYmRhL25vdGVzL2RlbGV0ZSc7XG5cbmNvbnN0IGRkYk1vY2sgPSBtb2NrQ2xpZW50KER5bmFtb0RCRG9jdW1lbnRDbGllbnQpO1xuXG5kZXNjcmliZSgnTm90ZXMgSW50ZWdyYXRpb24gVGVzdHMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGRkYk1vY2sucmVzZXQoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0NyZWF0ZSBOb3RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgbmV3IG5vdGUgc3VjY2Vzc2Z1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHRpdGxlOiAnTXkgRmlyc3QgTm90ZScsXG4gICAgICAgICAgY29udGVudDogJ1RoaXMgaXMgdGhlIGNvbnRlbnQnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGRkYk1vY2sucmVzb2x2ZXMoe30pO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoMjAxKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubm90ZSkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUudGl0bGUpLnRvQmUoJ015IEZpcnN0IE5vdGUnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuY29udGVudCkudG9CZSgnVGhpcyBpcyB0aGUgY29udGVudCcpO1xuICAgICAgZXhwZWN0KGJvZHkubm90ZS51c2VySWQpLnRvQmUoJ3VzZXIxMjMnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuaWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLmNyZWF0ZWRBdCkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUudXBkYXRlZEF0KS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gNDAxIHdoZW4gdXNlcklkIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZVVuYXV0aG9yaXplZEV2ZW50KCk7XG4gICAgICBldmVudC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB0aXRsZTogJ1Rlc3QnLFxuICAgICAgICBjb250ZW50OiAnVGVzdCBjb250ZW50JyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoNDAxKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubWVzc2FnZSkudG9CZSgnVW5hdXRob3JpemVkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiA0MDAgd2hlbiB0aXRsZSBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgY29udGVudDogJ0NvbnRlbnQgb25seScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjcmVhdGVIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDQwMCk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm1lc3NhZ2UpLnRvQmUoJ1RpdGxlIGFuZCBjb250ZW50IGFyZSByZXF1aXJlZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gNDAwIHdoZW4gY29udGVudCBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgdGl0bGU6ICdUaXRsZSBvbmx5JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoNDAwKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubWVzc2FnZSkudG9CZSgnVGl0bGUgYW5kIGNvbnRlbnQgYXJlIHJlcXVpcmVkJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdMaXN0IE5vdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbGlzdCBhbGwgbm90ZXMgZm9yIGEgdXNlciBzb3J0ZWQgYnkgdXBkYXRlZEF0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklkID0gJ3VzZXIxMjMnO1xuICAgICAgY29uc3Qgbm90ZTEgPSBjcmVhdGVUZXN0Tm90ZSh1c2VySWQsICdub3RlMScsIHtcbiAgICAgICAgdGl0bGU6ICdGaXJzdCBOb3RlJyxcbiAgICAgICAgdXBkYXRlZEF0OiAnMjAyNS0wMS0wMVQxMDowMDowMC4wMDBaJyxcbiAgICAgICAgR1NJX1NLOiAnMjAyNS0wMS0wMVQxMDowMDowMC4wMDBaI25vdGUxJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgbm90ZTIgPSBjcmVhdGVUZXN0Tm90ZSh1c2VySWQsICdub3RlMicsIHtcbiAgICAgICAgdGl0bGU6ICdTZWNvbmQgTm90ZScsXG4gICAgICAgIHVwZGF0ZWRBdDogJzIwMjUtMDEtMDJUMTA6MDA6MDAuMDAwWicsXG4gICAgICAgIEdTSV9TSzogJzIwMjUtMDEtMDJUMTA6MDA6MDAuMDAwWiNub3RlMicsXG4gICAgICB9KTtcblxuICAgICAgZGRiTW9jay5yZXNvbHZlcyh7XG4gICAgICAgIEl0ZW1zOiBbbm90ZTIsIG5vdGUxXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7IHVzZXJJZCB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbGlzdEhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoMjAwKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubm90ZXMpLnRvSGF2ZUxlbmd0aCgyKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGVzWzBdLnRpdGxlKS50b0JlKCdTZWNvbmQgTm90ZScpO1xuICAgICAgZXhwZWN0KGJvZHkubm90ZXNbMV0udGl0bGUpLnRvQmUoJ0ZpcnN0IE5vdGUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IHdoZW4gdXNlciBoYXMgbm8gbm90ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBkZGJNb2NrLnJlc29sdmVzKHtcbiAgICAgICAgSXRlbXM6IFtdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlTW9ja0V2ZW50KHsgdXNlcklkOiAndXNlci1uby1ub3RlcycgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGxpc3RIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGVzKS50b0VxdWFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDQwMSB3aGVuIHVzZXJJZCBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVVbmF1dGhvcml6ZWRFdmVudCgpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBsaXN0SGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSg0MDEpO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5tZXNzYWdlKS50b0JlKCdVbmF1dGhvcml6ZWQnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0dldCBOb3RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZ2V0IGEgc3BlY2lmaWMgbm90ZSBieSBJRCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJZCA9ICd1c2VyMTIzJztcbiAgICAgIGNvbnN0IG5vdGVJZCA9ICdub3RlMTIzJztcbiAgICAgIGNvbnN0IG5vdGUgPSBjcmVhdGVUZXN0Tm90ZSh1c2VySWQsIG5vdGVJZCwge1xuICAgICAgICB0aXRsZTogJ1Rlc3QgTm90ZScsXG4gICAgICAgIGNvbnRlbnQ6ICdUZXN0IENvbnRlbnQnLFxuICAgICAgfSk7XG5cbiAgICAgIGRkYk1vY2sucmVzb2x2ZXMoe1xuICAgICAgICBJdGVtOiBub3RlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlTW9ja0V2ZW50KHtcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBwYXRoUGFyYW1ldGVyczogeyBpZDogbm90ZUlkIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0SGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLmlkKS50b0JlKG5vdGVJZCk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLnRpdGxlKS50b0JlKCdUZXN0IE5vdGUnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuY29udGVudCkudG9CZSgnVGVzdCBDb250ZW50Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiA0MDQgd2hlbiBub3RlIGRvZXMgbm90IGV4aXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgZGRiTW9jay5yZXNvbHZlcyh7XG4gICAgICAgIEl0ZW06IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7XG4gICAgICAgIHVzZXJJZDogJ3VzZXIxMjMnLFxuICAgICAgICBwYXRoUGFyYW1ldGVyczogeyBpZDogJ25vbmV4aXN0ZW50JyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdldEhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoNDA0KTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubWVzc2FnZSkudG9CZSgnTm90ZSBub3QgZm91bmQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDQwMCB3aGVuIG5vdGVJZCBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHt9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdldEhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoNDAwKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubWVzc2FnZSkudG9CZSgnTm90ZSBJRCBpcyByZXF1aXJlZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gNDAxIHdoZW4gdXNlcklkIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZVVuYXV0aG9yaXplZEV2ZW50KCk7XG4gICAgICBldmVudC5wYXRoUGFyYW1ldGVycyA9IHsgaWQ6ICdub3RlMTIzJyB9O1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDQwMSk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm1lc3NhZ2UpLnRvQmUoJ1VuYXV0aG9yaXplZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnVXBkYXRlIE5vdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgbm90ZSB0aXRsZSBhbmQgY29udGVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJZCA9ICd1c2VyMTIzJztcbiAgICAgIGNvbnN0IG5vdGVJZCA9ICdub3RlMTIzJztcbiAgICAgIGNvbnN0IGV4aXN0aW5nTm90ZSA9IGNyZWF0ZVRlc3ROb3RlKHVzZXJJZCwgbm90ZUlkLCB7XG4gICAgICAgIHRpdGxlOiAnT2xkIFRpdGxlJyxcbiAgICAgICAgY29udGVudDogJ09sZCBDb250ZW50JyxcbiAgICAgIH0pO1xuXG4gICAgICBkZGJNb2NrXG4gICAgICAgIC5vbkFueUNvbW1hbmQoKVxuICAgICAgICAucmVzb2x2ZXNPbmNlKHtcbiAgICAgICAgICBJdGVtOiBleGlzdGluZ05vdGUsXG4gICAgICAgIH0pXG4gICAgICAgIC5yZXNvbHZlc09uY2Uoe30pO1xuXG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7XG4gICAgICAgIHVzZXJJZCxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6IG5vdGVJZCB9LFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgdGl0bGU6ICdOZXcgVGl0bGUnLFxuICAgICAgICAgIGNvbnRlbnQ6ICdOZXcgQ29udGVudCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlSGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLnRpdGxlKS50b0JlKCdOZXcgVGl0bGUnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuY29udGVudCkudG9CZSgnTmV3IENvbnRlbnQnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuaWQpLnRvQmUobm90ZUlkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIG9ubHkgdGl0bGUgd2hlbiBjb250ZW50IG5vdCBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJZCA9ICd1c2VyMTIzJztcbiAgICAgIGNvbnN0IG5vdGVJZCA9ICdub3RlMTIzJztcbiAgICAgIGNvbnN0IGV4aXN0aW5nTm90ZSA9IGNyZWF0ZVRlc3ROb3RlKHVzZXJJZCwgbm90ZUlkLCB7XG4gICAgICAgIHRpdGxlOiAnT2xkIFRpdGxlJyxcbiAgICAgICAgY29udGVudDogJ09yaWdpbmFsIENvbnRlbnQnLFxuICAgICAgfSk7XG5cbiAgICAgIGRkYk1vY2tcbiAgICAgICAgLm9uQW55Q29tbWFuZCgpXG4gICAgICAgIC5yZXNvbHZlc09uY2Uoe1xuICAgICAgICAgIEl0ZW06IGV4aXN0aW5nTm90ZSxcbiAgICAgICAgfSlcbiAgICAgICAgLnJlc29sdmVzT25jZSh7fSk7XG5cbiAgICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlTW9ja0V2ZW50KHtcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBwYXRoUGFyYW1ldGVyczogeyBpZDogbm90ZUlkIH0sXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICB0aXRsZTogJ05ldyBUaXRsZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlSGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLnRpdGxlKS50b0JlKCdOZXcgVGl0bGUnKTtcbiAgICAgIGV4cGVjdChib2R5Lm5vdGUuY29udGVudCkudG9CZSgnT3JpZ2luYWwgQ29udGVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgb25seSBjb250ZW50IHdoZW4gdGl0bGUgbm90IHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcklkID0gJ3VzZXIxMjMnO1xuICAgICAgY29uc3Qgbm90ZUlkID0gJ25vdGUxMjMnO1xuICAgICAgY29uc3QgZXhpc3RpbmdOb3RlID0gY3JlYXRlVGVzdE5vdGUodXNlcklkLCBub3RlSWQsIHtcbiAgICAgICAgdGl0bGU6ICdPcmlnaW5hbCBUaXRsZScsXG4gICAgICAgIGNvbnRlbnQ6ICdPbGQgQ29udGVudCcsXG4gICAgICB9KTtcblxuICAgICAgZGRiTW9ja1xuICAgICAgICAub25BbnlDb21tYW5kKClcbiAgICAgICAgLnJlc29sdmVzT25jZSh7XG4gICAgICAgICAgSXRlbTogZXhpc3RpbmdOb3RlLFxuICAgICAgICB9KVxuICAgICAgICAucmVzb2x2ZXNPbmNlKHt9KTtcblxuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQsXG4gICAgICAgIHBhdGhQYXJhbWV0ZXJzOiB7IGlkOiBub3RlSWQgfSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIGNvbnRlbnQ6ICdOZXcgQ29udGVudCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlSGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5ub3RlLnRpdGxlKS50b0JlKCdPcmlnaW5hbCBUaXRsZScpO1xuICAgICAgZXhwZWN0KGJvZHkubm90ZS5jb250ZW50KS50b0JlKCdOZXcgQ29udGVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gNDA0IHdoZW4gbm90ZSBkb2VzIG5vdCBleGlzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGRkYk1vY2sucmVzb2x2ZXMoe1xuICAgICAgICBJdGVtOiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6ICdub25leGlzdGVudCcgfSxcbiAgICAgICAgYm9keTogeyB0aXRsZTogJ05ldyBUaXRsZScgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1cGRhdGVIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDQwNCk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm1lc3NhZ2UpLnRvQmUoJ05vdGUgbm90IGZvdW5kJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiA0MDAgd2hlbiBuZWl0aGVyIHRpdGxlIG5vciBjb250ZW50IHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6ICdub3RlMTIzJyB9LFxuICAgICAgICBib2R5OiB7fSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1cGRhdGVIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDQwMCk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm1lc3NhZ2UpLnRvQmUoXG4gICAgICAgICdBdCBsZWFzdCBvbmUgb2YgdGl0bGUgb3IgY29udGVudCBtdXN0IGJlIHByb3ZpZGVkJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDQwMSB3aGVuIHVzZXJJZCBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVVbmF1dGhvcml6ZWRFdmVudCgpO1xuICAgICAgZXZlbnQucGF0aFBhcmFtZXRlcnMgPSB7IGlkOiAnbm90ZTEyMycgfTtcbiAgICAgIGV2ZW50LmJvZHkgPSBKU09OLnN0cmluZ2lmeSh7IHRpdGxlOiAnTmV3IFRpdGxlJyB9KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlSGFuZGxlcihldmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSg0MDEpO1xuICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoYm9keS5tZXNzYWdlKS50b0JlKCdVbmF1dGhvcml6ZWQnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0RlbGV0ZSBOb3RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGVsZXRlIGEgbm90ZSBzdWNjZXNzZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBkZGJNb2NrLnJlc29sdmVzKHt9KTtcblxuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6ICdub3RlMTIzJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRlbGV0ZUhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoMjA0KTtcbiAgICAgIGV4cGVjdChyZXNwb25zZS5ib2R5KS50b0JlKCcnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDQwMCB3aGVuIG5vdGVJZCBpcyBtaXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQ6ICd1c2VyMTIzJyxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHt9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRlbGV0ZUhhbmRsZXIoZXZlbnQsIHt9IGFzIGFueSwge30gYXMgYW55KTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvQmUoNDAwKTtcbiAgICAgIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkubWVzc2FnZSkudG9CZSgnTm90ZSBJRCBpcyByZXF1aXJlZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gNDAxIHdoZW4gdXNlcklkIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IGNyZWF0ZVVuYXV0aG9yaXplZEV2ZW50KCk7XG4gICAgICBldmVudC5wYXRoUGFyYW1ldGVycyA9IHsgaWQ6ICdub3RlMTIzJyB9O1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkZWxldGVIYW5kbGVyKGV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG5cbiAgICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDQwMSk7XG4gICAgICBjb25zdCBib2R5ID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5Lm1lc3NhZ2UpLnRvQmUoJ1VuYXV0aG9yaXplZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnRnVsbCBDUlVEIEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUsIGxpc3QsIGdldCwgdXBkYXRlLCBhbmQgZGVsZXRlIGEgbm90ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJJZCA9ICdmbG93LXRlc3QtdXNlcic7XG4gICAgICBsZXQgY3JlYXRlZE5vdGVJZDogc3RyaW5nO1xuXG4gICAgICAvLyBDcmVhdGVcbiAgICAgIGRkYk1vY2sucmVzZXQoKTtcbiAgICAgIGRkYk1vY2sucmVzb2x2ZXMoe30pO1xuICAgICAgY29uc3QgY3JlYXRlRXZlbnQgPSBjcmVhdGVNb2NrRXZlbnQoe1xuICAgICAgICB1c2VySWQsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICB0aXRsZTogJ0Zsb3cgVGVzdCBOb3RlJyxcbiAgICAgICAgICBjb250ZW50OiAnSW5pdGlhbCBjb250ZW50JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY3JlYXRlUmVzcG9uc2UgPSBhd2FpdCBjcmVhdGVIYW5kbGVyKFxuICAgICAgICBjcmVhdGVFdmVudCxcbiAgICAgICAge30gYXMgYW55LFxuICAgICAgICB7fSBhcyBhbnlcbiAgICAgICk7XG4gICAgICBleHBlY3QoY3JlYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDEpO1xuICAgICAgY3JlYXRlZE5vdGVJZCA9IEpTT04ucGFyc2UoY3JlYXRlUmVzcG9uc2UuYm9keSkubm90ZS5pZDtcblxuICAgICAgLy8gTGlzdFxuICAgICAgZGRiTW9jay5yZXNldCgpO1xuICAgICAgY29uc3QgdGVzdE5vdGUgPSBjcmVhdGVUZXN0Tm90ZSh1c2VySWQsIGNyZWF0ZWROb3RlSWQsIHtcbiAgICAgICAgdGl0bGU6ICdGbG93IFRlc3QgTm90ZScsXG4gICAgICAgIGNvbnRlbnQ6ICdJbml0aWFsIGNvbnRlbnQnLFxuICAgICAgfSk7XG4gICAgICBkZGJNb2NrLnJlc29sdmVzKHtcbiAgICAgICAgSXRlbXM6IFt0ZXN0Tm90ZV0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxpc3RFdmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7IHVzZXJJZCB9KTtcbiAgICAgIGNvbnN0IGxpc3RSZXNwb25zZSA9IGF3YWl0IGxpc3RIYW5kbGVyKGxpc3RFdmVudCwge30gYXMgYW55LCB7fSBhcyBhbnkpO1xuICAgICAgZXhwZWN0KGxpc3RSZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgICBjb25zdCBsaXN0Qm9keSA9IEpTT04ucGFyc2UobGlzdFJlc3BvbnNlLmJvZHkpO1xuICAgICAgZXhwZWN0KGxpc3RCb2R5Lm5vdGVzKS50b0hhdmVMZW5ndGgoMSk7XG4gICAgICBleHBlY3QobGlzdEJvZHkubm90ZXNbMF0uaWQpLnRvQmUoY3JlYXRlZE5vdGVJZCk7XG5cbiAgICAgIC8vIEdldFxuICAgICAgZGRiTW9jay5yZXNldCgpO1xuICAgICAgZGRiTW9jay5yZXNvbHZlcyh7XG4gICAgICAgIEl0ZW06IHRlc3ROb3RlLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBnZXRFdmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7XG4gICAgICAgIHVzZXJJZCxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6IGNyZWF0ZWROb3RlSWQgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZ2V0UmVzcG9uc2UgPSBhd2FpdCBnZXRIYW5kbGVyKGdldEV2ZW50LCB7fSBhcyBhbnksIHt9IGFzIGFueSk7XG4gICAgICBleHBlY3QoZ2V0UmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgZ2V0Qm9keSA9IEpTT04ucGFyc2UoZ2V0UmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QoZ2V0Qm9keS5ub3RlLnRpdGxlKS50b0JlKCdGbG93IFRlc3QgTm90ZScpO1xuXG4gICAgICAvLyBVcGRhdGVcbiAgICAgIGRkYk1vY2sucmVzZXQoKTtcbiAgICAgIGRkYk1vY2tcbiAgICAgICAgLm9uQW55Q29tbWFuZCgpXG4gICAgICAgIC5yZXNvbHZlc09uY2Uoe1xuICAgICAgICAgIEl0ZW06IHRlc3ROb3RlLFxuICAgICAgICB9KVxuICAgICAgICAucmVzb2x2ZXNPbmNlKHt9KTtcbiAgICAgIGNvbnN0IHVwZGF0ZUV2ZW50ID0gY3JlYXRlTW9ja0V2ZW50KHtcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBwYXRoUGFyYW1ldGVyczogeyBpZDogY3JlYXRlZE5vdGVJZCB9LFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgdGl0bGU6ICdVcGRhdGVkIFRpdGxlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB1cGRhdGVIYW5kbGVyKFxuICAgICAgICB1cGRhdGVFdmVudCxcbiAgICAgICAge30gYXMgYW55LFxuICAgICAgICB7fSBhcyBhbnlcbiAgICAgICk7XG4gICAgICBleHBlY3QodXBkYXRlUmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgICAgY29uc3QgdXBkYXRlQm9keSA9IEpTT04ucGFyc2UodXBkYXRlUmVzcG9uc2UuYm9keSk7XG4gICAgICBleHBlY3QodXBkYXRlQm9keS5ub3RlLnRpdGxlKS50b0JlKCdVcGRhdGVkIFRpdGxlJyk7XG5cbiAgICAgIC8vIERlbGV0ZVxuICAgICAgZGRiTW9jay5yZXNldCgpO1xuICAgICAgZGRiTW9jay5yZXNvbHZlcyh7fSk7XG4gICAgICBjb25zdCBkZWxldGVFdmVudCA9IGNyZWF0ZU1vY2tFdmVudCh7XG4gICAgICAgIHVzZXJJZCxcbiAgICAgICAgcGF0aFBhcmFtZXRlcnM6IHsgaWQ6IGNyZWF0ZWROb3RlSWQgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZGVsZXRlUmVzcG9uc2UgPSBhd2FpdCBkZWxldGVIYW5kbGVyKFxuICAgICAgICBkZWxldGVFdmVudCxcbiAgICAgICAge30gYXMgYW55LFxuICAgICAgICB7fSBhcyBhbnlcbiAgICAgICk7XG4gICAgICBleHBlY3QoZGVsZXRlUmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9CZSgyMDQpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19