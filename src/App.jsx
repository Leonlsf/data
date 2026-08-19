import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #334155', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#94a3b8' }}>加载中...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#ef4444' }}>数据加载失败</p>
      </div>
    )
  }

  const brands = data.brands || []
  const currentBrand = brands[activeBrand]
  const news = currentBrand?.news || []

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Header */}
      <header style={{ padding: '24px 32px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Brand Pulse
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>品牌资讯每日速递</p>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            更新于 {data.lastUpdated?.replace('T', ' ').slice(0, 19)}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 32px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {brands.map((brand, i) => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(i)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: i === activeBrand ? 600 : 400,
                background: i === activeBrand ? brand.brandColor : '#1e293b',
                color: i === activeBrand ? '#fff' : '#94a3b8',
                transition: 'all 0.2s',
                boxShadow: i === activeBrand ? `0 2px 8px ${brand.brandColor}40` : 'none',
              }}
            >
              {brand.brandName}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>({brand.news?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 32px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: '#1e293b', borderRadius: 8, padding: '12px 16px', flex: 1 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>总资讯数</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: currentBrand?.brandColor || '#3b82f6', marginTop: 2 }}>
              {news.length}
            </div>
          </div>
          <div style={{ background: '#1e293b', borderRadius: 8, padding: '12px 16px', flex: 1 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>品牌数量</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3b82f6', marginTop: 2 }}>{brands.length}</div>
          </div>
          <div style={{ background: '#1e293b', borderRadius: 8, padding: '12px 16px', flex: 1 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>数据日期</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#3b82f6', marginTop: 2 }}>{data.date}</div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {news.map((item, i) => (
            <a
              key={item.id || i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '14px 18px',
                background: '#1e293b',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#e2e8f0',
                transition: 'all 0.15s',
                borderLeft: `3px solid ${currentBrand?.brandColor || '#3b82f6'}`,
              }}
              onMouseOver={e => e.currentTarget.style.background = '#334155'}
              onMouseOut={e => e.currentTarget.style.background = '#1e293b'}
            >
              <div style={{ fontSize: 14, lineHeight: 1.5, color: '#f1f5f9' }}>{item.title}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: '#64748b' }}>
                <span>{item.source}</span>
                <span>{item.publishedAt?.replace('T', ' ').slice(0, 16)}</span>
              </div>
            </a>
          ))}
        </div>
        {news.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>暂无资讯数据</div>
        )}
      </div>
    </div>
  )
}

export default App
