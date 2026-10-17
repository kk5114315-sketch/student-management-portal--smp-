import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm.jsx';
import { createStudent, errMsg } from '../api.js';

export default function AddStudent() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const res = await createStudent(data);
      toast.success(res.message);
      navigate('/students');
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-white">Add student</h1>
      <StudentForm submitLabel="Add student" onSubmit={handleSubmit} onCancel={() => navigate('/students')} />
    </section>
  );
}
