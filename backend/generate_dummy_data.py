import csv
import random
from datetime import datetime, timedelta

def generate_csv(filename, num_records):
    first_names = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura', 'Robert', 'Emma', 'William', 'Olivia', 'James', 'Sophia', 'Joseph', 'Ava', 'Charles', 'Isabella']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
    countries = ['USA', 'UK', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Japan', 'Brazil', 'South Africa']
    genders = ['Male', 'Female', 'Other']
    statuses = ['Active', 'Suspended', 'Terminated', 'On Leave']
    job_titles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'HR Specialist', 'Sales Representative', 'Marketing Analyst', 'QA Engineer', 'DevOps Engineer']
    departments = ['Engineering', 'Data', 'Product', 'Human Resources', 'Sales', 'Marketing', 'Quality Assurance', 'Operations']

    start_date = datetime(1970, 1, 1)
    end_date_dob = datetime(2000, 12, 31)
    
    join_start = datetime(2010, 1, 1)
    join_end = datetime(2023, 12, 31)

    def random_date(start, end):
        delta = end - start
        random_days = random.randrange(delta.days)
        return start + timedelta(days=random_days)

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['first_name', 'last_name', 'email', 'salary', 'country', 'date_of_birth', 'gender', 'phone_number', 'joining_date', 'status', 'department', 'job_title'])
        
        for i in range(num_records):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            email = f"{fn.lower()}.{ln.lower()}{i}@example.com"
            salary = round(random.uniform(40000, 150000), 2)
            country = random.choice(countries)
            dob = random_date(start_date, end_date_dob).strftime('%Y-%m-%d')
            gender = random.choice(genders)
            phone = f"+1{random.randint(1000000000, 9999999999)}"
            join = random_date(join_start, join_end).strftime('%Y-%m-%d')
            status = random.choice(statuses)
            dept = random.choice(departments)
            title = random.choice(job_titles)
            
            writer.writerow([fn, ln, email, salary, country, dob, gender, phone, join, status, dept, title])

if __name__ == "__main__":
    generate_csv('dummy_employees.csv', 10000)
    print("Generated dummy_employees.csv with 10000 records.")
