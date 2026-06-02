import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CredentialCard from '../components/CredentialCard';
import FilterBar from '../components/FilterBar';
import AddCredentialModal from '../components/AddCredentialModal';
import { useCredentials } from '../hooks/useCredentials';
import { formatCategory } from '../utils/categories';

export default function Credentials() {
  const [view, setView] = useState('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const {
    credentials,
    pagination,
    loading,
    filters,
    setFilters,
    fetchCredentials,
    createCredential,
    exportCredentials,
  } = useCredentials();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const applyFilters = () => fetchCredentials(filters);

  const handleAdd = async (payload) => {
    await createCredential(payload);
    await fetchCredentials(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Credentials</h1>
          <p className="text-slate-500">{pagination.totalDocs || 0} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-vault-100 text-vault-700' : 'text-slate-600'}`}
              onClick={() => setView('grid')}
            >
              Cards
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm ${view === 'table' ? 'bg-vault-100 text-vault-700' : 'text-slate-600'}`}
              onClick={() => setView('table')}
            >
              Table
            </button>
          </div>
          <button type="button" className="btn-secondary" onClick={() => exportCredentials(filters, 'csv')}>
            Export
          </button>
          <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
            + Add
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={applyFilters}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-500 border-t-transparent" />
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <CredentialCard key={c._id} credential={c} />
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 pr-4">Title</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Username</th>
                <th className="pb-2 pr-4">Added By</th>
                <th className="pb-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((c) => (
                <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <Link to={`/credentials/${c._id}`} className="font-medium text-vault-600 hover:underline">
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{formatCategory(c.category)}</td>
                  <td className="py-3 pr-4 font-mono text-slate-500">{c.passwordMasked || c.username}</td>
                  <td className="py-3 pr-4">{c.createdBy?.fullName}</td>
                  <td className="py-3">{new Date(c.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() => fetchCredentials({ ...filters, page: pagination.page - 1 })}
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-slate-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="btn-secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchCredentials({ ...filters, page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      )}

      <AddCredentialModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} />
    </div>
  );
}
