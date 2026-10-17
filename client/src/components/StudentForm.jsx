import { useState } from 'react';

const EMPTY = { name: '', rollNo: '', course: '', email: '', phone: '', dob: '', address: '' };

export const validate = (v) => {
  const e = {};
  if (!v.name.trim()) e.name = 'Name is required';
  if (!v.rollNo.trim()) e.rollNo = 'Roll number is required';
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (v.phone && !/^\d{10}$/.test(v.phone.trim())) e.phone = 'Phone must be exactly 10 digits';
  return e;
};

export default function StudentForm({ initial, onSubmit, submitLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSubmit({ ...values, dob: values.dob || null });
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className={props.wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={name} className="mb-1 block text-sm text-slate-300">{label}</label>
      {props.area ? (
        <textarea id={name} name={name} rows={3} className="input" value={values[name]} onChange={change} />
      ) : (
        <input id={name} name={name} type={props.type || 'text'} className="input"
          placeholder={props.placeholder} value={values[name]} onChange={change} />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 sm:grid-cols-2">
      {field('name', 'Full name *', { placeholder: 'Aarav Sharma' })}
      {field('rollNo', 'Roll number *', { placeholder: 'CS2024-001' })}
      {field('course', 'Course', { placeholder: 'B.Tech Computer Science' })}
      {field('email', 'Email', { type: 'email', placeholder: 'aarav@example.com' })}
      {field('phone', 'Phone (10 digits)', { placeholder: '9876543210' })}
      {field('dob', 'Date of birth', { type: 'date' })}
      {field('address', 'Address', { area: true, wide: true })}
      <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
        {onCancel && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
