'use client';

import { useEffect } from 'react';

export type ActivityKind = 'view' | 'delete' | 'export' | 'status' | 'note' | 'login';

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  label: string;
  meta?: string;
  ts: number;
}

interface ActivityTimelineProps {
  open: boolean;
  onClose: () => void;
  entries: ActivityEntry[];
  onClear: () => void;
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function kindIcon(kind: ActivityKind) {
  switch (kind) {
    case 'view':
      return 'ti ti-eye';
    case 'delete':
      return 'ti ti-trash';
    case 'export':
      return 'ti ti-download';
    case 'status':
      return 'ti ti-flag';
    case 'note':
      return 'ti ti-notes';
    case 'login':
      return 'ti ti-login';
    default:
      return 'ti ti-circle-dot';
  }
}

export function ActivityTimeline({ open, onClose, entries, onClear }: ActivityTimelineProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="admin-timeline-back" onClick={onClose} />
      <aside className="admin-timeline" aria-label="Activity timeline">
        <div className="admin-timeline__head">
          <div className="admin-timeline__title">
            <i className="ti ti-activity-heartbeat" /> Activity
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {entries.length > 0 && (
              <button onClick={onClear} className="admin-icon-btn" title="Clear activity" aria-label="Clear activity">
                <i className="ti ti-eraser" style={{ fontSize: '0.95rem' }} />
              </button>
            )}
            <button onClick={onClose} className="admin-icon-btn" title="Close" aria-label="Close timeline">
              <i className="ti ti-x" style={{ fontSize: '1rem' }} />
            </button>
          </div>
        </div>
        <div className="admin-timeline__body">
          {entries.length === 0 ? (
            <div className="admin-timeline__empty">
              <i className="ti ti-history" style={{ fontSize: '2rem', color: 'rgba(212,240,0,0.4)', display: 'block', marginBottom: 8 }} />
              No activity yet. Your actions will appear here.
            </div>
          ) : (
            entries.map((e) => (
              <div key={e.id} className={`admin-timeline-item admin-timeline-item--${e.kind}`}>
                <div className="admin-timeline-item__label">
                  <i className={kindIcon(e.kind)} style={{ marginRight: 6, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }} />
                  {e.label}
                </div>
                <div className="admin-timeline-item__meta">
                  {e.meta ? `${e.meta} · ` : ''}
                  {relativeTime(e.ts)}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
