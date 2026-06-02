export default function ActivityFeed({ items }) {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">No recent activity.</p>;
  }

  const actionLabel = {
    created: 'created',
    viewed: 'viewed',
    edited: 'edited',
    deleted: 'deleted',
  };

  return (
    <ul className="space-y-3">
      {items.map((log) => (
        <li key={log._id} className="flex gap-3 text-sm">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-vault-500" />
          <div>
            <p className="text-slate-800">
              <span className="font-medium">{log.userId?.fullName || 'User'}</span>{' '}
              {actionLabel[log.action] || log.action}{' '}
              {log.credentialId?.title && (
                <span className="text-vault-600">{log.credentialId.title}</span>
              )}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
