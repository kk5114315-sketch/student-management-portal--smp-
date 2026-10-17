const Student = require('../models/Student');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const FIELDS = ['name', 'rollNo', 'course', 'email', 'phone', 'dob', 'address'];
const pick = (body) =>
  FIELDS.reduce((o, k) => (body[k] !== undefined ? { ...o, [k]: body[k] } : o), {});

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const notFound = () => {
  const err = new Error('Student not found');
  err.status = 404;
  return err;
};

// POST /api/students
exports.createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(pick(req.body));
  res.status(201).json({ success: true, message: 'Student added successfully', data: student });
});

// GET /api/students?search=term
exports.getStudents = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter = { $or: [{ name: rx }, { rollNo: rx }, { course: rx }] };
  }
  const students = await Student.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, data: students });
});

// GET /api/students/:id
exports.getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw notFound();
  res.json({ success: true, data: student });
});

// PUT /api/students/:id
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  });
  if (!student) throw notFound();
  res.json({ success: true, message: 'Student updated successfully', data: student });
});

// DELETE /api/students/:id
exports.deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) throw notFound();
  res.json({ success: true, message: 'Student deleted successfully' });
});
