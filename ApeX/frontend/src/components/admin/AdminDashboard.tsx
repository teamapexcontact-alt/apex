'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatClientName } from '@/lib/name-utils';
import { SubmissionsLineChart, StatusDonut, TopDomainsBar } from './Charts';
import { ActivityTimeline, type ActivityEntry } from './ActivityTimeline';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  created_at: string;
}

type SubmissionStatus = 'new' | 'contacted' | 'archived';
type SortKey = 'name' | 'email' | 'company' | 'created_at';
type SortDir = 'asc' | 'desc';
type ChartRange = 7 | 14 | 30;

interface AdminDashboardProps {
  initialSubmissions: Submission[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  stats: {
    total: number;
    today: number;
    week: number;
  };
}

const STATUSES: SubmissionStatus[] = ['new', 'contacted', 'archived'];

const STATUS_META: Record<SubmissionStatus, { label: string; color: string }> = {
  new: { label: 'New', color: '#d4f000' },
  contacted: { label: 'Contacted', color: '#00e5c3' },
  archived: { label: 'Archived', color: 'rgba(255,255,255,0.55)' },
};

const STORAGE_KEY = 'apex_admin_submission_status_v1';
const NOTES_KEY = 'apex_admin_submission_notes_v1';
const ACTIVITY_KEY = 'apex_admin_activity_v1';

function loadStatusMap(): Record<string, SubmissionStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveStatusMap(map: Record<string, SubmissionStatus>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function loadNotesMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveNotesMap(map: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(map));
  } catch {}
}

function loadActivity(): ActivityEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 80) : [];
  } catch {
    return [];
  }
}

function saveActivity(entries: ActivityEntry[]) {
  if (typeof window === 'undefined') return;
    try {
    window.sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries.slice(0, 80)));
  } catch {}
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(sameYear ? {} : { year: '2-digit' }),
  });
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function emailDomain(email: string) {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
}

