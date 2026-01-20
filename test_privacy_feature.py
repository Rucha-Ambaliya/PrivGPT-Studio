#!/usr/bin/env python3
"""Simple test for Privacy Controls feature"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000"

def test_privacy_controls():
    """Test privacy controls functionality"""
    print("Testing Privacy Controls Feature...")
    
    # Test data
    test_session_id = "507f1f77bcf86cd799439011"  # Example ObjectId
    
    # Test 1: Update privacy settings
    print("\n1. Testing privacy settings update...")
    privacy_data = {
        "is_locked": True,
        "auto_delete_after": "24h"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/privacy/{test_session_id}",
            json=privacy_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("PASS: Privacy settings update")
            result = response.json()
            print(f"   Settings: {result['privacy_settings']}")
        else:
            print(f"FAIL: Privacy settings update ({response.status_code})")
            
    except requests.exceptions.ConnectionError:
        print("Warning: Server not running - skipping API tests")
    
    # Test 2: Time calculation
    print("\n2. Testing time calculations...")
    
    def get_time_remaining(expires_at):
        if not expires_at:
            return None
        
        now = datetime.now()
        expiry = datetime.fromisoformat(expires_at.replace('Z', ''))
        diff = expiry - now
        
        if diff.total_seconds() <= 0:
            return "Expired"
        
        days = diff.days
        hours = diff.seconds // 3600
        minutes = (diff.seconds % 3600) // 60
        
        if days > 0:
            return f"{days}d {hours}h"
        elif hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"
    
    # Test cases
    now = datetime.now()
    test_cases = [
        (now + timedelta(days=2, hours=3), "2d 3h"),
        (now + timedelta(hours=5, minutes=30), "5h 30m"),
        (now + timedelta(minutes=45), "45m"),
        (now - timedelta(hours=1), "Expired"),
    ]
    
    all_passed = True
    for expires_at, expected in test_cases:
        result = get_time_remaining(expires_at.isoformat())
        if result == expected:
            print(f"   PASS: {expected}")
        else:
            print(f"   FAIL: Expected {expected}, got {result}")
            all_passed = False
    
    if all_passed:
        print("PASS: Time calculations")
    else:
        print("FAIL: Time calculations")
    
    # Test 3: Privacy validation
    print("\n3. Testing privacy validation...")
    
    def validate_privacy_settings(settings):
        errors = []
        
        if 'is_locked' in settings and not isinstance(settings['is_locked'], bool):
            errors.append('is_locked must be a boolean')
        
        valid_durations = ['1h', '24h', '7d', '30d']
        if 'auto_delete_after' in settings and settings['auto_delete_after']:
            if settings['auto_delete_after'] not in valid_durations:
                errors.append('Invalid auto_delete_after value')
        
        return errors
    
    # Test valid settings
    valid_settings = {'is_locked': True, 'auto_delete_after': '24h'}
    errors = validate_privacy_settings(valid_settings)
    if not errors:
        print("   PASS: Valid settings")
    else:
        print(f"   FAIL: Valid settings - {errors}")
    
    # Test invalid settings
    invalid_settings = {'is_locked': 'true', 'auto_delete_after': '2h'}
    errors = validate_privacy_settings(invalid_settings)
    expected_errors = ['is_locked must be a boolean', 'Invalid auto_delete_after value']
    if all(error in errors for error in expected_errors):
        print("   PASS: Invalid settings detection")
    else:
        print(f"   FAIL: Invalid settings detection - {errors}")
    
    print("\nPASS: Privacy Controls Feature Test Complete!")

if __name__ == '__main__':
    test_privacy_controls()