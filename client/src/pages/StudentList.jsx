import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudents, deleteStudent, errMsg } from '../api.js';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (term) => {
    setLoading(true);
    try {
      setStudents(await getStudents(term));
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search: waits 300ms after typing stops
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name} (${s.rollNo})? This cannot be undone.`)) return;
    try {
      const res = await deleteStudent(s._id);
      toast.success(res.message);
      setStudents((list) => list.filter((x) => x._id !== s._id));
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const actions = (s) => (
    <div className="flex gap-2">
      <Link to={`/students/${s._id}/edit`} className="btn-ghost px-3 py-1">Edit</Link>
      <button onClick={() => remove(s)} className="btn-danger px-3 py-1">Delete</button>
    </div>
  );

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Students</h1>
        <div className="flex gap-2">
          <input className="input sm:w-72" type="search" placeholder="Search name, roll no or course"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <Link to="/students/add" className="btn-primary whitespace-nowrap">Add student</Link>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading students…</p>
      ) : students.length === 0 ? (
        <div className="card text-center text-slate-400">
          {search ? `No students match "${search}".` : 'No students yet. Add your first student to get started.'}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-x-auto p-0 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th><th className="px-4 py-3">Roll no</th>
                  <th className="px-4 py-3">Course</th><th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th><th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-slate-800/60 last:border-0 hover:bg-night-700/40">
                    <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                    <td className="px-4 py-3">{s.rollNo}</td>
                    <td className="px-4 py-3">{s.course || '-'}</td>
                    <td className="px-4 py-3">{s.email || '-'}</td>
                    <td className="px-4 py-3">{s.phone || '-'}</td>
                    <td className="px-4 py-3">{actions(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {students.map((s) => (
              <div key={s._id} className="card space-y-1">
                <p className="font-medium text-white">{s.name}</p>
                <p className="text-sm text-brand-400">{s.rollNo}</p>
                <p className="text-sm text-slate-400">{s.course || 'No course'}</p>
                {s.email && <p className="break-all text-sm text-slate-400">{s.email}</p>}
                {s.phone && <p className="text-sm text-slate-400">{s.phone}</p>}
                <div className="pt-2">{actions(s)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
