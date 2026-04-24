import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#00d4ff', '#2563eb', '#9333ea', '#10b981', '#f59e0b'];

export default function RoleMatchBarChart({ roles = [] }) {
  if (!roles.length) return null;

  const data = roles.map((r) => ({
    role: r.role?.length > 22 ? r.role.slice(0, 20) + '…' : r.role,
    match: r.match_percentage,
    fullRole: r.role,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'rgba(17,17,17,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
          color: '#e5e5e5',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{payload[0]?.payload?.fullRole}</div>
          <div style={{ color: '#00d4ff' }}>Match: <strong>{payload[0].value}%</strong></div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="role"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="match" radius={[0, 6, 6, 0]} animationDuration={1200} animationBegin={300}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
