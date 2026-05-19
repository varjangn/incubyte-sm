from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.employee.models import EmployeeProfile
from datetime import date

User = get_user_model()

class EmployeeProfileAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email='emp1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='emp2@example.com', password='password123')
        self.list_create_url = '/api/employees/'
    
    def test_create_employee_profile_api(self):
        data = {
            'user': self.user1.id,
            'first_name': 'John',
            'last_name': 'Doe',
            'salary': '100000.00',
            'country': 'USA',
            'joining_date': '2026-01-01',
            'status': 'Active'
        }
        response = self.client.post(self.list_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EmployeeProfile.objects.count(), 1)
        self.assertEqual(EmployeeProfile.objects.first().first_name, 'John')
        self.assertTrue(EmployeeProfile.objects.first().employee_id.startswith('EMP'))

    def test_list_employee_profiles_api(self):
        EmployeeProfile.objects.create(
            user=self.user1, first_name='John', last_name='Doe',
            salary=100000, country='USA', joining_date=date(2026, 1, 1)
        )
        EmployeeProfile.objects.create(
            user=self.user2, first_name='Jane', last_name='Smith',
            salary=120000, country='UK', joining_date=date(2026, 1, 2)
        )
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # response.data could be paginated or a direct list depending on settings, assuming direct list for standard viewset
        self.assertEqual(len(response.data), 2)

    def test_retrieve_employee_profile_api(self):
        profile = EmployeeProfile.objects.create(
            user=self.user1, first_name='John', last_name='Doe',
            salary=100000, country='USA', joining_date=date(2026, 1, 1)
        )
        url = f'{self.list_create_url}{profile.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'John')
        self.assertEqual(response.data['employee_id'], profile.employee_id)

    def test_update_employee_profile_api(self):
        profile = EmployeeProfile.objects.create(
            user=self.user1, first_name='John', last_name='Doe',
            salary=100000, country='USA', joining_date=date(2026, 1, 1)
        )
        url = f'{self.list_create_url}{profile.id}/'
        data = {'salary': '150000.00'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile.refresh_from_db()
        self.assertEqual(profile.salary, 150000.00)

    def test_delete_employee_profile_api(self):
        profile = EmployeeProfile.objects.create(
            user=self.user1, first_name='John', last_name='Doe',
            salary=100000, country='USA', joining_date=date(2026, 1, 1)
        )
        url = f'{self.list_create_url}{profile.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EmployeeProfile.objects.count(), 0)

    def test_create_employee_missing_fields(self):
        data = {
            'user': self.user1.id,
            'first_name': 'John'
        }
        response = self.client.post(self.list_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('last_name', response.data)
        self.assertIn('salary', response.data)
        self.assertIn('joining_date', response.data)
