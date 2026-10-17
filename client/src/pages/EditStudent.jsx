import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm.jsx';
import { getStudent, updateStudent, errMsg } from '../api.js';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    getStudent(id)
      .then((s) => setStudent({ ...s, dob: s.dob ? s.dob.slice(0, 10) : '' }))
      .catch((err) => {
        toast.error(errMsg(err));
        navigate('/students');
      });
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      const res = await updateStudent(id, data);
      toast.success(res.message);
      navigate('/students');
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  if (!student) return <p className="text-slate-400">Loading student…</p>;

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-white">Edit {student.name}</h1>
      <StudentForm initial={student} submitLabel="Save changes" onSubmit={handleSubmit}
        onCancel={() => navigate('/students')} />
    </section>
  );
}
