import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/students', 'Students'],
  ['/students/add', 'Add Student'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-brand-500/20 text-brand-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-night-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-white">
          Skyrovix <span className="text-brand-400">Student Portal</span>
        </span>
        <nav className="hidden gap-1 sm:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end className={cls}>{label}</NavLink>
          ))}
        </nav>
        <button
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 px-4 pb-3 sm:hidden" onClick={() => setOpen(false)}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end className={cls}>{label}</NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
