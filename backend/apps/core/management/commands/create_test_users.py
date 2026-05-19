from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a normal user and an admin user for testing purposes'

    def handle(self, *args, **kwargs):
        # Create normal user
        normal_user_email = 'normal@example.com'
        if not User.objects.filter(email=normal_user_email).exists():
            User.objects.create_user(
                email=normal_user_email,
                password='password123'
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created normal user: {normal_user_email} (password: password123)'))
        else:
            self.stdout.write(self.style.WARNING(f'Normal user {normal_user_email} already exists.'))

        # Create admin user
        admin_user_email = 'admin@example.com'
        if not User.objects.filter(email=admin_user_email).exists():
            User.objects.create_superuser(
                email=admin_user_email,
                password='password123'
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {admin_user_email} (password: password123)'))
        else:
            self.stdout.write(self.style.WARNING(f'Admin user {admin_user_email} already exists.'))
