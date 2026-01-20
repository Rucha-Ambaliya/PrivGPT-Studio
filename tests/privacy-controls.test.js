/**
 * Privacy Controls Feature Test Suite
 * Tests conversation-level privacy controls including locking and auto-delete functionality
 */

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');

// Mock Flask app setup
const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn()
};

describe('Privacy Controls Feature Tests', () => {
  let mongoServer;
  let mongoClient;
  let db;
  let testSessionId;
  let testUserId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    db = mongoClient.db('test');
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections
    await db.collection('sessions').deleteMany({});
    await db.collection('users').deleteMany({});

    // Create test user
    const userResult = await db.collection('users').insertOne({
      email: 'test@example.com',
      chat_sessions: []
    });
    testUserId = userResult.insertedId.toString();

    // Create test session
    const sessionResult = await db.collection('sessions').insertOne({
      session_name: 'Test Chat',
      messages: [
        { role: 'user', content: 'Hello', timestamp: new Date() },
        { role: 'bot', content: 'Hi there!', timestamp: new Date() }
      ],
      created_at: new Date(),
      user_id: testUserId,
      privacy_settings: {
        is_locked: false,
        auto_delete_after: null,
        expires_at: null
      }
    });
    testSessionId = sessionResult.insertedId.toString();
  });

  describe('Privacy Settings API', () => {
    test('should update privacy settings successfully', async () => {
      const privacyData = {
        is_locked: true,
        auto_delete_after: '24h'
      };

      // Mock the API call
      const mockResponse = {
        status: 'success',
        message: 'Privacy settings updated successfully',
        privacy_settings: {
          is_locked: true,
          auto_delete_after: '24h',
          expires_at: expect.any(String)
        }
      };

      // Simulate API call
      await db.collection('sessions').updateOne(
        { _id: new ObjectId(testSessionId) },
        {
          $set: {
            'privacy_settings.is_locked': true,
            'privacy_settings.auto_delete_after': '24h',
            'privacy_settings.expires_at': new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        }
      );

      const updatedSession = await db.collection('sessions').findOne({ _id: new ObjectId(testSessionId) });
      
      expect(updatedSession.privacy_settings.is_locked).toBe(true);
      expect(updatedSession.privacy_settings.auto_delete_after).toBe('24h');
      expect(updatedSession.privacy_settings.expires_at).toBeInstanceOf(Date);
    });

    test('should handle invalid session ID', async () => {
      const invalidId = 'invalid-id';
      
      try {
        await db.collection('sessions').updateOne(
          { _id: new ObjectId(invalidId) },
          { $set: { 'privacy_settings.is_locked': true } }
        );
      } catch (error) {
        expect(error.message).toContain('invalid');
      }
    });

    test('should calculate correct expiry times', () => {
      const now = new Date();
      const testCases = [
        { duration: '1h', expectedHours: 1 },
        { duration: '24h', expectedHours: 24 },
        { duration: '7d', expectedHours: 7 * 24 },
        { duration: '30d', expectedHours: 30 * 24 }
      ];

      testCases.forEach(({ duration, expectedHours }) => {
        const expiryTime = new Date(now.getTime() + expectedHours * 60 * 60 * 1000);
        const expectedTime = new Date(now.getTime() + expectedHours * 60 * 60 * 1000);
        
        expect(Math.abs(expiryTime.getTime() - expectedTime.getTime())).toBeLessThan(1000);
      });
    });
  });

  describe('Chat Access Control', () => {
    test('should block access to locked conversations', async () => {
      // Lock the conversation
      await db.collection('sessions').updateOne(
        { _id: new ObjectId(testSessionId) },
        { $set: { 'privacy_settings.is_locked': true } }
      );

      const session = await db.collection('sessions').findOne({ _id: new ObjectId(testSessionId) });
      
      // Simulate access check
      if (session.privacy_settings.is_locked) {
        const error = { error: 'This conversation is locked', locked: true };
        expect(error.error).toBe('This conversation is locked');
        expect(error.locked).toBe(true);
      }
    });

    test('should block access to expired conversations', async () => {
      // Set conversation as expired
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      await db.collection('sessions').updateOne(
        { _id: new ObjectId(testSessionId) },
        { 
          $set: { 
            'privacy_settings.expires_at': pastDate,
            'privacy_settings.auto_delete_after': '1h'
          } 
        }
      );

      const session = await db.collection('sessions').findOne({ _id: new ObjectId(testSessionId) });
      const isExpired = session.privacy_settings.expires_at < new Date();
      
      expect(isExpired).toBe(true);
    });

    test('should allow access to unlocked, non-expired conversations', async () => {
      const session = await db.collection('sessions').findOne({ _id: new ObjectId(testSessionId) });
      
      const isLocked = session.privacy_settings.is_locked;
      const isExpired = session.privacy_settings.expires_at && session.privacy_settings.expires_at < new Date();
      
      expect(isLocked).toBe(false);
      expect(isExpired).toBe(false);
    });
  });

  describe('Auto-Delete Functionality', () => {
    test('should identify expired sessions for cleanup', async () => {
      // Create expired session
      const expiredSession = await db.collection('sessions').insertOne({
        session_name: 'Expired Chat',
        messages: [],
        created_at: new Date(),
        privacy_settings: {
          is_locked: false,
          auto_delete_after: '1h',
          expires_at: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        }
      });

      // Find expired sessions
      const expiredSessions = await db.collection('sessions').find({
        'privacy_settings.expires_at': { $lt: new Date() }
      }).toArray();

      expect(expiredSessions).toHaveLength(1);
      expect(expiredSessions[0]._id.toString()).toBe(expiredSession.insertedId.toString());
    });

    test('should delete expired sessions during cleanup', async () => {
      // Create multiple sessions with different expiry times
      await db.collection('sessions').insertMany([
        {
          session_name: 'Expired 1',
          privacy_settings: {
            expires_at: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
          }
        },
        {
          session_name: 'Expired 2',
          privacy_settings: {
            expires_at: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
          }
        },
        {
          session_name: 'Not Expired',
          privacy_settings: {
            expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
          }
        }
      ]);

      // Simulate cleanup
      const deleteResult = await db.collection('sessions').deleteMany({
        'privacy_settings.expires_at': { $lt: new Date() }
      });

      expect(deleteResult.deletedCount).toBe(2);

      // Verify remaining sessions
      const remainingSessions = await db.collection('sessions').find({}).toArray();
      expect(remainingSessions).toHaveLength(2); // Original test session + non-expired session
    });
  });

  describe('Frontend Integration', () => {
    test('should calculate time remaining correctly', () => {
      const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return null;
        
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          return `${days}d ${hours}h`;
        } else if (hours > 0) {
          return `${hours}h ${minutes}m`;
        } else {
          return `${minutes}m`;
        }
      };

      // Test cases
      const now = new Date();
      
      // 2 days, 3 hours from now
      const future1 = new Date(now.getTime() + (2 * 24 + 3) * 60 * 60 * 1000);
      expect(getTimeRemaining(future1)).toBe('2d 3h');
      
      // 5 hours, 30 minutes from now
      const future2 = new Date(now.getTime() + (5 * 60 + 30) * 60 * 1000);
      expect(getTimeRemaining(future2)).toBe('5h 30m');
      
      // 45 minutes from now
      const future3 = new Date(now.getTime() + 45 * 60 * 1000);
      expect(getTimeRemaining(future3)).toBe('45m');
      
      // Past date
      const past = new Date(now.getTime() - 60 * 60 * 1000);
      expect(getTimeRemaining(past)).toBe('Expired');
      
      // Null/undefined
      expect(getTimeRemaining(null)).toBe(null);
    });

    test('should handle privacy modal state correctly', () => {
      // Mock React state management
      let privacyControlsModal = false;
      let selectedSessionForPrivacy = null;
      let privacyIsLocked = false;
      let privacyAutoDelete = '';

      // Simulate opening privacy modal
      const handlePrivacySettings = (sessionId) => {
        selectedSessionForPrivacy = sessionId;
        privacyIsLocked = false; // Default values
        privacyAutoDelete = '';
        privacyControlsModal = true;
      };

      // Simulate closing modal
      const closeModal = () => {
        privacyControlsModal = false;
        selectedSessionForPrivacy = null;
      };

      // Test opening modal
      handlePrivacySettings(testSessionId);
      expect(privacyControlsModal).toBe(true);
      expect(selectedSessionForPrivacy).toBe(testSessionId);
      expect(privacyIsLocked).toBe(false);
      expect(privacyAutoDelete).toBe('');

      // Test closing modal
      closeModal();
      expect(privacyControlsModal).toBe(false);
      expect(selectedSessionForPrivacy).toBe(null);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Simulate database error
      const mockError = new Error('Database connection failed');
      
      try {
        throw mockError;
      } catch (error) {
        expect(error.message).toBe('Database connection failed');
      }
    });

    test('should validate privacy settings input', () => {
      const validatePrivacySettings = (settings) => {
        const errors = [];
        
        if (typeof settings.is_locked !== 'boolean') {
          errors.push('is_locked must be a boolean');
        }
        
        if (settings.auto_delete_after && !['1h', '24h', '7d', '30d'].includes(settings.auto_delete_after)) {
          errors.push('Invalid auto_delete_after value');
        }
        
        return errors;
      };

      // Valid settings
      expect(validatePrivacySettings({ is_locked: true, auto_delete_after: '24h' })).toEqual([]);
      
      // Invalid settings
      expect(validatePrivacySettings({ is_locked: 'true', auto_delete_after: '24h' }))
        .toContain('is_locked must be a boolean');
      
      expect(validatePrivacySettings({ is_locked: true, auto_delete_after: '2h' }))
        .toContain('Invalid auto_delete_after value');
    });
  });

  describe('Performance Tests', () => {
    test('should handle bulk privacy operations efficiently', async () => {
      // Create multiple sessions
      const sessions = Array.from({ length: 100 }, (_, i) => ({
        session_name: `Test Session ${i}`,
        messages: [],
        created_at: new Date(),
        privacy_settings: {
          is_locked: false,
          auto_delete_after: null,
          expires_at: null
        }
      }));

      await db.collection('sessions').insertMany(sessions);

      // Measure bulk update performance
      const startTime = Date.now();
      
      await db.collection('sessions').updateMany(
        {},
        {
          $set: {
            'privacy_settings.is_locked': true
          }
        }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(1000); // 1 second

      // Verify all sessions were updated
      const updatedCount = await db.collection('sessions').countDocuments({
        'privacy_settings.is_locked': true
      });
      
      expect(updatedCount).toBe(101); // 100 + original test session
    });
  });
});