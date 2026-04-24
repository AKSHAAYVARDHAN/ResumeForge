import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#00d4ff', '#2563eb', '#9333ea', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export default function SkillPieChart({ skills = [] }) {
  if (!skills.length) return null;

  // Convert skills array to chart data (each skill gets equal weight for visualization)
  const data = skills.slice(0, 8).map((skill, i) => ({
    name: skill,
    value: Math.floor(Math.random() * 30) + 20, // Varied visual weight
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'rgba(17,17,17,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#e5e5e5',
        }}>
          {payload[0].name}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          animationBegin={200}
          animationDuration={1000}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{value}</span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
