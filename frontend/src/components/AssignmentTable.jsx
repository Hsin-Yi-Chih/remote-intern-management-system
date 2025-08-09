import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AssignmentTable = ({ onSelect }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/assignments', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments(res.data || []);
      } catch {
        alert('Failed to fetch assignments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Intern</th>
            <th className="p-2 border">StartDate</th>
            <th className="p-2 border">Deadline</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Select</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a._id}>
              <td className="p-2 border">{a.title}</td>
              <td className="p-2 border">{a.assignedIntern}</td>
              <td className="p-2 border">
                {a.startDate ? new Date(a.startDate).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border">
                {a.deadline ? new Date(a.deadline).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border">{a.status ?? '—'}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => onSelect && onSelect(a)}
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
          {assignments.length === 0 && (
            <tr>
              <td className="p-3 border" colSpan={6}>
                No assignments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;