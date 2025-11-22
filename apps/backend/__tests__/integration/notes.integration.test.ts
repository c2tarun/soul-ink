import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  clearTable,
  createTestNote,
  seedNote,
  TABLE_NAME,
} from '../helpers/dynamodb';
import { createMockEvent, createUnauthorizedEvent } from '../helpers/events';
import { handler as createHandler } from '../../src/lambda/notes/create';
import { handler as listHandler } from '../../src/lambda/notes/list';
import { handler as getHandler } from '../../src/lambda/notes/get';
import { handler as updateHandler } from '../../src/lambda/notes/update';
import { handler as deleteHandler } from '../../src/lambda/notes/delete';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Notes Integration Tests', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('Create Note', () => {
    it('should create a new note successfully', async () => {
      const event = createMockEvent({
        userId: 'user123',
        body: {
          title: 'My First Note',
          content: 'This is the content',
        },
      });

      ddbMock.resolves({});

      const response = await createHandler(event, {} as any, {} as any);

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
      const event = createUnauthorizedEvent();
      event.body = JSON.stringify({
        title: 'Test',
        content: 'Test content',
      });

      const response = await createHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });

    it('should return 400 when title is missing', async () => {
      const event = createMockEvent({
        body: {
          content: 'Content only',
        },
      });

      const response = await createHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Title and content are required');
    });

    it('should return 400 when content is missing', async () => {
      const event = createMockEvent({
        body: {
          title: 'Title only',
        },
      });

      const response = await createHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Title and content are required');
    });
  });

  describe('List Notes', () => {
    it('should list all notes for a user sorted by updatedAt', async () => {
      const userId = 'user123';
      const note1 = createTestNote(userId, 'note1', {
        title: 'First Note',
        updatedAt: '2025-01-01T10:00:00.000Z',
        GSI_SK: '2025-01-01T10:00:00.000Z#note1',
      });
      const note2 = createTestNote(userId, 'note2', {
        title: 'Second Note',
        updatedAt: '2025-01-02T10:00:00.000Z',
        GSI_SK: '2025-01-02T10:00:00.000Z#note2',
      });

      ddbMock.resolves({
        Items: [note2, note1],
      });

      const event = createMockEvent({ userId });
      const response = await listHandler(event, {} as any, {} as any);

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

      const event = createMockEvent({ userId: 'user-no-notes' });
      const response = await listHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.notes).toEqual([]);
    });

    it('should return 401 when userId is missing', async () => {
      const event = createUnauthorizedEvent();
      const response = await listHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('Get Note', () => {
    it('should get a specific note by ID', async () => {
      const userId = 'user123';
      const noteId = 'note123';
      const note = createTestNote(userId, noteId, {
        title: 'Test Note',
        content: 'Test Content',
      });

      ddbMock.resolves({
        Item: note,
      });

      const event = createMockEvent({
        userId,
        pathParameters: { id: noteId },
      });
      const response = await getHandler(event, {} as any, {} as any);

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

      const event = createMockEvent({
        userId: 'user123',
        pathParameters: { id: 'nonexistent' },
      });
      const response = await getHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Note not found');
    });

    it('should return 400 when noteId is missing', async () => {
      const event = createMockEvent({
        userId: 'user123',
        pathParameters: {},
      });
      const response = await getHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Note ID is required');
    });

    it('should return 401 when userId is missing', async () => {
      const event = createUnauthorizedEvent();
      event.pathParameters = { id: 'note123' };
      const response = await getHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('Update Note', () => {
    it('should update note title and content', async () => {
      const userId = 'user123';
      const noteId = 'note123';
      const existingNote = createTestNote(userId, noteId, {
        title: 'Old Title',
        content: 'Old Content',
      });

      ddbMock
        .onAnyCommand()
        .resolvesOnce({
          Item: existingNote,
        })
        .resolvesOnce({});

      const event = createMockEvent({
        userId,
        pathParameters: { id: noteId },
        body: {
          title: 'New Title',
          content: 'New Content',
        },
      });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.note.title).toBe('New Title');
      expect(body.note.content).toBe('New Content');
      expect(body.note.id).toBe(noteId);
    });

    it('should update only title when content not provided', async () => {
      const userId = 'user123';
      const noteId = 'note123';
      const existingNote = createTestNote(userId, noteId, {
        title: 'Old Title',
        content: 'Original Content',
      });

      ddbMock
        .onAnyCommand()
        .resolvesOnce({
          Item: existingNote,
        })
        .resolvesOnce({});

      const event = createMockEvent({
        userId,
        pathParameters: { id: noteId },
        body: {
          title: 'New Title',
        },
      });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.note.title).toBe('New Title');
      expect(body.note.content).toBe('Original Content');
    });

    it('should update only content when title not provided', async () => {
      const userId = 'user123';
      const noteId = 'note123';
      const existingNote = createTestNote(userId, noteId, {
        title: 'Original Title',
        content: 'Old Content',
      });

      ddbMock
        .onAnyCommand()
        .resolvesOnce({
          Item: existingNote,
        })
        .resolvesOnce({});

      const event = createMockEvent({
        userId,
        pathParameters: { id: noteId },
        body: {
          content: 'New Content',
        },
      });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.note.title).toBe('Original Title');
      expect(body.note.content).toBe('New Content');
    });

    it('should return 404 when note does not exist', async () => {
      ddbMock.resolves({
        Item: undefined,
      });

      const event = createMockEvent({
        userId: 'user123',
        pathParameters: { id: 'nonexistent' },
        body: { title: 'New Title' },
      });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Note not found');
    });

    it('should return 400 when neither title nor content provided', async () => {
      const event = createMockEvent({
        userId: 'user123',
        pathParameters: { id: 'note123' },
        body: {},
      });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe(
        'At least one of title or content must be provided'
      );
    });

    it('should return 401 when userId is missing', async () => {
      const event = createUnauthorizedEvent();
      event.pathParameters = { id: 'note123' };
      event.body = JSON.stringify({ title: 'New Title' });
      const response = await updateHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('Delete Note', () => {
    it('should delete a note successfully', async () => {
      ddbMock.resolves({});

      const event = createMockEvent({
        userId: 'user123',
        pathParameters: { id: 'note123' },
      });
      const response = await deleteHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(204);
      expect(response.body).toBe('');
    });

    it('should return 400 when noteId is missing', async () => {
      const event = createMockEvent({
        userId: 'user123',
        pathParameters: {},
      });
      const response = await deleteHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Note ID is required');
    });

    it('should return 401 when userId is missing', async () => {
      const event = createUnauthorizedEvent();
      event.pathParameters = { id: 'note123' };
      const response = await deleteHandler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('Full CRUD Flow', () => {
    it('should create, list, get, update, and delete a note', async () => {
      const userId = 'flow-test-user';
      let createdNoteId: string;

      // Create
      ddbMock.reset();
      ddbMock.resolves({});
      const createEvent = createMockEvent({
        userId,
        body: {
          title: 'Flow Test Note',
          content: 'Initial content',
        },
      });
      const createResponse = await createHandler(
        createEvent,
        {} as any,
        {} as any
      );
      expect(createResponse.statusCode).toBe(201);
      createdNoteId = JSON.parse(createResponse.body).note.id;

      // List
      ddbMock.reset();
      const testNote = createTestNote(userId, createdNoteId, {
        title: 'Flow Test Note',
        content: 'Initial content',
      });
      ddbMock.resolves({
        Items: [testNote],
      });
      const listEvent = createMockEvent({ userId });
      const listResponse = await listHandler(listEvent, {} as any, {} as any);
      expect(listResponse.statusCode).toBe(200);
      const listBody = JSON.parse(listResponse.body);
      expect(listBody.notes).toHaveLength(1);
      expect(listBody.notes[0].id).toBe(createdNoteId);

      // Get
      ddbMock.reset();
      ddbMock.resolves({
        Item: testNote,
      });
      const getEvent = createMockEvent({
        userId,
        pathParameters: { id: createdNoteId },
      });
      const getResponse = await getHandler(getEvent, {} as any, {} as any);
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
      const updateEvent = createMockEvent({
        userId,
        pathParameters: { id: createdNoteId },
        body: {
          title: 'Updated Title',
        },
      });
      const updateResponse = await updateHandler(
        updateEvent,
        {} as any,
        {} as any
      );
      expect(updateResponse.statusCode).toBe(200);
      const updateBody = JSON.parse(updateResponse.body);
      expect(updateBody.note.title).toBe('Updated Title');

      // Delete
      ddbMock.reset();
      ddbMock.resolves({});
      const deleteEvent = createMockEvent({
        userId,
        pathParameters: { id: createdNoteId },
      });
      const deleteResponse = await deleteHandler(
        deleteEvent,
        {} as any,
        {} as any
      );
      expect(deleteResponse.statusCode).toBe(204);
    });
  });
});
