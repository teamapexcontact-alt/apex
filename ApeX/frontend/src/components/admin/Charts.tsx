'use client';

import { useMemo, useState } from 'react';

type SubmissionLike = { created_at: string };

interface LineChartProps {
  submissions: SubmissionLike[];
  rangeDays: 7 | 14 | 30;
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function shortDay(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function SubmissionsLineChart({ submissions, rangeDays }: LineChartProps) {
  const { points, max, total, lastValue } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: Date; key: string; count: number }[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: d, key, count: 0 });
    }

    for (const s of submissions) {
      const key = new Date(s.created_at).toISOString().slice(0, 10);
      const found = days.find((d) => d.key === key);
      if (found) found.count += 1;
    }

    const max = Math.max(1, ...days.map((d) => d.count));
    const total = days.reduce((s, d) => s + d.count, 0);
    const lastValue = days[days.length - 1]?.count ?? 0;
    return { points: days, max, total, lastValue };
  }, [submissions, rangeDays]);

  const w = 800;
  const h = 220;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
  const yFor = (v: number) => padT + innerH - (v / max) * innerH;

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${padL + i * stepX} ${yFor(p.count)}`)
    .join(' ');

  const areaPath = `${path} L ${padL + (points.length - 1) * stepX} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((max * i) / yTicks));

  const [hover, setHover] = useState<number | null>(null);

  const xLabelStride = rangeDays <= 7 ? 1 : rangeDays <= 14 ? 2 : 4;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="admin-linechart" role="img" aria-label="Submissions over time">
        <defs>
          <linearGradient id="admin-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212, 240, 0, 0.45)" />
            <stop offset="100%" stopColor="rgba(212, 240, 0, 0)" />
          </linearGradient>
        </defs>

        {yTickValues.map((v, i) => {
          const y = yFor(v);
          return (
            <g key={i}>
              <line className="admin-linechart__grid" x1={padL} x2={w - padR} y1={y} y2={y} />
              <text className="admin-linechart__axis-label" x={padL - 8} y={y + 3} textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}

        <path d={areaPath} className="admin-linechart__area" />
        <path d={path} className="admin-linechart__line" />

        {points.map((p, i) => {
          const x = padL + i * stepX;
          const y = yFor(p.count);
          const showLabel = i % xLabelStride === 0 || i === points.length - 1;
          return (
            <g key={p.key}>
              <circle cx={x} cy={y} r={hover === i ? 5 : 3} className="admin-linechart__point" />
              <rect
                x={x - stepX / 2}
                y={padT}
                width={stepX}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}
              />
              {showLabel && (
                <text className="admin-linechart__axis-label" x={x} y={h - 8} textAnchor="middle">
                  {rangeDays <= 7 ? shortDay(p.date) : formatDayLabel(p.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && points[hover] && (
        <div
          className="admin-linechart__tooltip"
          style={{
            left: `calc(${(padL + hover * stepX) / w * 100}% )`,
            top: `${(yFor(points[hover].count) / h) * 100}%`,
          }}
        >
          {formatDayLabel(points[hover].date)} · {points[hover].count} submission{points[hover].count === 1 ? '' : 's'}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.04em' }}>
        <span>Total in range: {total}</span>
        <span>Today: {lastValue}</span>
      </div>
    </div>
  );
}

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function StatusDonut({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = 150;
  const cx = size / 2;
  const cy = size / 2;
  const r = 56;
  const stroke = 18;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="admin-donut">
      <svg className="admin-donut__svg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Status distribution">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {total > 0 &&
          segments.map((seg) => {
            if (seg.value === 0) return null;
            const len = (seg.value / total) * c;
            const dash = `${len} ${c - len}`;
            const segOffset = c - offset;
            offset += len;
            return (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={segOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${seg.color}55)` }}
              />
            );
          })}
        <text x={cx} y={cy - 2} textAnchor="middle" className="admin-donut__center-value" fill="#fff" fontSize="28" fontWeight="700" fontFamily="var(--font-syne), sans-serif">
          {total}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="var(--font-space-mono), monospace" letterSpacing="2">
          TRACKED
        </text>
      </svg>

      <div className="admin-donut__legend">
        {segments.map((seg) => (
          <div key={seg.label} className="admin-donut__legend-item">
            <div className="admin-donut__legend-left">
              <span className="admin-donut__dot" style={{ background: seg.color, boxShadow: `0 0 6px ${seg.color}55` }} />
              <span className="admin-donut__legend-label">{seg.label}</span>
            </div>
            <span className="admin-donut__legend-value">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TopItem {
  label: string;
  value: number;
}

export function TopDomainsBar({ items }: { items: TopItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', padding: '1.5rem 0' }}>
          No data yet
        </div>
      )}
      {items.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 130, fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </div>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d4f000, #b8d300)',
                  boxShadow: '0 0 8px rgba(212, 240, 0, 0.4)',
                  borderRadius: 999,
                  transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            <div style={{ minWidth: 28, textAlign: 'right', fontSize: '0.75rem', color: '#fff', fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
