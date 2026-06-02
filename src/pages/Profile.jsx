import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [activity, setActivity] = useState([]);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/activity', { params: { limit: 20 } }).then(({ data }) => {
      const mine = data.filter((a) => a.userId?._id === user?._id || a.userId === user?._id);
      setActivity(mine.length ? mine : data.slice(0, 10));
    });
  }, [user]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('/auth/password', passwords);
      setMessage('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500">Manage your account</p>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Account</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium">{user?.fullName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium capitalize">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="input-field"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="input-field"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">
            Update Password
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Your Activity</h2>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
