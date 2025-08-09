import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AssignmentTable from '../components/AssignmentTable';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Feedbacks = () => {
  const navigate = useNavigate(); 
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState('');
  // create date
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const feedbackDate = `${yyyy}-${mm}-${dd}`;

  const [visibility, setVisibility] = useState('manager_intern');

  const [submitting, setSubmitting] = useState(false);

  const assignmentIdFromQS = searchParams.get('assignmentId');

  useEffect(() => {
    const loadFromQS = async () => {
      if (!assignmentIdFromQS) return;
      try {
        const res = await axiosInstance.get(`/api/assignments/${assignmentIdFromQS}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSelected(res.data);
      } catch {
        
      }
    };
    loadFromQS();
  }, [assignmentIdFromQS, user]);

  const canSubmit = useMemo(() => {
    return selected && title.trim().length >= 3 && comments.trim().length > 0;
  }, [selected, title, comments]);

  const handleCreate = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await axiosInstance.post(
        '/api/feedbacks',
        {
          assignedIntern: selected.assignedIntern,
          title,
          comments,
          visibility,
          submittedAt: feedbackDate
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTitle('');
      setComments('');
      setRating('');
      alert('Feedback created.');
      navigate('/feedbacks');
    } catch {
      alert('Failed to create feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <section>
        <h1 className="text-xl font-bold mb-3">Assignments</h1>
        <AssignmentTable onSelect={setSelected} />
        {/*View All Feedback*/}
      <button
        onClick={() => navigate('/feedback-list')}
        className="bg-green-600 text-white px-4 py-2 rounded mt-3"
      >
        View All Feedback
      </button>
      </section>

      {selected && (
        <section className="bg-gray-50 p-4 rounded border space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Selected Assignment</h2>
            <div className="text-sm text-gray-700">
              <div>
                <span className="font-medium">Title:</span> {selected.title}
              </div>
              <div>
                <span className="font-medium">Intern:</span> {selected.assignedIntern}
              </div>
              <div>
                <span className="font-medium">Start:</span>{' '}
                {selected.startDate
                  ? new Date(selected.startDate).toLocaleDateString()
                  : '—'}
              </div>
              <div>
                <span className="font-medium">Deadline:</span>{' '}
                {selected.deadline
                  ? new Date(selected.deadline).toLocaleDateString()
                  : '—'}
              </div>
              {selected.description && (
                <div className="mt-1">
                  <span className="font-medium">Description:</span>{' '}
                  {selected.description}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Create Feedback</h3>
            <input
              className="w-full border rounded p-2"
              placeholder="Feedback Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <div className="flex gap-3">
              <input
                className="border rounded p-2 w-24"
                placeholder="Rating (1-5)"
                value={rating}
                 onChange={(e) => {
                 let val = Number(e.target.value);
                 if (val > 5) val = 5;
                 if (val < 1) val = 1;
                 setRating(val);
             }}
                type="number"
                min="1"
                max="5"
              />
              <div className="flex gap-3 flex-wrap">
            <div>
                <label htmlFor="feedbackDate" className="block text-sm text-gray-700 mb-1">
                Feedback date
                </label>
                <input
                type="date"
                value={feedbackDate}
                readOnly
                />
            </div>
              <div>
                <label htmlFor="visibility" className="block text-sm text-gray-700 mb-1">
                  Visibility (who can view this comment)
                </label>
              <select
                id="visibility"
                className="border rounded p-2"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="manager_intern">Manager & Intern</option>
                <option value="manager_only">Manager only</option>
              </select>
            </div>
         </div>
     </div>

            <div className="flex gap-2">
              <button
                disabled={!canSubmit || submitting}
                onClick={handleCreate}
                className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded"
              >
                {submitting ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setTitle('');
                  setComments('');
                  setRating('');
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Feedbacks;