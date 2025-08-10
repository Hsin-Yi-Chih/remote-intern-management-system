import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function FeedbackList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState('');
  const [visibility, setVisibility] = useState('manager_intern');

  const load = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/feedbacks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [user.token]);

  useEffect(() => {
    load();
  }, [load]);

  const onEdit = (f) => {
    setEditing(f);
    setTitle(f.title || '');
    setComments(f.comments || '');
    setVisibility(f.visibility || 'manager_intern');
  };

  const onSave = async () => {
    if (!editing?._id) return;
    try {
      await axiosInstance.put(
        `/api/feedbacks/${editing._id}`,
        {
          title,
          comments,
          visibility,
          assignedIntern: editing.assignedIntern,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEditing(null);
      setTitle('');
      setComments('');
      setVisibility('manager_intern');
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this feedback permanently?');
    if (!ok) return;
    try {
      await axiosInstance.delete(`/api/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {items.map((f) => (
        <div key={f._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="font-bold">{f.title}</div>
          <div className="text-sm text-gray-600">
            Intern: {f.assignedIntern || '—'}
          </div>
          <div className="text-sm text-gray-600">
            Date: {f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : '—'}
          </div>
          <div className="text-sm mt-1">{f.comments || '—'}</div>
          <div className="text-xs text-gray-500 mt-1">
            Visibility: {f.visibility === 'manager_only' ? 'Manager only' : 'Manager & Intern'}
          </div>
          <div className="mt-2">
            <button
              onClick={() => onEdit(f)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(f._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
          {editing?._id === f._id && (
            <div className="bg-white p-4 rounded border space-y-2 mt-4">
              <div className="font-semibold">Edit feedback</div>
              <div className="text-sm text-gray-600">
                Intern: {editing.assignedIntern || '—'}
              </div>
              <input
                className="border rounded p-2 w-full"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="border rounded p-2 w-full"
                rows={4}
                placeholder="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <select
                className="border rounded p-2"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="manager_intern">Manager & Intern</option>
                <option value="manager_only">Manager only</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  disabled={!title.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}