from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import EmployeeProfileViewSet, SalaryInsightsAPIView, CountryListAPIView

router = DefaultRouter()
router.register(r'', EmployeeProfileViewSet, basename='employee')

urlpatterns = [
    path('insights/salary/', SalaryInsightsAPIView.as_view(), name='salary-insights'),
    path('insights/countries/', CountryListAPIView.as_view(), name='country-list'),
] + router.urls
