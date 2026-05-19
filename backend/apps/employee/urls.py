from rest_framework.routers import DefaultRouter
from .views import EmployeeProfileViewSet

router = DefaultRouter()
router.register(r'', EmployeeProfileViewSet, basename='employee')

urlpatterns = router.urls
