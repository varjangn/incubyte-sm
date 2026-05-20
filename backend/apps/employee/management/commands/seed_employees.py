import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from apps.employee.models import EmployeeProfile, Department, JobPosition
from datetime import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with employee data from a CSV file.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file containing employee data.')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']

        if not os.path.exists(csv_file_path):
            self.stderr.write(self.style.ERROR(f'CSV file "{csv_file_path}" does not exist.'))
            return

        self.stdout.write('Seeding data...')
        
        # Get or create the default user
        user, created = User.objects.get_or_create(
            email='normal@example.com',
            defaults={
                'username': 'normal_user',
                'first_name': 'Normal',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('password123')
            user.save()

        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            data = list(reader)

        if not data:
            self.stdout.write(self.style.WARNING('CSV file is empty.'))
            return

        with transaction.atomic():
            # 1. Gather and create departments
            department_names = set(row['department'] for row in data)
            departments = {}
            for index, dept_name in enumerate(department_names):
                dept, _ = Department.objects.get_or_create(
                    name=dept_name,
                    defaults={'code': f'DPT{index+1:03d}', 'description': f'{dept_name} Department'}
                )
                departments[dept_name] = dept

            # 2. Determine starting employee_id
            last_profile = EmployeeProfile.objects.order_by('-id').first()
            if not last_profile or not last_profile.employee_id.startswith('EMP'):
                last_id_num = 0
            else:
                try:
                    last_id_num = int(last_profile.employee_id.replace('EMP', ''))
                except ValueError:
                    last_id_num = 0

            # 3. Create EmployeeProfiles in bulk
            employees_to_create = []
            employee_ids = []
            
            self.stdout.write('Preparing employee records...')
            for row in data:
                last_id_num += 1
                emp_id_str = f'EMP{last_id_num:04d}'
                
                try:
                    dob = datetime.strptime(row['date_of_birth'], '%Y-%m-%d').date() if row['date_of_birth'] else None
                    join_date = datetime.strptime(row['joining_date'], '%Y-%m-%d').date()
                except ValueError:
                    dob = None
                    join_date = datetime.now().date()

                employee = EmployeeProfile(
                    user=user,
                    employee_id=emp_id_str,
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    salary=row['salary'],
                    country=row['country'],
                    date_of_birth=dob,
                    gender=row['gender'],
                    phone_number=row['phone_number'],
                    joining_date=join_date,
                    status=row['status']
                )
                employees_to_create.append(employee)
                employee_ids.append(emp_id_str)

            self.stdout.write('Inserting employee records...')
            EmployeeProfile.objects.bulk_create(employees_to_create, batch_size=1000)

            # 4. Fetch inserted employees to get their DB IDs
            self.stdout.write('Fetching inserted employees...')
            created_employees = EmployeeProfile.objects.filter(employee_id__in=employee_ids)
            emp_dict = {emp.employee_id: emp for emp in created_employees}

            # 5. Create JobPositions in bulk
            self.stdout.write('Preparing job position records...')
            job_positions_to_create = []
            for idx, row in enumerate(data):
                # We need to map the row back to the employee_id
                # Since we inserted in the exact same order, we can use the employee_ids list
                emp_id_str = employee_ids[idx]
                employee_instance = emp_dict.get(emp_id_str)
                dept_instance = departments[row['department']]
                
                if employee_instance:
                    jp = JobPosition(
                        title=row['job_title'],
                        department=dept_instance,
                        job_description=f'{row["job_title"]} in {dept_instance.name}',
                        grade_level='L1',
                        employees=employee_instance
                    )
                    job_positions_to_create.append(jp)

            self.stdout.write('Inserting job positions...')
            JobPosition.objects.bulk_create(job_positions_to_create, batch_size=1000)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(data)} employee records.'))
