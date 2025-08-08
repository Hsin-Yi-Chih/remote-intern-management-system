import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AssignmentForm = ({ assignments, setAssignments, editingAssignment, setEditingAssignment }) => {
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
    
    try {
      if (editingAssignment) {
        const response = await axiosInstance.put(`/api/assignments/${editingAssignment._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments(assignments.map((assignment) => (assignment._id === response.data._id ? response.data : assignment)));
      } else {
        const response = await axiosInstance.post('/api/assignments', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments([...assignments, response.data]);
        alert("Assignment created successfully!");
      }
      setEditingAssignment(null);
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save assignment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingAssignment ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
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
        {editingAssignment ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default AssignmentForm;
