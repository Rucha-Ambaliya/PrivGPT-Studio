from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()

class User:
    def _init_(self, email, password, role='user'):
        self.email = email.lower()
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'created_at': self.created_at
        }