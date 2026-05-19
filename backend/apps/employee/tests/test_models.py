from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date
from apps.employee.models import EmployeeProfile, Department, JobPosition


User = get_user_model()

class EmployeeModelTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email='emp1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='emp2@example.com', password='password123')

    def test_create_employee_profile(self):
        profile = EmployeeProfile.objects.create(
            user=self.user1,
            first_name='John',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='Male',
            salary=100000,
            country='USA',
            phone_number='1234567890',
            joining_date=date.today(),
            status='Active'
        )
        self.assertEqual(profile.user, self.user1)
        self.assertTrue(profile.employee_id.startswith('EMP'))
        self.assertEqual(profile.status, 'Active')
        self.assertEqual(str(profile), f"{profile.employee_id} - {self.user1.email}")

    def test_employee_id_auto_increment(self):
        profile1 = EmployeeProfile.objects.create(
            user=self.user1,
            first_name='John',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='Male',
            salary=100000,
            country='USA',
            phone_number='1234567890',
            joining_date=date.today(),
            status='Active'
        )
        profile2 = EmployeeProfile.objects.create(
            user=self.user2,
            first_name='Jane',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='Female',
            salary=100000,
            country='USA',
            phone_number='1234567890',
            joining_date=date.today(),
            status='Active'
        )
        self.assertNotEqual(profile1.employee_id, profile2.employee_id)
        
        # Extract numeric parts and check increment
        num1 = int(profile1.employee_id.replace('EMP', ''))
        num2 = int(profile2.employee_id.replace('EMP', ''))
        self.assertTrue(num2 > num1)

    def test_create_department(self):
        dept = Department.objects.create(
            name='Engineering',
            code='ENG',
            description='Engineering Department'
        )
        self.assertEqual(dept.name, 'Engineering')
        self.assertEqual(dept.code, 'ENG')
        self.assertEqual(str(dept), 'Engineering (ENG)')

    def test_department_head_assignment(self):
        profile = EmployeeProfile.objects.create(
            user=self.user1,
            joining_date=date.today(),
            first_name='John',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='Male',
            salary=100000,
            country='USA',
            phone_number='1234567890',
            status='Active'
        )
        dept = Department.objects.create(
            name='Engineering',
            code='ENG',
            department_head=profile
        )
        self.assertEqual(dept.department_head, profile)
        
        # Test OneToOneField constraint
        profile2 = EmployeeProfile.objects.create(
            user=self.user2,
            joining_date=date.today(),
            first_name='Jane',
            last_name='Doe',
            date_of_birth=date(1990, 1, 1),
            gender='Female',
            salary=100000,
            country='USA',
            phone_number='1234567890',
            status='Active'
        )
        dept2 = Department.objects.create(
            name='HR',
            code='HR'
        )
        # Attempt to assign the same profile to another department
        dept2.department_head = profile
        with self.assertRaises(Exception):
            dept2.save()
            # Django's OneToOneField uniqueness validation on save/integrity error

    def test_create_job_position(self):
        dept = Department.objects.create(
            name='Engineering',
            code='ENG'
        )
        job = JobPosition.objects.create(
            title='Software Engineer',
            department=dept,
            job_description='Develops software',
            grade_level='L3'
        )
        self.assertEqual(job.title, 'Software Engineer')
        self.assertEqual(job.department, dept)
        self.assertEqual(str(job), 'Software Engineer - Engineering')
