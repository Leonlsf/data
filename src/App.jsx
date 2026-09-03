import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <div style={{ fontSize:'1.2rem', color:'#94a3b8' }}>加载中...</div>
    </div>
  )

  if (!data || !data.brands) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <div style={{ fontSize:'1.2rem', color:'#ef4444' }}>暂无数据</div>
    </div>
  )

  const brand = data.brands[activeBrand]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>Brand Pulse</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          品牌资讯日报 · {data.date} · 更新于 {data.lastUpdated?.split('T')[1]?.split('+')[0] || ''}
        </p>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.brands.map((b, i) => (
          <button key={b.brandKey} onClick={() => setActiveBrand(i)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s',
            background: i === activeBrand ? b.brandColor : '#1e293b',
            color: i === activeBrand ? '#0f172a' : '#94a3b8',
            boxShadow: i === activeBrand ? `0 0 12px ${b.brandColor}44` : 'none'
          }}>
            {b.brandName}
          </button>
        ))}
      </nav>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: brand.brandColor, display: 'inline-block' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>{brand.brandName}</h2>
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>共 {brand.news?.length || 0} 条</span>
        </div>
        {brand.news && brand.news.length > 0 ? (
          <ul style={{ listStyle: 'none' }}>
            {brand.news.slice(0, 50).map((item, idx) => (
              <li key={item.id || idx} style={{
                padding: '12px 0', borderBottom: idx < brand.news.slice(0,50).length - 1 ? '1px solid #334155' : 'none',
                display: 'flex', flexDirection: 'column', gap: 4
              }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem', lineHeight: 1.5
                }}>
                  {item.title}
                </a>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: '#64748b' }}>
                  <span>{item.source}</span>
                  <span>{item.publishedAt?.replace('T', ' ').split('+')[0]}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>暂无资讯</p>
        )}
      </div>

      <footer style={{ textAlign: 'center', marginTop: 32, color: '#475569', fontSize: '0.8rem' }}>
        Brand Pulse · 数据来源：新浪财经
      </footer>
    </div>
  )
}

export default App
