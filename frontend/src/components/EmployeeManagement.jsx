import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      await axios.post('/api/employees/', formData);
      fetchEmployees();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleUpdateEmployee = async (formData) => {
    try {
      await axios.put(`/api/employees/${editingEmployee.id}/`, formData);
      fetchEmployees();
      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/employees/${id}/`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee", error);
      }
    }
  };

  return (
    <div className="employee-management">
      <div className="header-actions">
        <h2>Employees</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Add Employee</button>
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>
                    <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => { setEditingEmployee(emp); setShowForm(true); }}>Edit</button>
                    <button className="btn-icon delete" onClick={() => handleDeleteEmployee(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
