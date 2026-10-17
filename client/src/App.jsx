import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddStudent from './pages/AddStudent.jsx';
import StudentList from './pages/StudentList.jsx';
import EditStudent from './pages/EditStudent.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/:id/edit" element={<EditStudent />} />
          <Route path="*" element={<p className="text-slate-400">Page not found.</p>} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#1a2347', color: '#e2e8f0', border: '1px solid #334155' } }}
      />
    </div>
  );
}
