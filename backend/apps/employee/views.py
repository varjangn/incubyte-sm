from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Min, Max, Avg, Count
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


class SalaryInsightsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        country = request.query_params.get('country')
        queryset = EmployeeProfile.objects.all()

        if country:
            queryset = queryset.filter(country=country)

        # Overall stats
        overall_stats = queryset.aggregate(
            employee_count=Count('id'),
            min_salary=Min('salary'),
            max_salary=Max('salary'),
            avg_salary=Avg('salary')
        )

        # By Job Title
        by_job_title = list(
            queryset.values('job_position__title')
            .annotate(
                employee_count=Count('id'),
                avg_salary=Avg('salary')
            )
            .order_by('-employee_count')
        )

        cleaned_job_title = [
            {
                'job_title': item['job_position__title'] or 'Unassigned',
                'employee_count': item['employee_count'],
                'avg_salary': item['avg_salary']
            } for item in by_job_title if item['job_position__title'] is not None
        ]

        # By Department
        by_department = list(
            queryset.values('job_position__department__name')
            .annotate(
                employee_count=Count('id'),
                avg_salary=Avg('salary')
            )
            .order_by('-employee_count')
        )

        cleaned_department = [
            {
                'department_name': item['job_position__department__name'] or 'Unassigned',
                'employee_count': item['employee_count'],
                'avg_salary': item['avg_salary']
            } for item in by_department if item['job_position__department__name'] is not None
        ]

        response_data = {
            'overall_stats': overall_stats,
            'by_job_title': cleaned_job_title,
            'by_department': cleaned_department
        }
        if country:
            response_data['country'] = country

        return Response(response_data)


class CountryListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        countries = EmployeeProfile.objects.values_list('country', flat=True).distinct().order_by('country')
        # Filter out empty or None countries if any exist
        countries_list = [c for c in countries if c]
        return Response(countries_list)

