from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.employee.models import EmployeeProfile, Department, JobPosition

User = get_user_model()

class SalaryInsightsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='testpassword123')
        
        self.eng_dept = Department.objects.create(name='Engineering', code='ENG01')
        self.hr_dept = Department.objects.create(name='Human Resources', code='HR01')
        
        # Employee 1: India, Eng, Software Engineer, 50000
        self.emp1 = EmployeeProfile.objects.create(
            user=self.user,
            first_name='John', last_name='Doe',
            salary=50000, country='India',
            joining_date='2020-01-01', status='Active'
        )
        JobPosition.objects.create(title='Software Engineer', department=self.eng_dept, employees=self.emp1)
        
        # Employee 2: India, Eng, Software Engineer, 60000
        self.emp2 = EmployeeProfile.objects.create(
            user=self.user,
            first_name='Jane', last_name='Smith',
            salary=60000, country='India',
            joining_date='2020-02-01', status='Active'
        )
        JobPosition.objects.create(title='Software Engineer', department=self.eng_dept, employees=self.emp2)

        # Employee 3: India, HR, HR Manager, 40000
        self.emp3 = EmployeeProfile.objects.create(
            user=self.user,
            first_name='Alice', last_name='Johnson',
            salary=40000, country='India',
            joining_date='2020-03-01', status='Active'
        )
        JobPosition.objects.create(title='HR Manager', department=self.hr_dept, employees=self.emp3)

        # Employee 4: USA, Eng, Software Engineer, 100000
        self.emp4 = EmployeeProfile.objects.create(
            user=self.user,
            first_name='Bob', last_name='Brown',
            salary=100000, country='USA',
            joining_date='2020-04-01', status='Active'
        )
        JobPosition.objects.create(title='Software Engineer', department=self.eng_dept, employees=self.emp4)

        # Assuming the url name will be 'salary-insights'
        self.url = reverse('salary-insights')

    def test_get_global_insights(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertIn('overall_stats', data)
        self.assertEqual(data['overall_stats']['employee_count'], 4)
        self.assertEqual(float(data['overall_stats']['min_salary']), 40000.0)
        self.assertEqual(float(data['overall_stats']['max_salary']), 100000.0)
        self.assertEqual(float(data['overall_stats']['avg_salary']), 62500.0)

    def test_get_country_insights(self):
        response = self.client.get(self.url, {'country': 'India'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertEqual(data.get('country'), 'India')
        
        # Overall stats for India
        self.assertEqual(data['overall_stats']['employee_count'], 3)
        self.assertEqual(float(data['overall_stats']['min_salary']), 40000.0)
        self.assertEqual(float(data['overall_stats']['max_salary']), 60000.0)
        self.assertEqual(float(data['overall_stats']['avg_salary']), 50000.0)
        
        # By Job Title
        job_stats = {item['job_title']: item for item in data['by_job_title']}
        self.assertEqual(job_stats['Software Engineer']['employee_count'], 2)
        self.assertEqual(float(job_stats['Software Engineer']['avg_salary']), 55000.0)
        
        self.assertEqual(job_stats['HR Manager']['employee_count'], 1)
        self.assertEqual(float(job_stats['HR Manager']['avg_salary']), 40000.0)
        
        # By Department
        dept_stats = {item['department_name']: item for item in data['by_department']}
        self.assertEqual(dept_stats['Engineering']['employee_count'], 2)
        self.assertEqual(float(dept_stats['Engineering']['avg_salary']), 55000.0)

    def test_no_data_for_country(self):
        response = self.client.get(self.url, {'country': 'UK'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['overall_stats']['employee_count'], 0)
        self.assertIsNone(data['overall_stats']['avg_salary'])


class CountryListAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test_country@example.com', password='testpassword123')
        
        # Create some employees in different countries
        EmployeeProfile.objects.create(user=self.user, first_name='John', last_name='Doe', salary=50000, country='India', joining_date='2020-01-01', status='Active')
        EmployeeProfile.objects.create(user=self.user, first_name='Jane', last_name='Smith', salary=60000, country='India', joining_date='2020-02-01', status='Active')
        EmployeeProfile.objects.create(user=self.user, first_name='Bob', last_name='Brown', salary=100000, country='USA', joining_date='2020-04-01', status='Active')
        EmployeeProfile.objects.create(user=self.user, first_name='Alice', last_name='Green', salary=80000, country='Canada', joining_date='2021-01-01', status='Active')

        self.url = reverse('country-list')

    def test_get_country_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 3)
        self.assertCountEqual(data, ['Canada', 'India', 'USA'])