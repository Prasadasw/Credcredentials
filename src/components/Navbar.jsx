import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/credentials', label: 'Credentials' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-vault-700">
            <img src="/vault.svg" alt="" className="h-8 w-8" />
            Credential Vault
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname.startsWith(to)
                    ? 'bg-vault-50 text-vault-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-medium text-slate-900">{user?.fullName}</p>
            <p className="text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary text-xs">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
