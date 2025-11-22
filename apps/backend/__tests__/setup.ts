import { jest } from '@jest/globals';

jest.setTimeout(10000);

process.env.TABLE_NAME = 'test-notes-table';
