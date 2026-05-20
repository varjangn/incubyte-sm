import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Insights.css';

const Insights = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch country list on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('/api/employees/insights/countries/');
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch insights data whenever selectedCountry changes
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const url = selectedCountry ? `/api/employees/insights/salary/?country=${encodeURIComponent(selectedCountry)}` : '/api/insights/salary/';
        const response = await axios.get(url);
        setInsightsData(response.data);
      } catch (error) {
        console.error("Error fetching salary insights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [selectedCountry]);

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h2>Salary Insights</h2>
        <div className="filter-group">
          <label htmlFor="country-filter">Filter by Country:</label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading insights...</p>
      ) : insightsData ? (
        <div className="insights-content">
          {/* Overall Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Employees</h3>
              <p className="stat-value">{insightsData.overall_stats.employee_count}</p>
            </div>
            <div className="stat-card">
              <h3>Average Salary</h3>
              <p className="stat-value">
                {insightsData.overall_stats.avg_salary
                  ? `$${Number(insightsData.overall_stats.avg_salary).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
            <div className="stat-card">
              <h3>Highest Salary</h3>
              <p className="stat-value">
                {insightsData.overall_stats.max_salary
                  ? `$${Number(insightsData.overall_stats.max_salary).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
            <div className="stat-card">
              <h3>Lowest Salary</h3>
              <p className="stat-value">
                {insightsData.overall_stats.min_salary
                  ? `$${Number(insightsData.overall_stats.min_salary).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="charts-container">
            {/* Job Title Chart */}
            <div className="chart-wrapper">
              <h3>Average Salary by Job Title</h3>
              {insightsData.by_job_title.length > 0 ? (
                <div className="chart-inner">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insightsData.by_job_title}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="job_title" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="avg_salary" fill="#ff7e67" name="Average Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p>No job title data available.</p>
              )}
            </div>

            {/* Department Chart */}
            <div className="chart-wrapper">
              <h3>Average Salary by Department</h3>
              {insightsData.by_department.length > 0 ? (
                <div className="chart-inner">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insightsData.by_department}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department_name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="avg_salary" fill="#4a90e2" name="Average Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p>No department data available.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
};

export default Insights;
