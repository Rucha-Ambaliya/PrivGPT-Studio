/**
 * Privacy Controls Frontend Component Tests
 * Tests React components and UI interactions for privacy controls
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock the chat page component parts
const mockChatSessions = [
  {
    id: '1',
    sessionName: 'Test Chat 1',
    lastMessage: 'Hello world',
    privacy_settings: {
      is_locked: false,
      auto_delete_after: null,
      expires_at: null
    }
  },
  {
    id: '2',
    sessionName: 'Locked Chat',
    lastMessage: 'This is locked',
    privacy_settings: {
      is_locked: true,
      auto_delete_after: null,
      expires_at: null
    }
  },
  {
    id: '3',
    sessionName: 'Expiring Chat',
    lastMessage: 'This will expire',
    privacy_settings: {
      is_locked: false,
      auto_delete_after: '24h',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }
];

// Mock components
const MockPrivacyControlsModal = ({ isOpen, onClose, onSave, sessionId, initialSettings }) => {
  const [isLocked, setIsLocked] = React.useState(initialSettings?.is_locked || false);
  const [autoDelete, setAutoDelete] = React.useState(initialSettings?.auto_delete_after || '');

  if (!isOpen) return null;

  return (
    <div data-testid="privacy-modal">
      <h2>Privacy Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={isLocked}
          onChange={(e) => setIsLocked(e.target.checked)}
          data-testid="lock-checkbox"
        />
        Lock Conversation
      </label>
      <select
        value={autoDelete}
        onChange={(e) => setAutoDelete(e.target.value)}
        data-testid="auto-delete-select"
      >
        <option value="">Never</option>
        <option value="1h">1 Hour</option>
        <option value="24h">24 Hours</option>
        <option value="7d">7 Days</option>
        <option value="30d">30 Days</option>
      </select>
      <button
        onClick={() => onSave({ is_locked: isLocked, auto_delete_after: autoDelete || null })}
        data-testid="save-button"
      >
        Save Changes
      </button>
      <button onClick={onClose} data-testid="cancel-button">
        Cancel
      </button>
    </div>
  );
};

const MockChatSessionItem = ({ session, onPrivacySettings, onSelect }) => {
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

  const privacySettings = session.privacy_settings || {};
  const timeRemaining = getTimeRemaining(privacySettings.expires_at);
  const isExpired = timeRemaining === 'Expired';

  return (
    <div
      data-testid={`session-${session.id}`}
      className={`session-item ${privacySettings.is_locked ? 'locked' : ''} ${isExpired ? 'expired' : ''}`}
      onClick={() => {
        if (privacySettings.is_locked) {
          alert('This conversation is locked');
          return;
        }
        if (isExpired) {
          alert('This conversation has expired');
          return;
        }
        onSelect(session.id);
      }}
    >
      <div className="session-info">
        <div className="session-header">
          {privacySettings.is_locked && <span data-testid="lock-icon">🔒</span>}
          {privacySettings.auto_delete_after && !isExpired && (
            <span data-testid="timer-icon">⏱️</span>
          )}
          <span className="session-name">{session.sessionName}</span>
        </div>
        <div className="session-details">
          <span className="last-message">{session.lastMessage}</span>
          {timeRemaining && !isExpired && (
            <span data-testid="time-remaining" className="time-remaining">
              {timeRemaining}
            </span>
          )}
          {isExpired && (
            <span data-testid="expired-label" className="expired-label">
              Expired
            </span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrivacySettings(session.id);
        }}
        data-testid={`privacy-button-${session.id}`}
      >
        Privacy Settings
      </button>
    </div>
  );
};

const MockChatApp = () => {
  const [sessions, setSessions] = React.useState(mockChatSessions);
  const [privacyModalOpen, setPrivacyModalOpen] = React.useState(false);
  const [selectedSessionForPrivacy, setSelectedSessionForPrivacy] = React.useState(null);

  const handlePrivacySettings = (sessionId) => {
    setSelectedSessionForPrivacy(sessionId);
    setPrivacyModalOpen(true);
  };

  const handlePrivacySave = (settings) => {
    setSessions(prev => prev.map(session => 
      session.id === selectedSessionForPrivacy
        ? {
            ...session,
            privacy_settings: {
              ...session.privacy_settings,
              ...settings,
              expires_at: settings.auto_delete_after 
                ? new Date(Date.now() + getMillisecondsFromDuration(settings.auto_delete_after)).toISOString()
                : null
            }
          }
        : session
    ));
    setPrivacyModalOpen(false);
    setSelectedSessionForPrivacy(null);
  };

  const getMillisecondsFromDuration = (duration) => {
    switch (duration) {
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionForPrivacy);

  return (
    <div>
      <div data-testid="chat-sessions">
        {sessions.map(session => (
          <MockChatSessionItem
            key={session.id}
            session={session}
            onPrivacySettings={handlePrivacySettings}
            onSelect={(id) => console.log('Selected session:', id)}
          />
        ))}
      </div>
      <MockPrivacyControlsModal
        isOpen={privacyModalOpen}
        onClose={() => {
          setPrivacyModalOpen(false);
          setSelectedSessionForPrivacy(null);
        }}
        onSave={handlePrivacySave}
        sessionId={selectedSessionForPrivacy}
        initialSettings={selectedSession?.privacy_settings}
      />
    </div>
  );
};

describe('Privacy Controls Frontend Tests', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Visual Indicators', () => {
    test('should display lock icon for locked conversations', () => {
      render(<MockChatApp />);
      
      const lockedSession = screen.getByTestId('session-2');
      const lockIcon = screen.getByTestId('lock-icon');
      
      expect(lockedSession).toHaveClass('locked');
      expect(lockIcon).toBeInTheDocument();
      expect(lockIcon).toHaveTextContent('🔒');
    });

    test('should display timer icon for conversations with auto-delete', () => {
      render(<MockChatApp />);
      
      const timerIcon = screen.getByTestId('timer-icon');
      const timeRemaining = screen.getByTestId('time-remaining');
      
      expect(timerIcon).toBeInTheDocument();
      expect(timerIcon).toHaveTextContent('⏱️');
      expect(timeRemaining).toBeInTheDocument();
    });

    test('should show expired label for expired conversations', () => {
      // Create an expired session
      const expiredSessions = [
        {
          id: '4',
          sessionName: 'Expired Chat',
          lastMessage: 'This has expired',
          privacy_settings: {
            is_locked: false,
            auto_delete_after: '1h',
            expires_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
          }
        }
      ];

      const ExpiredChatApp = () => (
        <div>
          <MockChatSessionItem
            session={expiredSessions[0]}
            onPrivacySettings={() => {}}
            onSelect={() => {}}
          />
        </div>
      );

      render(<ExpiredChatApp />);
      
      const expiredSession = screen.getByTestId('session-4');
      const expiredLabel = screen.getByTestId('expired-label');
      
      expect(expiredSession).toHaveClass('expired');
      expect(expiredLabel).toBeInTheDocument();
      expect(expiredLabel).toHaveTextContent('Expired');
    });
  });

  describe('Privacy Modal Functionality', () => {
    test('should open privacy modal when privacy button is clicked', async () => {
      render(<MockChatApp />);
      
      const privacyButton = screen.getByTestId('privacy-button-1');
      fireEvent.click(privacyButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('privacy-modal')).toBeInTheDocument();
      });
    });

    test('should update lock setting in modal', async () => {
      render(<MockChatApp />);
      
      const privacyButton = screen.getByTestId('privacy-button-1');
      fireEvent.click(privacyButton);
      
      await waitFor(() => {
        const lockCheckbox = screen.getByTestId('lock-checkbox');
        expect(lockCheckbox).not.toBeChecked();
        
        fireEvent.click(lockCheckbox);
        expect(lockCheckbox).toBeChecked();
      });
    });

    test('should update auto-delete setting in modal', async () => {
      render(<MockChatApp />);
      
      const privacyButton = screen.getByTestId('privacy-button-1');
      fireEvent.click(privacyButton);
      
      await waitFor(() => {
        const autoDeleteSelect = screen.getByTestId('auto-delete-select');
        expect(autoDeleteSelect.value).toBe('');
        
        fireEvent.change(autoDeleteSelect, { target: { value: '24h' } });
        expect(autoDeleteSelect.value).toBe('24h');
      });
    });

    test('should save privacy settings when save button is clicked', async () => {
      render(<MockChatApp />);
      
      const privacyButton = screen.getByTestId('privacy-button-1');
      fireEvent.click(privacyButton);
      
      await waitFor(() => {
        const lockCheckbox = screen.getByTestId('lock-checkbox');
        const autoDeleteSelect = screen.getByTestId('auto-delete-select');
        const saveButton = screen.getByTestId('save-button');
        
        fireEvent.click(lockCheckbox);
        fireEvent.change(autoDeleteSelect, { target: { value: '24h' } });
        fireEvent.click(saveButton);
      });
      
      // Modal should close
      await waitFor(() => {
        expect(screen.queryByTestId('privacy-modal')).not.toBeInTheDocument();
      });
      
      // Session should now show lock icon
      await waitFor(() => {
        const session1 = screen.getByTestId('session-1');
        expect(session1).toHaveClass('locked');
      });
    });

    test('should close modal when cancel button is clicked', async () => {
      render(<MockChatApp />);
      
      const privacyButton = screen.getByTestId('privacy-button-1');
      fireEvent.click(privacyButton);
      
      await waitFor(() => {
        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('privacy-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Access Control', () => {
    test('should show alert when clicking locked conversation', () => {
      // Mock window.alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<MockChatApp />);
      
      const lockedSession = screen.getByTestId('session-2');
      fireEvent.click(lockedSession);
      
      expect(alertSpy).toHaveBeenCalledWith('This conversation is locked');
      
      alertSpy.mockRestore();
    });

    test('should show alert when clicking expired conversation', () => {
      // Mock window.alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      // Create expired session component
      const expiredSession = {
        id: '5',
        sessionName: 'Expired Chat',
        lastMessage: 'This has expired',
        privacy_settings: {
          is_locked: false,
          auto_delete_after: '1h',
          expires_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      };

      const ExpiredTest = () => (
        <MockChatSessionItem
          session={expiredSession}
          onPrivacySettings={() => {}}
          onSelect={() => {}}
        />
      );

      render(<ExpiredTest />);
      
      const expiredSessionElement = screen.getByTestId('session-5');
      fireEvent.click(expiredSessionElement);
      
      expect(alertSpy).toHaveBeenCalledWith('This conversation has expired');
      
      alertSpy.mockRestore();
    });
  });

  describe('Time Calculation', () => {
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

      const now = new Date();
      
      // Test various time differences
      expect(getTimeRemaining(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000))).toBe('2d 3h');
      expect(getTimeRemaining(new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000))).toBe('5h 30m');
      expect(getTimeRemaining(new Date(now.getTime() + 45 * 60 * 1000))).toBe('45m');
      expect(getTimeRemaining(new Date(now.getTime() - 60 * 60 * 1000))).toBe('Expired');
      expect(getTimeRemaining(null)).toBe(null);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing privacy settings gracefully', () => {
      const sessionWithoutPrivacy = {
        id: '6',
        sessionName: 'No Privacy Settings',
        lastMessage: 'Test message'
        // No privacy_settings field
      };

      const TestComponent = () => (
        <MockChatSessionItem
          session={sessionWithoutPrivacy}
          onPrivacySettings={() => {}}
          onSelect={() => {}}
        />
      );

      // Should not throw error
      expect(() => render(<TestComponent />)).not.toThrow();
      
      render(<TestComponent />);
      
      // Should render without privacy indicators
      expect(screen.queryByTestId('lock-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('timer-icon')).not.toBeInTheDocument();
    });
  });
});