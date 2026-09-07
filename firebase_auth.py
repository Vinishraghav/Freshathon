import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK (you'll need to add your own service account key)
# cred = credentials.Certificate('path/to/serviceAccountKey.json')
# firebase_admin.initialize_app(cred)

def create_user(email, password):
    """Create a new user with the given email and password."""
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return user.uid
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def verify_id_token(id_token):
    """Verify the Firebase ID token."""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None
