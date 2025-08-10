import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AssignmentForm = ({ assignments, setAssignments, editingAssignment, setEditingAssignment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', assignedIntern: '', startDate: '', deadline: '' });

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title,
        description: editingAssignment.description,
        assignedIntern: editingAssignment.assignedIntern, 
        startDate: editingAssignment.startDate,
        deadline: editingAssignment.deadline,
      });
    } else {
      setFormData({ title: '', description: '', assignedIntern: '', startDate: '', deadline: '' });
    }
  }, [editingAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.assignedIntern || !formData.startDate || !formData.deadline) {
      alert("Please fill out all fields.");
      return;
    }
    if (new Date(formData.startDate) < new Date()) {
      alert("Start date cannot be in the past.");
      return;
    }
    

    // assignedIntern cannot be edited
    if (editingAssignment && formData.assignedIntern !== editingAssignment.assignedIntern) {
      alert('Assigned intern cannot be changed.');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.deadline)) {
      alert("Start date cannot be after the deadline.");
      return;
    }

    try {
      if (editingAssignment) {
        const response = await axiosInstance.put(`/api/assignments/${editingAssignment._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments(assignments.map((assignment) => (assignment._id === response.data._id ? response.data : assignment)));
        alert('Assignment updated successfully!');
      } else {
        const response = await axiosInstance.post('/api/assignments', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments([...assignments, response.data]);
        alert("Assignment created successfully!");
      }
      setEditingAssignment(null);
      setFormData({ title: '', description: '', assignedIntern: '', startDate: '', deadline: '' });
    } catch (error) {
      alert('Failed to save assignment.');
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-2">
      <h1 className="text-2xl font-bold mb-4">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={formData.assignedIntern}
        onChange={(e) => setFormData({ ...formData, assignedIntern: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={!!editingAssignment}   // cannot be edited
      >
        <option value="">Select Intern</option>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Charlie">Charlie</option>
      </select>
      <input
        type="date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingAssignment ? 'Update Button' : 'Create Assignment'}
      </button>
    </form>
    <div className="mt-2">
      <button
      type="button"
      onClick={() => navigate('/feedbacks')}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      View Assignment Table
    </button>
    </div>
  </div>
  );
};

export default AssignmentForm;
