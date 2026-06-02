import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import FilterBar from '../components/FilterBar';
import AddCredentialModal from '../components/AddCredentialModal';
import ActivityFeed from '../components/ActivityFeed';
import { CategoryBarChart, TimelineLineChart, MemberPieChart, CategoryDonutChart } from '../components/StatsChart';
import { useCredentials } from '../hooks/useCredentials';
import { formatCategory } from '../utils/categories';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({});
  const { createCredential, exportCredentials, fetchCredentials } = useCredentials();

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  const handleExport = (format) => exportCredentials(localFilters, format);

  const handleAdd = async (payload) => {
    await createCredential(payload);
    const { data } = await api.get('/dashboard/stats');
    setStats(data);
  };

  if (!stats) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-vault-500 border-t-transparent" />
      </div>
    );
  }

  const { summary, categoryChart, timelineChart, memberChart, recentCredentials, recentActivity } = stats;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Team credential overview</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => handleExport('csv')}>
            Export CSV
          </button>
          <button type="button" className="btn-secondary" onClick={() => handleExport('xlsx')}>
            Export XLSX
          </button>
          <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
            + Add Credential
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Credentials" value={summary.total} />
        <SummaryCard label="My Credentials" value={summary.myCredentials} />
        <SummaryCard label="Team Shared" value={summary.teamCredentials} />
        <SummaryCard label="Categories" value={categoryChart.length} />
      </div>

      <FilterBar
        filters={localFilters}
        onChange={(patch) => setLocalFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => fetchCredentials(localFilters)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold">By Category</h2>
          <CategoryBarChart data={categoryChart} />
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">Category Breakdown</h2>
          <CategoryDonutChart data={categoryChart} />
        </div>
        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-semibold">Credentials Added Over Time</h2>
          <TimelineLineChart data={timelineChart} />
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">By Team Member</h2>
          <MemberPieChart data={memberChart} />
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>
          <ActivityFeed items={recentActivity} />
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recently Added</h2>
          <Link to="/credentials" className="text-sm font-medium text-vault-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 pr-4 font-medium">Title</th>
                <th className="pb-2 pr-4 font-medium">Category</th>
                <th className="pb-2 pr-4 font-medium">Added By</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCredentials.map((c) => (
                <tr key={c._id} className="border-b border-slate-50">
                  <td className="py-2 pr-4">
                    <Link to={`/credentials/${c._id}`} className="font-medium text-vault-600 hover:underline">
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{formatCategory(c.category)}</td>
                  <td className="py-2 pr-4">{c.createdBy?.fullName}</td>
                  <td className="py-2">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCredentialModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} />
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-vault-700">{value}</p>
    </div>
  );
}
