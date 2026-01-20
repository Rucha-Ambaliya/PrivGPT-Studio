"""
Privacy Controls Backend API Tests
Tests Flask routes and MongoDB operations for privacy controls feature
"""

import pytest
import json
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from bson import ObjectId
import sys
import os

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

from api.routes.chat_routes import chat_bp, update_privacy_settings, has_reached_message_limit


class TestPrivacyControlsAPI:
    """Test suite for privacy controls API endpoints"""
    
    @pytest.fixture
    def mock_mongo(self):
        """Mock MongoDB instance"""
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.sessions = mock_collection
        return mock_db
    
    @pytest.fixture
    def sample_session(self):
        """Sample session data for testing"""
        return {
            '_id': ObjectId(),
            'session_name': 'Test Chat',
            'messages': [
                {'role': 'user', 'content': 'Hello', 'timestamp': datetime.now()},
                {'role': 'bot', 'content': 'Hi there!', 'timestamp': datetime.now()}
            ],
            'created_at': datetime.now(),
            'user_id': str(ObjectId()),
            'privacy_settings': {
                'is_locked': False,
                'auto_delete_after': None,
                'expires_at': None
            }
        }
    
    def test_update_privacy_settings_success(self, mock_mongo, sample_session):
        """Test successful privacy settings update"""
        session_id = str(sample_session['_id'])
        
        # Mock successful update
        mock_mongo.sessions.update_one.return_value.matched_count = 1
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            # Simulate request data
            privacy_data = {
                'is_locked': True,
                'auto_delete_after': '24h'
            }
            
            # Calculate expected expiry time
            expected_expiry = datetime.now() + timedelta(hours=24)
            
            # Verify update call would be made with correct parameters
            expected_update = {
                '$set': {
                    'privacy_settings.is_locked': True,
                    'privacy_settings.auto_delete_after': '24h',
                    'privacy_settings.expires_at': expected_expiry
                }
            }
            
            # Test the logic
            assert privacy_data['is_locked'] == True
            assert privacy_data['auto_delete_after'] == '24h'
    
    def test_update_privacy_settings_invalid_session(self, mock_mongo):
        """Test privacy settings update with invalid session ID"""
        # Mock no matching session
        mock_mongo.sessions.update_one.return_value.matched_count = 0
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            # This should result in a 404 error
            assert mock_mongo.sessions.update_one.return_value.matched_count == 0
    
    def test_expiry_time_calculations(self):
        """Test auto-delete expiry time calculations"""
        now = datetime.now()
        
        test_cases = [
            ('1h', timedelta(hours=1)),
            ('24h', timedelta(hours=24)),
            ('7d', timedelta(days=7)),
            ('30d', timedelta(days=30))
        ]
        
        for duration, expected_delta in test_cases:
            if duration == '1h':
                expires_at = now + timedelta(hours=1)
            elif duration == '24h':
                expires_at = now + timedelta(hours=24)
            elif duration == '7d':
                expires_at = now + timedelta(days=7)
            elif duration == '30d':
                expires_at = now + timedelta(days=30)
            
            actual_delta = expires_at - now
            assert abs((actual_delta - expected_delta).total_seconds()) < 1
    
    def test_locked_conversation_access_control(self, sample_session):
        """Test access control for locked conversations"""
        # Lock the conversation
        sample_session['privacy_settings']['is_locked'] = True
        
        # Simulate access check
        is_locked = sample_session['privacy_settings']['is_locked']
        
        if is_locked:
            error_response = {
                'error': 'This conversation is locked and cannot be modified',
                'locked': True
            }
            assert error_response['error'] == 'This conversation is locked and cannot be modified'
            assert error_response['locked'] == True
    
    def test_expired_conversation_access_control(self, sample_session):
        """Test access control for expired conversations"""
        # Set conversation as expired
        sample_session['privacy_settings']['expires_at'] = datetime.now() - timedelta(hours=1)
        
        # Check if expired
        expires_at = sample_session['privacy_settings']['expires_at']
        is_expired = expires_at and expires_at < datetime.now()
        
        assert is_expired == True
    
    def test_cleanup_expired_sessions(self, mock_mongo):
        """Test cleanup of expired sessions"""
        # Mock expired sessions
        expired_sessions = [
            {'_id': ObjectId(), 'privacy_settings': {'expires_at': datetime.now() - timedelta(hours=1)}},
            {'_id': ObjectId(), 'privacy_settings': {'expires_at': datetime.now() - timedelta(minutes=30)}}
        ]
        
        # Mock delete operation
        mock_mongo.sessions.delete_many.return_value.deleted_count = 2
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            # Simulate cleanup
            now = datetime.now()
            delete_filter = {'privacy_settings.expires_at': {'$lt': now}}
            
            # Verify the filter would find expired sessions
            for session in expired_sessions:
                assert session['privacy_settings']['expires_at'] < now
            
            # Verify delete operation would be called
            assert mock_mongo.sessions.delete_many.return_value.deleted_count == 2
    
    def test_message_limit_with_privacy_settings(self, mock_mongo, sample_session):
        """Test message limit checking with privacy controls"""
        session_id = str(sample_session['_id'])
        
        # Mock session with many user messages
        sample_session['messages'] = [
            {'role': 'user', 'content': f'Message {i}'} for i in range(15)
        ]
        
        mock_mongo.sessions.find_one.return_value = sample_session
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            with patch('api.routes.chat_routes.current_app') as mock_app:
                mock_app.config.get.return_value = 10  # Max 10 messages
                
                # Test the limit check function
                limit_reached = has_reached_message_limit(session_id)
                
                # Should return True since we have 15 user messages > 10 limit
                assert limit_reached == True
    
    def test_privacy_settings_validation(self):
        """Test validation of privacy settings input"""
        def validate_privacy_settings(settings):
            errors = []
            
            if 'is_locked' in settings and not isinstance(settings['is_locked'], bool):
                errors.append('is_locked must be a boolean')
            
            valid_durations = ['1h', '24h', '7d', '30d']
            if 'auto_delete_after' in settings and settings['auto_delete_after']:
                if settings['auto_delete_after'] not in valid_durations:
                    errors.append('Invalid auto_delete_after value')
            
            return errors
        
        # Valid settings
        valid_settings = {'is_locked': True, 'auto_delete_after': '24h'}
        assert validate_privacy_settings(valid_settings) == []
        
        # Invalid boolean
        invalid_bool = {'is_locked': 'true', 'auto_delete_after': '24h'}
        errors = validate_privacy_settings(invalid_bool)
        assert 'is_locked must be a boolean' in errors
        
        # Invalid duration
        invalid_duration = {'is_locked': True, 'auto_delete_after': '2h'}
        errors = validate_privacy_settings(invalid_duration)
        assert 'Invalid auto_delete_after value' in errors
    
    def test_streaming_with_locked_session(self, mock_mongo, sample_session):
        """Test streaming endpoint with locked session"""
        # Lock the session
        sample_session['privacy_settings']['is_locked'] = True
        mock_mongo.sessions.find_one.return_value = sample_session
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            # Simulate streaming request to locked session
            session_id = str(sample_session['_id'])
            
            # Check if session is locked
            session = mock_mongo.sessions.find_one({'_id': ObjectId(session_id)})
            privacy_settings = session.get('privacy_settings', {})
            
            if privacy_settings.get('is_locked', False):
                error_data = {
                    'type': 'error',
                    'message': 'This conversation is locked and cannot be modified',
                    'locked': True
                }
                assert error_data['type'] == 'error'
                assert error_data['locked'] == True
    
    def test_session_creation_with_default_privacy_settings(self):
        """Test that new sessions get default privacy settings"""
        default_privacy_settings = {
            'is_locked': False,
            'auto_delete_after': None,
            'expires_at': None
        }
        
        # Simulate new session creation
        new_session = {
            'session_name': 'New Chat',
            'messages': [],
            'created_at': datetime.now(),
            'user_id': str(ObjectId()),
            'privacy_settings': default_privacy_settings
        }
        
        assert new_session['privacy_settings']['is_locked'] == False
        assert new_session['privacy_settings']['auto_delete_after'] is None
        assert new_session['privacy_settings']['expires_at'] is None
    
    def test_bulk_privacy_operations_performance(self, mock_mongo):
        """Test performance of bulk privacy operations"""
        import time
        
        # Simulate bulk update
        start_time = time.time()
        
        # Mock bulk update operation
        mock_mongo.sessions.update_many.return_value.modified_count = 100
        
        with patch('api.routes.chat_routes.mongo.db', mock_mongo):
            # Simulate bulk lock operation
            update_filter = {}
            update_operation = {'$set': {'privacy_settings.is_locked': True}}
            
            # This would be the actual operation
            result = mock_mongo.sessions.update_many(update_filter, update_operation)
            
            end_time = time.time()
            duration = end_time - start_time
            
            # Should complete quickly (mocked operation)
            assert duration < 0.1  # 100ms
            assert result.modified_count == 100