function escapeCsvCell(v: string) {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function exportToCsv(rows: Submission[], filename: string) {
  const header = ['Name', 'Email', 'Phone', 'Company', 'Message', 'Submitted', 'Status'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        formatClientName(r.name),
        r.email,
        r.phone || '',
        r.company || '',
        r.message,
        r.created_at,
      ]
        .map((v) => escapeCsvCell(String(v)))
        .join(','),
    );
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({
  initialSubmissions,
  initialNextCursor,
  initialHasMore,
  stats,
}: AdminDashboardProps) {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadedIds] = useState<Set<string>>(() => new Set(initialSubmissions.map((s) => s.id)));

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusMap, setStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [chartRange, setChartRange] = useState<ChartRange>(14);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    setStatusMap(loadStatusMap());
    setNotesMap(loadNotesMap());
    setActivity(loadActivity());
  }, []);

  useEffect(() => {
    if (Object.keys(statusMap).length > 0 || window.localStorage.getItem(STORAGE_KEY)) {
      saveStatusMap(statusMap);
    }
  }, [statusMap]);
  useEffect(() => {
    if (Object.keys(notesMap).length > 0 || window.localStorage.getItem(NOTES_KEY)) {
      saveNotesMap(notesMap);
    }
  }, [notesMap]);
  useEffect(() => {
    saveActivity(activity);
  }, [activity]);

  const pushActivity = useCallback((kind: ActivityEntry['kind'], label: string, meta?: string) => {
    setActivity((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, label, meta, ts: Date.now() },
      ...prev,
    ]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = submissions;
    if (q) {
      list = list.filter((s) =>
        [s.name, s.email, s.company, s.phone, s.message]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter((s) => (statusMap[s.id] || 'new') === statusFilter);
    }
    const sorted = [...list].sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (sortKey === 'created_at') {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (sortKey === 'name') {
        av = formatClientName(a.name).toLowerCase();
        bv = formatClientName(b.name).toLowerCase();
      } else if (sortKey === 'email') {
        av = a.email.toLowerCase();
        bv = b.email.toLowerCase();
      } else if (sortKey === 'company') {
        av = (a.company || '').toLowerCase();
        bv = (b.company || '').toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [submissions, query, statusFilter, statusMap, sortKey, sortDir]);

  const statusCounts = useMemo(() => {
    const counts: Record<SubmissionStatus, number> = { new: 0, contacted: 0, archived: 0 };
    for (const s of submissions) {
      const st = statusMap[s.id] || 'new';
      counts[st] += 1;
    }
    return counts;
  }, [submissions, statusMap]);

  const topDomains = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of submissions) {
      const d = emailDomain(s.email);
      if (!d) continue;
      map.set(d, (map.get(d) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [submissions]);

  const handleLoadMore = async () => {
    if (loadingMore || !nextCursor || !hasMore) return;
    setLoadingMore(true);
    setError('');
    try {
      const url = new URL('/api/admin/contact', window.location.origin);
      url.searchParams.set('limit', '20');
      if (nextCursor) url.searchParams.set('cursor', nextCursor);
      const response = await fetch(url.toString());
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Failed to load more submissions');
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load more submissions');
      }
      const { submissions: newSubmissions, nextCursor: newCursor, hasMore: newHasMore } = result.data;
      const unique = newSubmissions.filter((s: Submission) => !loadedIds.has(s.id));
      if (unique.length === 0) {
        setHasMore(false);
        setNextCursor(null);
        return;
      }
      setSubmissions((prev) => [...prev, ...unique]);
      setNextCursor(newCursor);
      setHasMore(newHasMore);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to load more submissions');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign out.');
      }
      pushActivity('login', 'Signed out');
      router.push('/admin/login');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    setLoading(true);
    setError('');
    const target = submissions.find((s) => s.id === id);
    try {
      const response = await fetch(`/api/admin/contact/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Failed to delete submission');
      }
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete submission');
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => {
        if (!prev.has(id)) return prev;
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      pushActivity('delete', 'Deleted submission', target?.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to delete submission');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} submission${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setBulkBusy(true);
    setError('');
    let failed = 0;
    for (const id of ids) {
      try {
        const response = await fetch(`/api/admin/contact/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!response.ok) failed += 1;
      } catch {
        failed += 1;
      }
    }
    setSubmissions((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    pushActivity('delete', `Bulk deleted ${ids.length - failed} submission${ids.length - failed === 1 ? '' : 's'}`, failed ? `${failed} failed` : undefined);
    if (failed > 0) setError(`${failed} of ${ids.length} could not be deleted.`);
    setSelectedIds(new Set());
    setBulkBusy(false);
  };

  const handleBulkExport = () => {
    const rows = submissions.filter((s) => selectedIds.has(s.id));
    if (rows.length === 0) return;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    exportToCsv(rows, `apex-submissions-bulk-${rows.length}-${ts}.csv`);
    pushActivity('export', `Exported ${rows.length} submission${rows.length === 1 ? '' : 's'} as CSV`);
  };

  const handleExportAll = () => {
    if (submissions.length === 0) return;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    exportToCsv(submissions, `apex-submissions-all-${submissions.length}-${ts}.csv`);
    pushActivity('export', `Exported all ${submissions.length} submissions as CSV`);
  };

  const downloadPdf = async (id: string, filenamePrefix = 'apex-submission') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/pdf/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate PDF');
      }
      const json = await res.json();
      if (!json || !json.pdf) throw new Error(json?.error || 'Invalid PDF response');
      const binary = atob(json.pdf);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `${filenamePrefix}-${id}-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      pushActivity('export', 'Downloaded PDF', id.slice(0, 8));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'PDF download failed');
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (id: string, status: SubmissionStatus) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
    const target = submissions.find((s) => s.id === id);
    pushActivity('status', `Marked as ${status}`, target?.email);
  };

  const cycleStatus = (id: string) => {
    const current = statusMap[id] || 'new';
    const next = STATUSES[(STATUSES.indexOf(current) + 1) % STATUSES.length];
    setStatus(id, next);
  };

  const setNote = (id: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [id]: note }));
  };

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filtered.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    if (allSelected && visibleIds.length > 0) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        for (const id of visibleIds) n.delete(id);
        return n;
      });
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        for (const id of visibleIds) n.add(id);
        return n;
      });
    }
  };

  const openSubmission = (s: Submission) => {
    setSelectedSubmission(s);
    pushActivity('view', 'Viewed submission', s.email);
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return (
        <span className="admin-th__sort">
          <span className="admin-th__sort-up">▲</span>
          <span className="admin-th__sort-down">▼</span>
        </span>
      );
    }
    return (
      <span className="admin-th__sort">
        <span className="admin-th__sort-up" style={{ opacity: sortDir === 'asc' ? 1 : 0.3 }}>▲</span>
        <span className="admin-th__sort-down" style={{ opacity: sortDir === 'desc' ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  const allFilteredIds = filtered.map((s) => s.id);
  const allFilteredSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected = allFilteredIds.some((id) => selectedIds.has(id)) && !allFilteredSelected;

  useEffect(() => {
    if (!selectedSubmission) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSubmission(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedSubmission]);

  return (
    <div className="admin-shell">
      <div className="admin-bg" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--a" aria-hidden />
      <div className="admin-bg__glow admin-bg__glow--b" aria-hidden />

      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-brand">
            <div className="admin-brand__mark">A</div>
            <div>
              <div className="admin-brand__title">ApeX Admin</div>
              <div className="admin-brand__sub">Contact Submissions</div>
            </div>
          </div>
          <div className="admin-header__right">
            <button
              className="admin-icon-btn"
              onClick={() => setTimelineOpen(true)}
              title="Activity timeline"
              aria-label="Open activity timeline"
            >
              <i className="ti ti-activity-heartbeat" style={{ fontSize: '1.05rem' }} />
              {activity.length > 0 && <span className="admin-icon-btn__badge">{activity.length > 99 ? '99+' : activity.length}</span>}
            </button>
            <button
              className="admin-btn admin-btn--sm"
              onClick={handleLogout}
              disabled={loading}
            >
              <i className="ti ti-logout" style={{ fontSize: '1rem' }} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {error && (
          <div className="admin-error">
            <i className="ti ti-alert-triangle" />
            <span>{error}</span>
          </div>
        )}

        <div className="admin-stats admin-fade-up" style={{ animationDelay: '0ms' }}>
          <StatCard
            icon="ti ti-inbox"
            accent="#d4f000"
            value={stats.total}
            label="Total Submissions"
            trend={stats.total > 0 ? 'Live' : '—'}
            trendKind={stats.total > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            icon="ti ti-bolt"
            accent="#00e5c3"
            value={stats.today}
            label="Today"
            trend={stats.today > 0 ? 'New' : 'Quiet'}
            trendKind={stats.today > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            icon="ti ti-calendar-week"
            accent="#b794f4"
            value={stats.week}
            label="This Week"
            trend={`${statusCounts.new} new`}
            trendKind={statusCounts.new > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            icon="ti ti-checklist"
            accent="#ffb347"
            value={statusCounts.contacted + statusCounts.archived}
            label="Processed"
            trend={statusCounts.archived > 0 ? `${statusCounts.archived} archived` : 'In progress'}
            trendKind="neutral"
          />
        </div>

        <div className="admin-charts admin-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="admin-card">
            <div className="admin-card__head">
              <div>
                <div className="admin-card__title"><i className="ti ti-chart-line" /> Submissions Over Time</div>
                <div className="admin-card__sub">Based on loaded data</div>
              </div>
              <div className="admin-range" role="tablist" aria-label="Chart range">
                {([7, 14, 30] as ChartRange[]).map((r) => (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={chartRange === r}
                    className={`admin-range__btn ${chartRange === r ? 'admin-range__btn--active' : ''}`}
                    onClick={() => setChartRange(r)}
                  >
                    {r}D
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-card__body" style={{ position: 'relative' }}>
              <SubmissionsLineChart submissions={submissions} rangeDays={chartRange} />
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__head">
              <div>
                <div className="admin-card__title"><i className="ti ti-circle-half-2" /> Status Mix</div>
                <div className="admin-card__sub">Tracked in your browser</div>
              </div>
            </div>
            <div className="admin-card__body">
              <StatusDonut
                segments={[
                  { label: 'New', value: statusCounts.new, color: STATUS_META.new.color },
                  { label: 'Contacted', value: statusCounts.contacted, color: STATUS_META.contacted.color },
                  { label: 'Archived', value: statusCounts.archived, color: STATUS_META.archived.color },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="admin-card admin-fade-up" style={{ animationDelay: '120ms', marginBottom: '1.5rem' }}>
          <div className="admin-card__head">
            <div className="admin-card__title"><i className="ti ti-world" /> Top Email Domains</div>
            <div className="admin-card__sub">{topDomains.length} of {submissions.length}</div>
          </div>
          <div className="admin-card__body">
            <TopDomainsBar items={topDomains} />
          </div>
        </div>

        <div className="admin-toolbar admin-fade-up" style={{ animationDelay: '160ms' }}>
          <div className="admin-search">
            <i className="ti ti-search" />
            <input
              className="admin-search__input"
              placeholder="Search by name, email, company, message…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search submissions"
            />
          </div>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | SubmissionStatus)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
          {(query || statusFilter !== 'all') && (
            <button
              className="admin-btn admin-btn--sm"
              onClick={() => { setQuery(''); setStatusFilter('all'); }}
              title="Clear filters"
            >
              <i className="ti ti-x" /> Clear
            </button>
          )}
          <div className="admin-toolbar__spacer" />
          <button
            className="admin-btn"
            onClick={handleExportAll}
            disabled={submissions.length === 0}
            title="Export all loaded submissions as CSV"
          >
            <i className="ti ti-file-export" /> Export CSV
          </button>
        </div>

        {selectedIds.size > 0 && (
          <div className="admin-bulk admin-fade-in">
            <div className="admin-bulk__count">
              <i className="ti ti-checks" style={{ color: 'var(--color-accent)' }} />
              <strong>{selectedIds.size}</strong>
              <span>submission{selectedIds.size === 1 ? '' : 's'} selected</span>
            </div>
            <div className="admin-bulk__actions">
              <button className="admin-btn admin-btn--sm" onClick={handleBulkExport} disabled={bulkBusy}>
                <i className="ti ti-file-export" /> Export Selected
              </button>
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={handleBulkDelete} disabled={bulkBusy}>
                <i className="ti ti-trash" /> {bulkBusy ? 'Working…' : 'Delete Selected'}
              </button>
              <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedIds(new Set())}>
                Clear selection
              </button>
            </div>
          </div>
        )}

        <div className="admin-table-wrap admin-fade-up" style={{ animationDelay: '220ms' }}>
          {submissions.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">
                <i className="ti ti-inbox-off" />
              </div>
              <div className="admin-empty__title">No submissions yet</div>
              <div className="admin-empty__sub">When visitors submit the contact form, they’ll appear here.</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">
                <i className="ti ti-filter-off" />
              </div>
              <div className="admin-empty__title">No matches</div>
              <div className="admin-empty__sub">Try a different search or status filter.</div>
            </div>
          ) : (
            <>
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-th" style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          className="admin-check"
                          checked={allFilteredSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someFilteredSelected;
                          }}
                          onChange={toggleSelectAllVisible}
                          aria-label="Select all visible submissions"
                        />
                      </th>
                      <th className={`admin-th admin-th--sortable ${sortKey === 'name' ? 'admin-th--active' : ''}`} onClick={() => onSort('name')}>
                        Name {sortIndicator('name')}
                      </th>
                      <th className={`admin-th admin-th--sortable ${sortKey === 'email' ? 'admin-th--active' : ''}`} onClick={() => onSort('email')}>
                        Email {sortIndicator('email')}
                      </th>
                      <th className="admin-th">Status</th>
                      <th className={`admin-th admin-th--sortable ${sortKey === 'company' ? 'admin-th--active' : ''}`} onClick={() => onSort('company')}>
                        Company {sortIndicator('company')}
                      </th>
                      <th className={`admin-th admin-th--sortable ${sortKey === 'created_at' ? 'admin-th--active' : ''}`} onClick={() => onSort('created_at')}>
                        Submitted {sortIndicator('created_at')}
                      </th>
                      <th className="admin-th" style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((submission) => {
                      const status = statusMap[submission.id] || 'new';
                      const isSelected = selectedIds.has(submission.id);
                      return (
                        <tr key={submission.id} className={`admin-tr ${isSelected ? 'admin-tr--selected' : ''}`}>
                          <td className="admin-td">
                            <input
                              type="checkbox"
                              className="admin-check"
                              checked={isSelected}
                              onChange={() => toggleSelected(submission.id)}
                              aria-label={`Select ${submission.name}`}
                            />
                          </td>
                          <td className="admin-td">
                            <div className="admin-cell-name">{formatClientName(submission.name)}</div>
                            <div className="admin-cell-name__sub">{timeAgo(submission.created_at)}</div>
                          </td>
                          <td className="admin-td admin-cell-email">
                            <a href={`mailto:${submission.email}`} style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                              {submission.email}
                            </a>
                          </td>
                          <td className="admin-td">
                            <button
                              className={`admin-status admin-status--${status}`}
                              onClick={() => cycleStatus(submission.id)}
                              title={`Click to change (current: ${status})`}
                            >
                              {STATUS_META[status].label}
                            </button>
                          </td>
                          <td className="admin-td">{submission.company || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}</td>
                          <td className="admin-td admin-cell-date" suppressHydrationWarning>
                            {formatDateShort(submission.created_at)}
                          </td>
                          <td className="admin-td admin-cell-actions" style={{ textAlign: 'right' }}>
                            <div className="admin-cell-actions__row">
                              <button
                                className="admin-act-btn admin-act-btn--accent"
                                onClick={() => openSubmission(submission)}
                                title="View details"
                                aria-label="View details"
                              >
                                <i className="ti ti-eye" />
                              </button>
                              <button
                                className="admin-act-btn"
                                onClick={() => downloadPdf(submission.id)}
                                title="Download PDF"
                                aria-label="Download PDF"
                              >
                                <i className="ti ti-file-type-pdf" />
                              </button>
                              <button
                                className="admin-act-btn admin-act-btn--danger"
                                onClick={() => handleDelete(submission.id)}
                                disabled={loading}
                                title="Delete"
                                aria-label="Delete"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="admin-loadmore">
                  <button
                    className="admin-btn"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <i className="ti ti-loader" style={{ animation: 'admin-pulse 1s linear infinite' }} /> Loading…
                      </>
                    ) : (
                      <>
                        <i className="ti ti-arrow-down" /> Load More
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedSubmission && (
        <DetailModal
          submission={selectedSubmission}
          status={statusMap[selectedSubmission.id] || 'new'}
          note={notesMap[selectedSubmission.id] || ''}
          onClose={() => setSelectedSubmission(null)}
          onSetStatus={(s) => setStatus(selectedSubmission.id, s)}
          onSetNote={(n) => setNote(selectedSubmission.id, n)}
          onDownloadPdf={() => downloadPdf(selectedSubmission.id, 'apex-submission')}
          onDelete={() => handleDelete(selectedSubmission.id)}
          busy={loading}
        />
      )}

      <ActivityTimeline
        open={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        entries={activity}
        onClear={() => setActivity([])}
      />
    </div>
  );
}

interface StatCardProps {
  icon: string;
  accent: string;
  value: number | string;
  label: string;
  trend: string;
  trendKind: 'up' | 'neutral';
}

function StatCard({ icon, accent, value, label, trend, trendKind }: StatCardProps) {
  return (
    <div className="admin-stat" style={{ ['--admin-stat-accent' as string]: accent } as React.CSSProperties}>
      <div className="admin-stat__top">
        <div className="admin-stat__icon">
          <i className={icon} />
        </div>
        <span className={`admin-stat__trend admin-stat__trend--${trendKind}`}>
          {trendKind === 'up' && <i className="ti ti-trending-up" style={{ fontSize: '0.7rem' }} />}
          {trend}
        </span>
      </div>
      <div className="admin-stat__value">{value}</div>
      <div className="admin-stat__label">{label}</div>
    </div>
  );
}

interface DetailModalProps {
  submission: Submission;
  status: SubmissionStatus;
  note: string;
  onClose: () => void;
  onSetStatus: (s: SubmissionStatus) => void;
  onSetNote: (n: string) => void;
  onDownloadPdf: () => void;
  onDelete: () => void;
  busy: boolean;
}

function DetailModal({ submission, status, note, onClose, onSetStatus, onSetNote, onDownloadPdf, onDelete, busy }: DetailModalProps) {
  return (
    <div className="admin-modal-back" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <div className="admin-modal__title">
            <i className="ti ti-mail-opened" style={{ color: 'var(--color-accent)', marginRight: 8 }} />
            Submission Details
          </div>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" style={{ fontSize: '1rem' }} />
          </button>
        </div>
        <div className="admin-modal__body">
          <div className="admin-detail-grid">
            <div className="admin-detail">
              <div className="admin-detail__label">Name</div>
              <div className="admin-detail__value">{formatClientName(submission.name)}</div>
            </div>
            <div className="admin-detail">
              <div className="admin-detail__label">Email</div>
              <div className="admin-detail__value">
                <a href={`mailto:${submission.email}`}>{submission.email}</a>
              </div>
            </div>
            <div className="admin-detail">
              <div className="admin-detail__label">Phone</div>
              <div className="admin-detail__value">{submission.phone || <span style={{ color: 'rgba(255,255,255,0.35)' }}>Not provided</span>}</div>
            </div>
            <div className="admin-detail">
              <div className="admin-detail__label">Company / Brand</div>
              <div className="admin-detail__value">{submission.company || <span style={{ color: 'rgba(255,255,255,0.35)' }}>Not provided</span>}</div>
            </div>
            <div className="admin-detail">
              <div className="admin-detail__label">Submitted</div>
              <div className="admin-detail__value" suppressHydrationWarning>{formatDate(submission.created_at)}</div>
            </div>
            <div className="admin-detail">
              <div className="admin-detail__label">Status</div>
              <div className="admin-detail__value" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`admin-status admin-status--${s}`}
                    onClick={() => onSetStatus(s)}
                    style={{ opacity: status === s ? 1 : 0.45, cursor: 'pointer' }}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-section-label">Message</div>
          <div className="admin-msg">{submission.message}</div>

          <div className="admin-section-label">Internal Notes <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-dm-sans)' }}>(only visible to admins · saved locally)</span></div>
          <textarea
            className="admin-notes"
            placeholder="Add private notes about this submission…"
            value={note}
            onChange={(e) => onSetNote(e.target.value)}
            onBlur={() => {}}
          />
        </div>
        <div className="admin-modal__foot">
          <button className="admin-btn admin-btn--danger" onClick={onDelete} disabled={busy}>
            <i className="ti ti-trash" /> Delete
          </button>
          <div style={{ flex: 1 }} />
          <button className="admin-btn" onClick={onClose}>Close</button>
          <a className="admin-btn" href={`mailto:${submission.email}`}>
            <i className="ti ti-mail" /> Reply
          </a>
          <button className="admin-btn admin-btn--primary" onClick={onDownloadPdf}>
            <i className="ti ti-file-type-pdf" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
