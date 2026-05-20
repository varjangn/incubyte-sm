import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/employees/?page=${page}`);
      const data = response.data;
      if (data.results) {
        setEmployees(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setEmployees(data);
        setTotalPages(1);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      await axios.post('/api/employees/', formData);
      fetchEmployees(1);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleUpdateEmployee = async (formData) => {
    try {
      await axios.put(`/api/employees/${editingEmployee.id}/`, formData);
      fetchEmployees(currentPage);
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
        fetchEmployees(currentPage);
      } catch (error) {
        console.error("Error deleting employee", error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchEmployees(page);
    }
  };

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 2) {
      endPage = Math.min(totalPages, 5);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(1, totalPages - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
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
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn-page" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {getPageNumbers().map(num => (
                  <button 
                    key={num} 
                    className={`btn-page ${currentPage === num ? 'active' : ''}`}
                    onClick={() => handlePageChange(num)}
                    aria-label={`${num}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button 
                className="btn-page" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