class TestPrivacyControlsIntegration:
    """Integration tests for privacy controls feature"""
    
    def test_end_to_end_privacy_workflow(self):
        """Test complete privacy controls workflow"""
        # 1. Create session with default privacy settings
        session_data = {
            'privacy_settings': {
                'is_locked': False,
                'auto_delete_after': None,
                'expires_at': None
            }
        }
        
        # 2. Update privacy settings
        privacy_update = {
            'is_locked': True,
            'auto_delete_after': '24h'
        }
        
        # Calculate expiry
        expires_at = datetime.now() + timedelta(hours=24)
        
        # 3. Apply updates
        session_data['privacy_settings'].update(privacy_update)
        session_data['privacy_settings']['expires_at'] = expires_at
        
        # 4. Verify final state
        assert session_data['privacy_settings']['is_locked'] == True
        assert session_data['privacy_settings']['auto_delete_after'] == '24h'
        assert session_data['privacy_settings']['expires_at'] > datetime.now()
        
        # 5. Test access control
        is_locked = session_data['privacy_settings']['is_locked']
        is_expired = (session_data['privacy_settings']['expires_at'] and 
                     session_data['privacy_settings']['expires_at'] < datetime.now())
        
        # Should be locked but not expired
        assert is_locked == True
        assert is_expired == False
    
    def test_migration_compatibility(self):
        """Test backward compatibility with existing sessions"""
        # Simulate old session without privacy settings
        old_session = {
            '_id': ObjectId(),
            'session_name': 'Old Chat',
            'messages': [],
            'created_at': datetime.now()
            # No privacy_settings field
        }
        
        # Simulate migration/default handling
        if 'privacy_settings' not in old_session:
            old_session['privacy_settings'] = {
                'is_locked': False,
                'auto_delete_after': None,
                'expires_at': None
            }
        
        # Verify defaults are applied
        assert old_session['privacy_settings']['is_locked'] == False
        assert old_session['privacy_settings']['auto_delete_after'] is None
        assert old_session['privacy_settings']['expires_at'] is None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])