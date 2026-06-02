import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';
import AddCredentialModal from '../components/AddCredentialModal';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../hooks/useCredentials';
import { formatCategory } from '../utils/categories';

export default function CredentialDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getCredential, updateCredential, deleteCredential } = useCredentials();
  const navigate = useNavigate();

  const [credential, setCredential] = useState(null);
  const [activity, setActivity] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (reveal = false) => {
    setLoading(true);
    try {
      const data = await getCredential(id, reveal);
      setCredential(data);
      if (reveal) setShowPassword(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api.get(`/activity/credential/${id}`).then(({ data }) => setActivity(data));
  }, [id]);

  const handleReveal = async () => {
    if (!showPassword) await load(true);
    else setShowPassword(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this credential permanently?')) return;
    await deleteCredential(id);
    navigate('/credentials');
  };

  const ownerId = credential?.createdBy?._id || credential?.createdBy;
  const canEdit = user?.role === 'admin' || ownerId?.toString() === user?._id?.toString();
  const canDelete = user?.role === 'admin' || canEdit;

  const handleEdit = async (payload) => {
    const updated = await updateCredential(id, payload);
    setCredential(updated);
    const { data } = await api.get(`/activity/credential/${id}`);
    setActivity(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-500 border-t-transparent" />
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="text-center">
        <p className="text-slate-500">Credential not found.</p>
        <Link to="/credentials" className="mt-4 inline-block text-vault-600 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  const editInitial = {
    _id: credential._id,
    title: credential.title,
    category: credential.category,
    username: credential.username || '',
    password: '',
    url: credential.url || '',
    tags: (credential.tags || []).join(', '),
    notes: credential.notes || '',
    visibility: credential.visibility,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/credentials" className="text-sm text-vault-600 hover:underline">
        ← Back to credentials
      </Link>

      <div className="card">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{credential.title}</h1>
            <p className="mt-1 text-slate-500">{formatCategory(credential.category)}</p>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button type="button" className="btn-secondary" onClick={() => setEditOpen(true)}>
                Edit
              </button>
            )}
            {canDelete && (
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Username" value={credential.username || '—'} />
          <div>
            <dt className="text-sm font-medium text-slate-500">Password</dt>
            <dd className="mt-1 flex items-center gap-2">
              <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">
                {showPassword && credential.password ? credential.password : credential.passwordMasked}
              </code>
              <button type="button" className="btn-secondary text-xs" onClick={handleReveal}>
                {showPassword ? 'Hide' : 'Reveal'}
              </button>
            </dd>
          </div>
          {credential.url && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-slate-500">URL</dt>
              <dd className="mt-1">
                <a href={credential.url} target="_blank" rel="noreferrer" className="text-vault-600 hover:underline">
                  {credential.url}
                </a>
              </dd>
            </div>
          )}
          <Field label="Visibility" value={credential.visibility} />
          <Field label="Added by" value={credential.createdBy?.fullName} />
          <Field label="Last updated by" value={credential.lastUpdatedBy?.fullName || '—'} />
          <Field label="Created" value={new Date(credential.createdAt).toLocaleString()} />
          <Field label="Updated" value={new Date(credential.updatedAt).toLocaleString()} />
        </dl>

        {credential.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {credential.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {credential.notes && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h3 className="mb-2 font-medium text-slate-700">Notes</h3>
            <p className="whitespace-pre-wrap text-sm text-slate-600">{credential.notes}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Activity Log</h2>
        <ActivityFeed items={activity} />
      </div>

      <AddCredentialModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
        initial={editInitial}
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900 capitalize">{value}</dd>
    </div>
  );
}
