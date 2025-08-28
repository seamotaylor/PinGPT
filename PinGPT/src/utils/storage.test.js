/**
 * Comprehensive unit tests for storage utility functions
 */
import { saveBookmark, getBookmarks, validateBookmark, deleteBookmark, updateBookmark, searchBookmarks } from './storage.js';

// Mock Chrome storage API
global.chrome = {
    storage: {
        sync: {
            get: jest.fn(),
            set: jest.fn()
        }
    }
};

describe('Storage Utilities', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        chrome.storage.sync.get.mockResolvedValue({ bookmarks: [] });
        chrome.storage.sync.set.mockResolvedValue();
    });

    describe('validateBookmark', () => {
        it('should validate a correct bookmark', () => {
            const bookmark = {
                title: 'Test Bookmark',
                url: 'https://chat.openai.com/c/test-conversation',
                timestamp: '2023-01-01T00:00:00.000Z',
                content: 'Test content'
            };
            expect(validateBookmark(bookmark)).toBe(true);
        });

        it('should reject a bookmark without title', () => {
            const bookmark = {
                url: 'https://chat.openai.com/c/test'
            };
            expect(validateBookmark(bookmark)).toBe(false);
        });

        it('should reject a bookmark with invalid URL', () => {
            const bookmark = {
                title: 'Test Bookmark',
                url: 'invalid-url'
            };
            expect(validateBookmark(bookmark)).toBe(false);
        });

        it('should reject a bookmark with empty title', () => {
            const bookmark = {
                title: '   ',
                url: 'https://chat.openai.com/c/test'
            };
            expect(validateBookmark(bookmark)).toBe(false);
        });

        it('should validate bookmark with optional fields', () => {
            const bookmark = {
                title: 'Test Bookmark',
                url: 'https://chat.openai.com/c/test',
                content: 'Test content',
                conversationId: 'test-conversation',
                messageCount: 10
            };
            expect(validateBookmark(bookmark)).toBe(true);
        });
    });

    describe('getBookmarks', () => {
        it('should return empty array when no bookmarks exist', async () => {
            chrome.storage.sync.get.mockResolvedValue({ bookmarks: null });

            const bookmarks = await getBookmarks();

            expect(bookmarks).toEqual([]);
            expect(chrome.storage.sync.get).toHaveBeenCalledWith('bookmarks');
        });

        it('should return existing bookmarks', async () => {
            const mockBookmarks = [
                {
                    id: '1',
                    title: 'Test Bookmark',
                    url: 'https://chat.openai.com/c/test',
                    timestamp: '2023-01-01T00:00:00.000Z'
                }
            ];
            chrome.storage.sync.get.mockResolvedValue({ bookmarks: mockBookmarks });

            const bookmarks = await getBookmarks();

            expect(bookmarks).toEqual(mockBookmarks);
        });

        it('should handle storage errors gracefully', async () => {
            chrome.storage.sync.get.mockRejectedValue(new Error('Storage unavailable'));

            const bookmarks = await getBookmarks();

            expect(bookmarks).toEqual([]);
        });
    });

    describe('saveBookmark', () => {
        it('should save a valid bookmark successfully', async () => {
            const bookmark = {
                title: 'New ChatGPT Conversation',
                url: 'https://chat.openai.com/c/conversation-123',
                content: 'Asking about JavaScript best practices...',
                conversationId: 'conversation-123'
            };

            chrome.storage.sync.get.mockResolvedValue({ bookmarks: [] });
            chrome.storage.sync.set.mockResolvedValue();

            await saveBookmark(bookmark);

            expect(chrome.storage.sync.set).toHaveBeenCalledWith({
                bookmarks: expect.arrayContaining([
                    expect.objectContaining({
                        ...bookmark,
                        id: expect.any(String),
                        timestamp: expect.any(String)
                    })
                ])
            });
        });

        it('should reject invalid bookmark', async () => {
            const invalidBookmark = {
                url: 'https://example.com' // Missing title
            };

            await expect(saveBookmark(invalidBookmark))
                .rejects
                .toThrow('Invalid bookmark data');
        });

        it('should handle storage write errors', async () => {
            const bookmark = {
                title: 'Test Bookmark',
                url: 'https://chat.openai.com/c/test'
            };

            chrome.storage.sync.get.mockResolvedValue({ bookmarks: [] });
            chrome.storage.sync.set.mockRejectedValue(new Error('Write failed'));

            await expect(saveBookmark(bookmark))
                .rejects
                .toThrow('Write failed');
        });
    });

    describe('deleteBookmark', () => {
        it('should delete existing bookmark', async () => {
            const existingBookmarks = [
                { id: '1', title: 'Bookmark 1', url: 'https://test1.com' },
                { id: '2', title: 'Bookmark 2', url: 'https://test2.com' }
            ];

            chrome.storage.sync.get.mockResolvedValue({ bookmarks: existingBookmarks });

            await deleteBookmark('1');

            expect(chrome.storage.sync.set).toHaveBeenCalledWith({
                bookmarks: [{ id: '2', title: 'Bookmark 2', url: 'https://test2.com' }]
            });
        });

        it('should handle deleting non-existent bookmark', async () => {
            chrome.storage.sync.get.mockResolvedValue({
                bookmarks: [{ id: '1', title: 'Bookmark 1', url: 'https://test.com' }]
            });

            await deleteBookmark('non-existent');

            expect(chrome.storage.sync.set).toHaveBeenCalledWith({
                bookmarks: []
            });
        });
    });

    describe('updateBookmark', () => {
        it('should update existing bookmark', async () => {
            const bookmark = {
                id: '1',
                title: 'Updated Title',
                url: 'https://updated-url.com',
                content: 'Updated content'
            };

            chrome.storage.sync.get.mockResolvedValue({
                bookmarks: [{ id: '1', title: 'Original Title', url: 'https://original.com' }]
            });

            await updateBookmark('1', bookmark);

            expect(chrome.storage.sync.set).toHaveBeenCalledWith({
                bookmarks: [expect.objectContaining({
                    id: '1',
                    title: 'Updated Title',
                    url: 'https://updated-url.com',
                    updatedAt: expect.any(String)
                })]
            });
        });

        it('should reject updating non-existent bookmark', async () => {
            const bookmark = { title: 'Test', url: 'https://test.com' };
            chrome.storage.sync.get.mockResolvedValue({ bookmarks: [] });

            await expect(updateBookmark('non-existent', bookmark))
                .rejects
                .toThrow('Bookmark not found');
        });
    });

    describe('searchBookmarks', () => {
        it('should search bookmarks by title', async () => {
            const bookmarks = [
                { id: '1', title: 'JavaScript Tutorial', url: 'https://test1.com' },
                { id: '2', title: 'Python Guide', url: 'https://test2.com' }
            ];

            chrome.storage.sync.get.mockResolvedValue({ bookmarks });

            const results = await searchBookmarks('JavaScript');

            expect(results).toHaveLength(1);
            expect(results[0].title).toBe('JavaScript Tutorial');
        });

        it('should search bookmarks by content', async () => {
            const bookmarks = [
                {
                    id: '1',
                    title: 'Chat about React',
                    url: 'https://test1.com',
                    content: 'React hooks best practices discussion'
                }
            ];

            chrome.storage.sync.get.mockResolvedValue({ bookmarks });

            const results = await searchBookmarks('hooks');

            expect(results).toHaveLength(1);
            expect(results[0].content).toContain('React hooks');
        });

        it('should return empty array for no matches', async () => {
            const bookmarks = [
                { id: '1', title: 'JavaScript Tutorial', url: 'https://test1.com' }
            ];

            chrome.storage.sync.get.mockResolvedValue({ bookmarks });

            const results = await searchBookmarks('Python');

            expect(results).toEqual([]);
        });
    });
});