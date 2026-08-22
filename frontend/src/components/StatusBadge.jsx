import React from 'react';

const STYLES = {
  requested: 'bg-warninglight text-warning',
  accepted: 'bg-successlight text-success',
  in_progress: 'bg-nannylight text-nanny',
  completed: 'bg-successlight text-success',
  rejected: 'bg-dangerlight text-danger',
  cancelled: 'bg-dangerlight text-danger',
  pending: 'bg-warninglight text-warning',
  approved: 'bg-successlight text-success',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-border text-muted';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
