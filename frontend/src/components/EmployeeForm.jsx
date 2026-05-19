import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || '',
    last_name: employee?.last_name || '',
    salary: employee?.salary || '',
    country: employee?.country || '',
    date_of_birth: employee?.date_of_birth || '',
    gender: employee?.gender || 'Male',
    phone_number: employee?.phone_number || '',
    joining_date: employee?.joining_date || '',
    status: employee?.status || 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="employee-form">
        <h3>{employee ? 'Edit Employee' : 'Add Employee'}</h3>
        
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input type="number" step="0.01" id="salary" name="salary" value={formData.salary} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="joining_date">Joining Date</label>
          <input type="date" id="joining_date" name="joining_date" value={formData.joining_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Terminated">Terminated</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
