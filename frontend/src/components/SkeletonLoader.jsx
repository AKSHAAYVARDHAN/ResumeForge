export function SkeletonDashboard() {
  const Block = ({ w = '100%', h = 20, rounded = 8 }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: rounded }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 0' }}>
      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass" style={{ padding: '24px' }}>
            <Block w="60%" h={12} />
            <div style={{ marginTop: '12px' }}>
              <Block w="40%" h={32} rounded={4} />
            </div>
          </div>
        ))}
      </div>
      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="glass" style={{ padding: '24px', height: '280px' }}>
          <Block w="50%" h={14} />
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
              <div className="skeleton" style={{ width: 140, height: 140, borderRadius: '50%' }} />
            </div>
          </div>
        </div>
        <div className="glass" style={{ padding: '24px', height: '280px' }}>
          <Block w="50%" h={14} />
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[80, 65, 50, 40, 30].map((w, i) => (
              <Block key={i} w={`${w}%`} h={20} rounded={4} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonLine({ width = '100%', height = 16 }) {
  return <div className="skeleton" style={{ width, height, borderRadius: '6px', margin: '4px 0' }} />;
}
