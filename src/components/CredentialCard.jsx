import { Link } from 'react-router-dom';
import { formatCategory } from '../utils/categories';

export default function CredentialCard({ credential }) {
  const updated = new Date(credential.updatedAt).toLocaleDateString();

  return (
    <Link
      to={`/credentials/${credential._id}`}
      className="card block transition hover:border-vault-300 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{credential.title}</h3>
        <span className="shrink-0 rounded-full bg-vault-50 px-2 py-0.5 text-xs font-medium text-vault-700">
          {formatCategory(credential.category)}
        </span>
      </div>
      <p className="text-sm text-slate-600">
        <span className="text-slate-400">User:</span>{' '}
        {credential.username ? credential.username : '—'}
        {credential.passwordMasked && (
          <span className="ml-2 font-mono text-slate-400">{credential.passwordMasked}</span>
        )}
      </p>
      {credential.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {credential.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{credential.createdBy?.fullName || 'Unknown'}</span>
        <span>Updated {updated}</span>
      </div>
    </Link>
  );
}
