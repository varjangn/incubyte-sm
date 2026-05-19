from rest_framework import viewsets
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user, _ = User.objects.get_or_create(
            email='normal@example.com',
            defaults={'password': 'password123'} # Providing a default password in case it needs to be created
        )
        serializer.save(user=user)
