from django.db import models
from django.conf import settings
from django.db import transaction


class EmployeeProfile(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Suspended', 'Suspended'),
        ('Terminated', 'Terminated'),
        ('On Leave', 'On Leave'),
    ]

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profiles')
    employee_id = models.CharField(max_length=20, unique=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    # salary of employee
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    country = models.CharField(max_length=50)

    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    joining_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')


    def save(self, *args, **kwargs):
        if not self.employee_id:
            # Note: This approach might have race conditions under heavy concurrent load
            # A more robust solution for high concurrency would be database sequences.
            with transaction.atomic():
                last_profile = EmployeeProfile.objects.select_for_update().order_by('-id').first()
                if not last_profile or not last_profile.employee_id.startswith('EMP'):
                    self.employee_id = 'EMP0001'
                else:
                    try:
                        last_id = int(last_profile.employee_id.replace('EMP', ''))
                        self.employee_id = f'EMP{last_id + 1:04d}'
                    except ValueError:
                        self.employee_id = 'EMP0001'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee_id} - {self.user.email}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    # The requirement changed to OneToOneField for department head
    department_head = models.OneToOneField(
        EmployeeProfile, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='headed_department'
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class JobPosition(models.Model):
    title = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='job_positions')
    job_description = models.TextField(blank=True)
    grade_level = models.CharField(max_length=50, blank=True)

    employees = models.ForeignKey(EmployeeProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_position')

    def __str__(self):
        return f"{self.title} - {self.department.name}"
