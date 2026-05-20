from django.contrib import admin
from .models import EmployeeProfile, Department, JobPosition


@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'full_name', 'salary', 'country', 'joining_date', 'status')
    list_filter = ('status', 'country', 'gender', 'joining_date')
    search_fields = ('employee_id', 'first_name', 'last_name', 'user__email')
    readonly_fields = ('employee_id',)
    date_hierarchy = 'joining_date'

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'department_head')
    list_filter = ('name',)
    search_fields = ('name', 'code', 'description')

@admin.register(JobPosition)
class JobPositionAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'grade_level', 'employees')
    list_filter = ('department', 'grade_level')
    search_fields = ('title', 'job_description', 'department__name')
