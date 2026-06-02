import { useState } from 'react';
import { CATEGORIES } from '../utils/categories';

const empty = {
  title: '',
  category: 'other',
  username: '',
  password: '',
  url: '',
  tags: '',
  notes: '',
  visibility: 'team',
};

export default function AddCredentialModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const isEdit = Boolean(initial?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };
      await onSave(payload);
      setForm(empty);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Credential' : 'Add Credential'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>
            <input className="input-field" value={form.title} onChange={set('title')} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select className="input-field" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Visibility</label>
              <select className="input-field" value={form.visibility} onChange={set('visibility')}>
                <option value="team">Team</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input className="input-field" value={form.username} onChange={set('username')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Password {isEdit && <span className="font-normal text-slate-400">(leave blank to keep)</span>}
            </label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">URL</label>
            <input type="url" className="input-field" value={form.url} onChange={set('url')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
            <input className="input-field" value={form.tags} onChange={set('tags')} placeholder="production, aws" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea className="input-field min-h-[80px]" value={form.notes} onChange={set('notes')} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
