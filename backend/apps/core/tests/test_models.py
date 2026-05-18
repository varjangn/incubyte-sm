from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class CustomUserTests(TestCase):
    def test_create_user_with_email_successful(self):
        user = User.objects.create_user(email='test@example.com', password='password123')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_without_email_fails(self):
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(email='', password='password123')
        self.assertEqual(str(context.exception), 'The Email field must be set')

    def test_create_superuser_successful(self):
        admin = User.objects.create_superuser(email='admin@example.com', password='password123')
        self.assertEqual(admin.email, 'admin@example.com')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_user_string_representation(self):
        user = User.objects.create_user(email='test@example.com', password='password123')
        self.assertEqual(str(user), 'test@example.com')
