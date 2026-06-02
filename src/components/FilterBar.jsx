import { CATEGORIES } from '../utils/categories';

export default function FilterBar({ filters, onChange, onSearch, showOwner = true }) {
  return (
    <div className="card flex flex-wrap items-end gap-4">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-500">Search</label>
        <input
          type="search"
          placeholder="Title, username, URL, notes..."
          className="input-field"
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
        <select
          className="input-field min-w-[140px]"
          value={filters.category || ''}
          onChange={(e) => onChange({ category: e.target.value || undefined })}
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Tag</label>
        <input
          type="text"
          placeholder="e.g. production"
          className="input-field min-w-[120px]"
          value={filters.tag || ''}
          onChange={(e) => onChange({ tag: e.target.value || undefined })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
        <input
          type="date"
          className="input-field"
          value={filters.dateFrom?.slice(0, 10) || ''}
          onChange={(e) => onChange({ dateFrom: e.target.value || undefined })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
        <input
          type="date"
          className="input-field"
          value={filters.dateTo?.slice(0, 10) || ''}
          onChange={(e) => onChange({ dateTo: e.target.value || undefined })}
        />
      </div>
      {showOwner && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Visibility</label>
          <select
            className="input-field min-w-[120px]"
            value={filters.visibility || ''}
            onChange={(e) => onChange({ visibility: e.target.value || undefined })}
          >
            <option value="">All</option>
            <option value="team">Team</option>
            <option value="private">Private</option>
          </select>
        </div>
      )}
      <button type="button" className="btn-primary" onClick={onSearch}>
        Apply
      </button>
    </div>
  );
}
