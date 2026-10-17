import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudents, errMsg } from '../api.js';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((err) => toast.error(errMsg(err)))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const thisMonth = students.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const courses = new Set(students.map((s) => s.course).filter(Boolean)).size;

  const stats = [
    ['Total students', students.length],
    ['Courses', courses],
    ['Added this month', thisMonth],
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <Link to="/students/add" className="btn-primary">Add student</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{loading ? '…' : value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium text-white">Recently added</h2>
          <Link to="/students" className="text-sm text-brand-400 hover:underline">View all students</Link>
        </div>
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : students.length === 0 ? (
          <p className="text-slate-400">No students yet. Add one to see it here.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {students.slice(0, 5).map((s) => (
              <li key={s._id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-white">{s.name}</p>
                  <p className="truncate text-sm text-slate-400">{s.rollNo} · {s.course || 'No course'}</p>
                </div>
                <Link to={`/students/${s._id}/edit`} className="text-sm text-brand-400 hover:underline">Edit</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
